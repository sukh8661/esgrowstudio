import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
const local = path.resolve(".local");
fs.mkdirSync(path.join(local, "mongodb"), { recursive: true });
const windows = "C:/Program Files/MongoDB/Server/8.0/bin/mongod.exe";
const binary =
  process.env.MONGOD_PATH || (fs.existsSync(windows) ? windows : "mongod");
const child = spawn(
  binary,
  [
    "--dbpath",
    path.join(local, "mongodb"),
    "--port",
    "27018",
    "--bind_ip",
    "127.0.0.1",
    "--wiredTigerCacheSizeGB",
    "0.25",
    "--logpath",
    path.join(local, "mongodb.log"),
  ],
  { stdio: "inherit", windowsHide: true },
);
console.log(
  "Project MongoDB: 127.0.0.1:27018 (256 MB cache; data in .local/mongodb)",
);
child.on("error", (e) => {
  console.error("Could not start MongoDB:", e.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code || 0;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
