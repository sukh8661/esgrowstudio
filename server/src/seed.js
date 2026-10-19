import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  services,
  projects,
  posts,
  testimonials,
  faqs,
} from "../../client/src/content.js";
import { User, resources } from "./models/index.js";
if (
  !process.env.MONGODB_URI ||
  !process.env.ADMIN_EMAIL ||
  !process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_PASSWORD.length < 12
)
  throw new Error(
    "Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in server/.env",
  );
await mongoose.connect(process.env.MONGODB_URI);
try {
  for (const [resource, items] of Object.entries({
    services,
    projects,
    blog: posts,
    testimonials,
    faqs,
  })) {
    const Model = resources[resource];
    for (const item of items) {
      const filter = item.slug
        ? { slug: item.slug }
        : resource === "faqs"
          ? { question: item.question }
          : { name: item.name };
      await Model.updateOne(filter, { $setOnInsert: item }, { upsert: true });
    }
    console.log(`${resource}: seed records ready (existing content preserved)`);
  }
  await User.updateOne(
    { email: process.env.ADMIN_EMAIL.toLowerCase() },
    {
      $setOnInsert: {
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
      },
    },
    { upsert: true },
  );
  console.log("Admin account ready. Credentials are read from server/.env.");
} finally {
  await mongoose.disconnect();
}
