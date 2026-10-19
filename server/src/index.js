import dotenv from "dotenv";
dotenv.config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw new Error(
    "Set JWT_SECRET to at least 32 random characters in server/.env",
  );
if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI in server/.env");
const { default: mongoose } = await import("mongoose");
await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});
const { app } = await import("./app.js");
const server = app.listen(
  Number(process.env.PORT || 5000),
  process.env.HOST || "0.0.0.0",
  () =>
    console.log(
      `Esgrow API ready at http://127.0.0.1:${process.env.PORT || 5000}`,
    ),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    }),
  );
