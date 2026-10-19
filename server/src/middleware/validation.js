import { z } from "zod";
// Store plain text, never HTML. Reject unknown keys to prevent mass assignment.
const plain = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) =>
      v
        .replace(/<[^>]*>/g, "")
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""),
    );
const required = (max = 200, min = 1) => plain(max).pipe(z.string().min(min));
export const email = z
  .email()
  .max(254)
  .transform((v) => v.toLowerCase());
export const leadSchema = z
  .object({
    name: required(100),
    email,
    phone: plain(30).optional().default(""),
    company: plain(160).optional().default(""),
    message: required(5000, 10),
    services: z.array(required(100)).min(1).max(9),
    budget: required(100),
    timeline: required(100),
    package: plain(100).optional().default(""),
    consent: z.literal(true),
    website: plain(500).optional().default(""),
  })
  .strict();
export const newsletterSchema = z
  .object({ email, website: plain(500).optional().default("") })
  .strict();
export const loginSchema = z
  .object({ email, password: z.string().min(1).max(200) })
  .strict();
const slug = () =>
  z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(150);
const list = () => z.array(required(1000)).min(1).max(30);
export const contentSchemas = {
  services: z
    .object({
      slug: slug(),
      title: required(),
      short: required(),
      description: required(2000),
      items: list(),
      icon: required(50),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    })
    .strict(),
  projects: z
    .object({
      slug: slug(),
      name: required(),
      category: required(),
      tag: required(),
      description: required(2000),
      type: z.enum(["flora", "forma", "ritual"]),
      services: list(),
      challenge: required(3000),
      solution: required(3000),
      results: list(),
    })
    .strict(),
  blog: z
    .object({
      slug: slug(),
      title: required(),
      category: required(),
      read: z.number().int().min(1).max(120),
      excerpt: required(1000),
      body: z.array(required(10000)).min(1).max(50),
    })
    .strict(),
  testimonials: z
    .object({
      name: required(),
      role: required(),
      quote: required(3000),
      result: required(),
    })
    .strict(),
  faqs: z.object({ question: required(500), answer: required(3000) }).strict(),
};
export const statusSchema = z
  .object({ status: z.enum(["new", "contacted", "qualified", "closed"]) })
  .strict();
export const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(6),
  search: z.string().max(200).default(""),
  category: z.string().max(100).default(""),
});
