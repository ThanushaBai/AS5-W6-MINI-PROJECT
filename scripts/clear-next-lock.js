import fs from "fs";
import path from "path";

const lockPath = path.join(process.cwd(), ".next", "dev", "lock");

try {
  if (fs.existsSync(lockPath)) {
    fs.rmSync(lockPath, { force: true });
    console.log("Removed stale lock:", lockPath);
  }
} catch (error) {
  console.warn("Could not remove .next/dev/lock. If dev is already running, stop it first.");
  console.warn(String(error));
}
