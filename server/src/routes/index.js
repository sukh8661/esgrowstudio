import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as pub from "../controllers/publicController.js";
import * as admin from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
import { wrap, ok } from "../middleware/errors.js";
export const router = Router();
const limiter = (limit, windowMs = 15 * 60 * 1000) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "A few too many attempts. Please try again later.",
      data: null,
    },
  });
router.get("/health", (_req, res) => ok(res, { status: "ok" }));
router.post("/contact", limiter(10), wrap(pub.lead("contact")));
router.post("/quote", limiter(10), wrap(pub.lead("quote")));
router.post("/newsletter/subscribe", limiter(10), wrap(pub.newsletter));
router.post("/admin/login", limiter(10), wrap(admin.login));
router.use("/admin", auth);
router.get("/admin/me", (req, res) => ok(res, { email: req.user.email }));
router.post("/admin/logout", wrap(admin.logout));
router.get("/admin/stats", wrap(admin.stats));
router.get("/admin/leads/export", wrap(admin.exportLeads));
router.get("/admin/leads", wrap(admin.leads));
router.patch("/admin/leads/:id", wrap(admin.updateLead));
router.delete("/admin/leads/:id", wrap(admin.deleteLead));
router.get("/admin/subscribers", wrap(admin.subscribers));
router.get("/admin/:resource", wrap(admin.list));
router.post("/admin/:resource", wrap(admin.save));
router.put("/admin/:resource/:id", wrap(admin.save));
router.delete("/admin/:resource/:id", wrap(admin.remove));
router.get("/:resource", wrap(pub.list));
router.get("/:resource/:slug", wrap(pub.detail));
