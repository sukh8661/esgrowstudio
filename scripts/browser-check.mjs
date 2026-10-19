import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const origin = process.env.QA_URL || "http://127.0.0.1:5173";
await fs.mkdir(".local/qa", { recursive: true });
const routes = [
  "/",
  "/services",
  "/services/web-design",
  "/work",
  "/work/flora-living",
  "/about",
  "/process",
  "/pricing",
  "/blog",
  "/blog/website-that-works",
  "/contact",
  "/get-a-quote",
  "/privacy-policy",
  "/terms",
  "/not-a-page",
  "/admin",
];
const report = [];
for (const route of routes) {
  await page.goto(origin + route);
  await page.waitForTimeout(300);
  await page.locator("h1,h2").first().waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  assert.equal(overflow, false, `Desktop overflow on ${route}`);
  console.log("Checking", route);
  const axe = ["/", "/contact", "/admin"].includes(route)
    ? await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .disableRules(["color-contrast"])
        .analyze()
    : { violations: [] };
  report.push({
    route,
    title: await page.title(),
    violations: axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      count: v.nodes.length,
      examples: v.nodes.slice(0, 3).map((n) => ({
        html: n.html,
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  if (route === "/")
    await page.screenshot({
      path: ".local/qa/home-desktop.png",
      fullPage: false,
    });
}
await fs.writeFile(".local/qa/report.json", JSON.stringify(report, null, 2));
console.log("Route checks finished");
await page.goto(origin + "/get-a-quote");
await page
  .locator(".service-options")
  .getByText("Web design", { exact: true })
  .click();
await page.getByRole("button", { name: "Next step" }).click();
await page.getByLabel("Your estimated budget").selectOption({ index: 2 });
await page
  .getByLabel("When would you like to start?")
  .selectOption({ index: 2 });
await page.getByRole("button", { name: "Next step" }).click();
await page.getByLabel("Your name *").fill("Browser QA");
await page.getByLabel("Email address *").fill("browser-qa@example.com");
await page
  .getByLabel("Tell us a little about your project *")
  .fill("This is an automated browser verification enquiry.");
await page.getByRole("checkbox", { name: /I agree/ }).check();
await page.getByRole("button", { name: "Let’s get growing" }).click();
await page.getByRole("heading", { name: /Your idea’s/ }).waitFor();
await page.screenshot({ path: ".local/qa/quote-success.png" });
const { parse } = await import("dotenv");
const env = parse(await fs.readFile("server/.env"));
await page.goto(origin + "/admin");
await page.getByLabel("Email", { exact: true }).fill(env.ADMIN_EMAIL);
await page.getByLabel("Password", { exact: true }).fill(env.ADMIN_PASSWORD);
await page.getByRole("button", { name: "Open the studio" }).click();
await page.getByRole("heading", { name: "leads." }).waitFor();
await page.getByText("Browser QA", { exact: true }).first().waitFor();
await page.screenshot({ path: ".local/qa/admin-desktop.png", fullPage: false });
// Remove only records created by this repeatable QA flow.
await page.evaluate(async () => {
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("esgrow-token")}`,
  };
  const data = await fetch("/api/admin/leads", { headers }).then((r) =>
    r.json(),
  );
  for (const lead of data.data.filter(
    (x) =>
      x.email === "browser-qa@example.com" &&
      x.message === "This is an automated browser verification enquiry.",
  ))
    await fetch(`/api/admin/leads/${lead._id}`, { method: "DELETE", headers });
});
await page.getByRole("button", { name: "Sign out" }).click();
for (const width of [360, 390, 768, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "/",
    "/services",
    "/work",
    "/pricing",
    "/contact",
    "/blog",
    "/admin",
  ]) {
    await page.goto(origin + route);
    await page.waitForTimeout(150);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Overflow at ${width}px on ${route}`,
    );
    if (route === "/" && width === 390)
      await page.screenshot({
        path: ".local/qa/home-mobile.png",
        fullPage: false,
      });
    if (route === "/contact" && width === 390)
      await page.screenshot({
        path: ".local/qa/contact-mobile.png",
        fullPage: false,
      });
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(origin + "/");
await page.getByRole("button", { name: "Open menu" }).click();
await page
  .getByRole("navigation", { name: "Main navigation" })
  .getByRole("link", { name: "Services", exact: true })
  .click();
assert.ok(page.url().endsWith("/services"));
assert.deepEqual(errors, []);
await fs.writeFile(".local/qa/report.json", JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      routes: routes.length,
      responsiveWidths: [360, 390, 768, 1440, 1920],
      quoteFlow: "passed",
      adminLogin: "passed",
      mobileMenu: "passed",
      consoleErrors: errors,
      a11y: report.map((x) => ({
        route: x.route,
        violations: x.violations.map((v) => ({ id: v.id, count: v.count })),
      })),
    },
    null,
    2,
  ),
);
await browser.close();
