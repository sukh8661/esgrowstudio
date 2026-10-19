import * as service from "../services/contentService.js";
import { leadSchema, newsletterSchema } from "../middleware/validation.js";
import { ok } from "../middleware/errors.js";
import { notifyLead } from "../services/mailService.js";
export const list = async (req, res) =>
  ok(res, await service.list(req.params.resource, req.query));
export const detail = async (req, res) =>
  ok(res, await service.detail(req.params.resource, req.params.slug));
export const lead = (type) => async (req, res) => {
  const record = await service.createLead(leadSchema.parse(req.body), type);
  ok(res, { id: record?.id || null }, "Your enquiry has been received.", 201);
  if (record)
    notifyLead(record).catch((err) =>
      console.error("Notification status update failed", err.message),
    );
};
export const newsletter = async (req, res) => {
  await service.subscribe(newsletterSchema.parse(req.body));
  ok(res, null, "You’re on the list.", 201);
};
