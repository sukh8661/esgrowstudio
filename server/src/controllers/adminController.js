import * as service from "../services/adminService.js";
import {
  loginSchema,
  statusSchema,
  contentSchemas,
} from "../middleware/validation.js";
import { ok } from "../middleware/errors.js";
import { getModel, csv } from "../services/contentService.js";
export async function login(req, res) {
  ok(res, await service.login(loginSchema.parse(req.body)));
}
export async function logout(req, res) {
  await service.logout(req.user);
  ok(res, null, "Signed out.");
}
export async function stats(req, res) {
  ok(res, await service.stats());
}
export async function leads(req, res) {
  ok(res, await service.leads(req.query.status));
}
export async function updateLead(req, res) {
  ok(
    res,
    await service.updateLead(req.params.id, statusSchema.parse(req.body)),
  );
}
export async function deleteLead(req, res) {
  await service.deleteLead(req.params.id);
  ok(res, null, "Lead deleted.");
}
export async function exportLeads(req, res) {
  res
    .type("text/csv")
    .attachment("esgrow-leads.csv")
    .send(csv(await service.allLeads()));
}
export async function subscribers(req, res) {
  ok(res, await service.subscribers());
}
export async function list(req, res) {
  ok(res, await service.list(req.params.resource));
}
export async function save(req, res) {
  getModel(req.params.resource);
  const data = contentSchemas[req.params.resource].parse(req.body);
  ok(
    res,
    await service.save(req.params.resource, req.params.id, data),
    "Saved.",
    req.params.id ? 200 : 201,
  );
}
export async function remove(req, res) {
  await service.remove(req.params.resource, req.params.id);
  ok(res, null, "Deleted.");
}
