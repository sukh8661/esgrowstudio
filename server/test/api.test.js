import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import { parse } from "dotenv";
import { User, Lead, Subscriber } from "../src/models/index.js";
import { csv } from "../src/services/contentService.js";
process.env.JWT_SECRET = randomBytes(48).toString("hex");
process.env.CLIENT_URL = "http://127.0.0.1:5173";
const { app } = await import("../src/app.js");
let server, base, token;
const password = randomBytes(18).toString("hex");
const valid = {
  name: "API Test",
  email: "test@example.com",
  services: ["Web design"],
  budget: "₹25,000 – ₹50,000",
  timeline: "Within a month",
  message: "A meaningful project enquiry.",
  consent: true,
  website: "",
};
async function request(path, method = "GET", body, auth = false) {
  const res = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, json: await res.json() };
}
before(async () => {
  const local = fs.existsSync("server/.env")
    ? parse(fs.readFileSync("server/.env"))
    : {};
  const uri = new URL(
    process.env.TEST_MONGODB_URI ||
      local.MONGODB_URI ||
      "mongodb://127.0.0.1:27017",
  );
  if (!process.env.TEST_MONGODB_URI)
    uri.pathname = `/esgrow_test_${randomBytes(6).toString("hex")}`;
  if (!uri.pathname.startsWith("/esgrow_test_"))
    throw Error("Test database name must start with esgrow_test_");
  await mongoose.connect(uri.toString(), { serverSelectionTimeoutMS: 5000 });
  await User.create({
    email: "test-admin@example.com",
    password: await bcrypt.hash(password, 10),
  });
  server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
  if (server) await new Promise((r) => server.close(r));
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.connection.name.startsWith("esgrow_test_")
  )
    await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
test("rejects invalid and privilege-escalating enquiries", async () => {
  const a = await request("/quote", "POST", { ...valid, email: "invalid" });
  assert.equal(a.status, 422);
  const b = await request("/quote", "POST", { ...valid, status: "closed" });
  assert.equal(b.status, 422);
  assert.equal(await Lead.countDocuments(), 0);
});
test("persists a valid enquiry and strips markup", async () => {
  const r = await request("/quote", "POST", {
    ...valid,
    name: "<b>API Test</b>",
  });
  assert.equal(r.status, 201);
  const lead = await Lead.findById(r.json.data.id);
  assert.equal(lead.name, "API Test");
  assert.equal(lead.status, "new");
  assert.equal(lead.type, "quote");
});
test("honeypot silently discards spam", async () => {
  const before = await Lead.countDocuments();
  const r = await request("/contact", "POST", {
    ...valid,
    website: "spam.example",
  });
  assert.equal(r.status, 201);
  assert.equal(await Lead.countDocuments(), before);
});
test("newsletter subscription is idempotent", async () => {
  await request("/newsletter/subscribe", "POST", {
    email: "reader@example.com",
  });
  await request("/newsletter/subscribe", "POST", {
    email: "reader@example.com",
  });
  assert.equal(await Subscriber.countDocuments(), 1);
});
test("protects admin resources, handles CRUD and revokes logged-out JWTs", async () => {
  assert.equal((await request("/admin/leads")).status, 401);
  assert.equal(
    (
      await request("/admin/login", "POST", {
        email: "test-admin@example.com",
        password: "incorrect",
      })
    ).status,
    401,
  );
  const login = await request("/admin/login", "POST", {
    email: "test-admin@example.com",
    password,
  });
  assert.equal(login.status, 200);
  token = login.json.data.token;
  assert.equal((await request("/admin/me", "GET", null, true)).status, 200);
  const blog = {
    slug: "test-story",
    title: "A useful story",
    category: "Strategy",
    read: 4,
    excerpt: "A practical note about growth.",
    body: ["Start with a clear business goal."],
  };
  const create = await request("/admin/blog", "POST", blog, true);
  assert.equal(create.status, 201);
  const id = create.json.data._id;
  assert.equal((await request("/blog/test-story")).json.data.title, blog.title);
  assert.equal(
    (
      await request(
        "/admin/blog/" + id,
        "PUT",
        { ...blog, title: "Updated story" },
        true,
      )
    ).status,
    200,
  );
  assert.equal((await request("/blog?search=Updated")).json.data.total, 1);
  const leads = await request("/admin/leads", "GET", null, true);
  assert.equal(
    (
      await request(
        "/admin/leads/" + leads.json.data[0]._id,
        "PATCH",
        { status: "qualified" },
        true,
      )
    ).json.data.status,
    "qualified",
  );
  assert.equal(
    (await request("/admin/blog/" + id, "DELETE", null, true)).status,
    200,
  );
  assert.equal((await request("/blog/test-story")).status, 404);
  await request("/admin/logout", "POST", {}, true);
  assert.equal((await request("/admin/me", "GET", null, true)).status, 401);
});
test("CSV escapes spreadsheet formulas and quotes", () => {
  const text = csv([{ name: '=HYPERLINK("bad")', email: "test@example.com" }]);
  assert.ok(text.includes('"\'=HYPERLINK(""bad"")"'));
});
