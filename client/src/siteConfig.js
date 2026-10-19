export const siteConfig = {
  name: "Esgrow Studio",
  tagline: "From Roots to Results",
  url: import.meta.env.VITE_SITE_URL || "https://esgrow.studio",
  email: "hello@esgrow.studio", // TODO: replace/verify before launch
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "", // TODO: replace
  location: "Working remotely. Growing together.", // TODO: replace with registered address
  socials: {}, // TODO: add verified social profile URLs
  // TODO: replace indicative pricing, example projects, team and testimonials with verified details.
  pricing: [
    {
      name: "Seed",
      subtitle: "A strong place to start.",
      once: 25000,
      monthly: 8000,
      features: [
        "Up to 5 thoughtfully designed pages",
        "Responsive design & development",
        "Essential on-page SEO",
        "Contact form & analytics",
        "30 days of launch support",
      ],
    },
    {
      name: "Grow",
      subtitle: "Built to turn visitors into customers.",
      once: 55000,
      monthly: 18000,
      features: [
        "Up to 12 custom-designed pages",
        "Conversion-focused copy & journeys",
        "CMS or e-commerce integration",
        "Technical SEO & performance setup",
        "60 days of launch support",
      ],
      featured: true,
    },
    {
      name: "Flourish",
      subtitle: "A complete digital growth engine.",
      once: 95000,
      monthly: 35000,
      features: [
        "Custom website or web application",
        "Growth strategy & funnel planning",
        "Advanced integrations & tracking",
        "SEO, content & campaign roadmap",
        "Dedicated ongoing support",
      ],
    },
  ],
};
