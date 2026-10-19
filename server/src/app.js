import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errors.js";
export const app = express();
app.disable("x-powered-by");
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }),
);
app.use(
  cors({
    origin: (process.env.CLIENT_URL || "http://127.0.0.1:5173").split(","),
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use("/api", router);
app.use("/api", (_req, res) =>
  res
    .status(404)
    .json({ success: false, message: "Endpoint not found.", data: null }),
);
const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../client/dist",
);
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { redirect: false }));
  app.get("/{*path}", (req, res) => {
    const candidate = path.resolve(dist, "." + req.path, "index.html");
    if (candidate.startsWith(dist + path.sep) && fs.existsSync(candidate))
      return res.sendFile(candidate);
    const known =
      /^\/(admin(?:\/.*)?|services\/[^/]+|work\/[^/]+|blog\/[^/]+)\/?$/.test(
        req.path,
      );
    res.status(known ? 200 : 404).sendFile(path.join(dist, "index.html"));
  });
}
app.use(errorHandler);
