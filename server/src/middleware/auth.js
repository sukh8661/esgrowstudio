import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { AppError, wrap } from "./errors.js";
export const auth = wrap(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : "";
  if (!token) throw new AppError("Please sign in to continue.", 401);
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    throw new AppError("Your session has expired. Please sign in again.", 401);
  }
  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.version)
    throw new AppError("Please sign in again.", 401);
  req.user = user;
  next();
});
