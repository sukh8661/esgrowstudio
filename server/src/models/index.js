import mongoose from "mongoose";
const { Schema, model } = mongoose;
const opts = {
  timestamps: true,
  toJSON: {
    transform: (_d, r) => {
      r.id = r._id.toString();
      delete r.__v;
      return r;
    },
  },
};
const contentSchema = (shape) => new Schema(shape, { ...opts, strict: true });
export const User = model(
  "User",
  contentSchema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    tokenVersion: { type: Number, default: 0 },
  }),
);
export const Lead = model(
  "Lead",
  contentSchema({
    name: String,
    email: String,
    phone: String,
    company: String,
    message: String,
    services: [String],
    budget: String,
    timeline: String,
    package: String,
    consent: Boolean,
    type: { type: String, enum: ["contact", "quote"] },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed"],
      default: "new",
    },
    notification: { type: String, default: "pending" },
  }),
);
export const Subscriber = model(
  "Subscriber",
  contentSchema({ email: { type: String, unique: true, required: true } }),
);
export const Service = model(
  "Service",
  contentSchema({
    slug: { type: String, unique: true },
    title: String,
    short: String,
    description: String,
    items: [String],
    icon: String,
    color: String,
  }),
);
export const Project = model(
  "Project",
  contentSchema({
    slug: { type: String, unique: true },
    name: String,
    category: String,
    tag: String,
    description: String,
    type: String,
    services: [String],
    challenge: String,
    solution: String,
    results: [String],
  }),
);
export const BlogPost = model(
  "BlogPost",
  contentSchema({
    slug: { type: String, unique: true },
    title: String,
    category: String,
    read: Number,
    excerpt: String,
    body: [String],
  }),
);
export const Testimonial = model(
  "Testimonial",
  contentSchema({ name: String, role: String, quote: String, result: String }),
);
export const FAQ = model(
  "FAQ",
  contentSchema({ question: String, answer: String }),
);
export const resources = {
  services: Service,
  projects: Project,
  blog: BlogPost,
  testimonials: Testimonial,
  faqs: FAQ,
};
