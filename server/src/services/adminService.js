import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Lead, Subscriber, resources } from "../models/index.js";
import { AppError } from "../middleware/errors.js";
import { getModel } from "./contentService.js";
export async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new AppError("Email or password is incorrect.", 401);
  return {
    token: jwt.sign({ version: user.tokenVersion }, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "8h",
      algorithm: "HS256",
    }),
    email: user.email,
  };
}
export async function logout(user) {
  await User.findByIdAndUpdate(user.id, { $inc: { tokenVersion: 1 } });
}
export async function stats() {
  const [leads, newLeads, subscribers, projects, blog] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "new" }),
    Subscriber.countDocuments(),
    resources.projects.countDocuments(),
    resources.blog.countDocuments(),
  ]);
  return { leads, newLeads, subscribers, projects, blog };
}
export async function leads(status) {
  if (status && !["new", "contacted", "qualified", "closed"].includes(status))
    throw new AppError("Invalid lead status.");
  return Lead.find(status ? { status } : {})
    .sort({ createdAt: -1 })
    .limit(1000);
}
export async function updateLead(id, data) {
  const record = await Lead.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!record) throw new AppError("Lead not found.", 404);
  return record;
}
export async function deleteLead(id) {
  if (!(await Lead.findByIdAndDelete(id)))
    throw new AppError("Lead not found.", 404);
}
export async function allLeads() {
  return Lead.find().sort({ createdAt: -1 }).lean();
}
export async function subscribers() {
  return Subscriber.find().sort({ createdAt: -1 }).limit(1000);
}
export async function list(resource) {
  return getModel(resource).find().sort({ createdAt: -1 });
}
export async function save(resource, id, data) {
  const Model = getModel(resource);
  const record = id
    ? await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
    : await Model.create(data);
  if (!record) throw new AppError("Record not found.", 404);
  return record;
}
export async function remove(resource, id) {
  if (!(await getModel(resource).findByIdAndDelete(id)))
    throw new AppError("Record not found.", 404);
}
