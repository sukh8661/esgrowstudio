import { createServer } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import {
  services as seedServices,
  projects as seedProjects,
  posts as seedPosts,
  faqs as seedFaqs,
  testimonials as seedTestimonials,
} from "../client/src/content.js";
import { parse } from "dotenv";
const root = path.resolve("client");
const template = await fs.readFile(path.join(root, "dist/index.html"), "utf8");
let env = {};
try {
  env = parse(await fs.readFile(path.join(root, ".env")));
} catch {}
const site =
  env.VITE_SITE_URL || process.env.VITE_SITE_URL || "https://esgrow.studio";
let content = {
  services: seedServices,
  projects: seedProjects,
  blog: seedPosts,
  faqs: seedFaqs,
  testimonials: seedTestimonials,
};
// Optional production API snapshots keep CMS additions and crawler HTML in sync.
const contentApi = process.env.CONTENT_API_URL || env.CONTENT_API_URL;
if (contentApi) {
  async function fetchData(resource) {
    const r = await fetch(`${contentApi.replace(/\/$/, "")}/${resource}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) throw Error(`Cannot snapshot ${resource}: HTTP ${r.status}`);
    return (await r.json()).data;
  }
  for (const key of ["services", "projects", "faqs", "testimonials"])
    content[key] = await fetchData(key);
  const first = await fetchData("blog?limit=100&page=1");
  content.blog = first.items;
  for (let page = 2; page <= first.pages; page++)
    content.blog.push(
      ...(await fetchData(`blog?limit=100&page=${page}`)).items,
    );
}
const { services, projects, blog: posts, faqs } = content;
const routes = [
  "/",
  "/services",
  "/work",
  "/about",
  "/process",
  "/pricing",
  "/blog",
  "/contact",
  "/get-a-quote",
  "/privacy-policy",
  "/terms",
  ...services.map((x) => "/services/" + x.slug),
  ...projects.map((x) => "/work/" + x.slug),
  ...posts.map((x) => "/blog/" + x.slug),
];
const escape = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const vite = await createServer({
  root,
  configFile: path.join(root, "vite.config.js"),
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
  for (const route of routes) {
    const parts = route.split("/").filter(Boolean);
    const item =
      parts[0] === "services"
        ? services.find((x) => x.slug === parts[1])
        : parts[0] === "work"
          ? projects.find((x) => x.slug === parts[1])
          : parts[0] === "blog"
            ? posts.find((x) => x.slug === parts[1])
            : null;
    const names = {
      "": "Digital experiences, rooted in strategy",
      services: "Our services",
      work: "Selected work",
      about: "About our studio",
      process: "Our process",
      pricing: "Website & growth packages",
      blog: "Field notes",
      contact: "Let’s grow together",
      "get-a-quote": "Start your project",
      "privacy-policy": "Privacy policy",
      terms: "Terms of service",
    };
    const title =
      (item?.title || item?.name || names[parts[0] || ""] || "Page not found") +
      " | Esgrow Studio";
    const description =
      item?.description ||
      item?.excerpt ||
      "Web design, development, SEO and digital strategy for businesses ready to grow. Esgrow Studio — From Roots to Results.";
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Esgrow Studio",
        url: site,
        slogan: "From Roots to Results",
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Esgrow Studio",
        url: site,
        areaServed: "Worldwide",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Home", "@type": "ListItem", position: 1, item: site },
          ...parts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: p.replaceAll("-", " "),
            item: site + "/" + parts.slice(0, i + 1).join("/"),
          })),
        ],
      },
    ];
    if (item && parts[0] === "services")
      schema.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: item.title,
        description: item.description,
        provider: { "@type": "Organization", name: "Esgrow Studio" },
      });
    if (item && parts[0] === "blog")
      schema.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: item.title,
        description: item.excerpt,
        author: { "@type": "Organization", name: "Esgrow Studio" },
        mainEntityOfPage: site + route,
      });
    if (route === "/")
      schema.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((x) => ({
          "@type": "Question",
          name: x.question,
          acceptedAnswer: { "@type": "Answer", text: x.answer },
        })),
      });
    const head = `<link rel="canonical" href="${escape(site + route)}"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/><meta property="og:url" content="${escape(site + route)}"/><meta property="og:type" content="${parts[0] === "blog" && item ? "article" : "website"}"/><meta property="og:image" content="${escape(site)}/og-image.png"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(title)}"/><meta name="twitter:description" content="${escape(description)}"/><script type="application/ld+json" id="structured-data">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;
    const html = template
      .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(
        /<meta name="description" content="[^"]*"\s*\/>/,
        `<meta name="description" content="${escape(description)}"/>`,
      )
      .replace("</head>", head + "</head>")
      .replace(
        '<div id="root"></div>',
        `<div id="root" data-prerender-path="${escape(route)}">${await render(route, content)}</div><script id="esgrow-content" type="application/json">${JSON.stringify(content).replace(/</g, "\\u003c")}</script>`,
      );
    const dir = path.join(root, "dist", route.slice(1));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.html"), html);
  }
  await fs.writeFile(
    path.join(root, "dist/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${escape(site + r)}</loc></url>`).join("")}</urlset>`,
  );
  await fs.writeFile(
    path.join(root, "dist/robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${site}/sitemap.xml\n`,
  );
  console.log(
    `Pre-rendered ${routes.length} routes with canonical metadata, structured data and sitemap.`,
  );
} finally {
  await vite.close();
}
