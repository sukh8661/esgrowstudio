import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { siteConfig } from "./siteConfig";
import { services, projects, posts, faqs } from "./content";
import { api } from "./api";
import { ContentContext } from "./ContentContext";
export default function SEO() {
  const { pathname } = useLocation();
  const content = useContext(ContentContext);
  const [remote, setRemote] = useState(null);
  useEffect(() => {
    let active = true;
    setRemote(null);
    const [, section, slug] = pathname.split("/");
    const resource = { services: "services", work: "projects", blog: "blog" }[
      section
    ];
    if (resource && slug)
      api(`/${resource}/${slug}`)
        .then((item) => {
          if (active) setRemote({ pathname, item });
        })
        .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const item =
      remote?.pathname === pathname
        ? remote.item
        : parts[0] === "services"
          ? (content.services || services).find((x) => x.slug === parts[1])
          : parts[0] === "work"
            ? (content.projects || projects).find((x) => x.slug === parts[1])
            : parts[0] === "blog"
              ? (content.blog || posts).find((x) => x.slug === parts[1])
              : null;
    const labels = {
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
      admin: "Studio workspace",
    };
    const title =
      (item?.title ||
        item?.name ||
        labels[parts[0] || ""] ||
        "Page not found") + " | Esgrow Studio";
    const description =
      item?.description ||
      item?.excerpt ||
      "Web design, development, SEO and digital strategy for businesses ready to grow. Esgrow Studio — From Roots to Results.";
    document.title = title;
    function meta(key, value, property = false) {
      let el = document.head.querySelector(
        `meta[${property ? "property" : "name"}="${key}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(property ? "property" : "name", key);
        document.head.append(el);
      }
      el.content = value;
    }
    meta("description", description);
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("og:type", parts[0] === "blog" && item ? "article" : "website", true);
    meta("og:url", siteConfig.url + pathname, true);
    meta("og:image", siteConfig.url + "/og-image.png", true);
    meta("twitter:card", "summary_large_image");
    meta("twitter:title", title);
    meta("twitter:description", description);
    meta(
      "robots",
      pathname.startsWith("/admin") ? "noindex, nofollow" : "index, follow",
    );
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = siteConfig.url + pathname;
    document.getElementById("structured-data")?.remove();
    const node = document.createElement("script");
    node.id = "structured-data";
    node.type = "application/ld+json";
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: siteConfig.url + "/favicon.svg",
        slogan: siteConfig.tagline,
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        url: siteConfig.url,
        description: "Web design, development and digital growth services",
        areaServed: "Worldwide",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            name: "Home",
            "@type": "ListItem",
            position: 1,
            item: siteConfig.url,
          },
          ...parts.map((part, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: part.replaceAll("-", " "),
            item: siteConfig.url + "/" + parts.slice(0, i + 1).join("/"),
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
        provider: { "@type": "Organization", name: siteConfig.name },
      });
    if (item && parts[0] === "blog")
      schema.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: item.title,
        description: item.excerpt,
        author: { "@type": "Organization", name: siteConfig.name },
        mainEntityOfPage: siteConfig.url + pathname,
      });
    if (pathname === "/")
      schema.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((x) => ({
          "@type": "Question",
          name: x.question,
          acceptedAnswer: { "@type": "Answer", text: x.answer },
        })),
      });
    node.textContent = JSON.stringify(schema);
    document.head.append(node);
  }, [pathname, remote, content]);
  return null;
}
