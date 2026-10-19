import { resources, Lead, Subscriber } from "../models/index.js";
import { AppError } from "../middleware/errors.js";
import { querySchema } from "../middleware/validation.js";
const escapeRegex = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function getModel(resource) {
  if (!resources[resource]) throw new AppError("Resource not found.", 404);
  return resources[resource];
}
export async function list(resource, query) {
  const Model = getModel(resource);
  if (resource !== "blog") return Model.find().sort({ createdAt: 1 }).lean();
  const { page, limit, search, category } = querySchema.parse(query);
  const filter = {};
  if (category) filter.category = category;
  if (search)
    filter.$or = [
      { title: { $regex: escapeRegex(search), $options: "i" } },
      { excerpt: { $regex: escapeRegex(search), $options: "i" } },
    ];
  const [items, total] = await Promise.all([
    Model.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ]);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}
export async function detail(resource, slug) {
  const record = await getModel(resource).findOne({ slug }).lean();
  if (!record) throw new AppError("This page could not be found.", 404);
  return record;
}
export async function createLead(data, type) {
  if (data.website) return null;
  delete data.website;
  return Lead.create({ ...data, type });
}
export async function subscribe(data) {
  if (data.website) return null;
  return Subscriber.findOneAndUpdate(
    { email: data.email },
    { $setOnInsert: { email: data.email } },
    { upsert: true, new: true },
  );
}
export function csv(leads) {
  const cell = (v) =>
    '"' +
    String(v ?? "")
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replace(/"/g, '""') +
    '"';
  const headers = [
    "name",
    "email",
    "phone",
    "company",
    "services",
    "budget",
    "timeline",
    "message",
    "type",
    "status",
    "createdAt",
  ];
  return (
    "\uFEFF" +
    [
      headers.join(","),
      ...leads.map((l) =>
        headers
          .map((k) => cell(Array.isArray(l[k]) ? l[k].join("; ") : l[k]))
          .join(","),
      ),
    ].join("\r\n")
  );
}
