import nodemailer from "nodemailer";
import { Lead } from "../models/index.js";
const escape = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export async function notifyLead(lead) {
  if (!process.env.SMTP_HOST) {
    await Lead.findByIdAndUpdate(lead.id, { notification: "not-configured" });
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.STUDIO_EMAIL,
      replyTo: lead.email,
      subject: `New ${lead.type} enquiry — ${lead.name.replace(/[\r\n]/g, " ")}`,
      html: `<h2>A new idea is growing.</h2><p>${escape(lead.name)} · ${escape(lead.email)}</p><p>${escape(lead.services.join(", "))}</p><p>${escape(lead.budget)} · ${escape(lead.timeline)}</p><p>${escape(lead.message)}</p>`,
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: lead.email,
      subject: "Your next chapter starts here — Esgrow Studio",
      text: `Hi ${lead.name},\n\nThanks for sharing your project. Your enquiry is safely with us. We’ll review the details and get back to you, usually within two business days.\n\nFrom Roots to Results,\nEsgrow Studio`,
    });
    await Lead.findByIdAndUpdate(lead.id, { notification: "sent" });
  } catch (err) {
    console.error("Lead email delivery failed:", err.message);
    await Lead.findByIdAndUpdate(lead.id, { notification: "failed" });
  }
}
