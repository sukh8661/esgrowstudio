export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export const ok = (res, data, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === "ZodError")
    return res.status(422).json({
      success: false,
      message: err.issues
        .map((x) => `${x.path.join(".")}: ${x.message}`)
        .join("; "),
      data: null,
    });
  if (err.code === 11000)
    return res.status(409).json({
      success: false,
      message: "This record already exists.",
      data: null,
    });
  if (err.name === "CastError")
    return res.status(400).json({
      success: false,
      message: "Invalid record identifier.",
      data: null,
    });
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.status
      ? err.message
      : "We could not complete your request. Please try again.",
    data: null,
  });
}
