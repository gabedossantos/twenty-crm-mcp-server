import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { existsSync } from "fs";

const currentFile = fileURLToPath(import.meta.url);
const distDir = path.dirname(currentFile);
const projectRoot = path.resolve(distDir, "..", "..");

const envFiles = [".env.local", ".env"];

for (const fileName of envFiles) {
  const fullPath = path.join(projectRoot, fileName);
  if (existsSync(fullPath)) {
    config({ path: fullPath, override: false });
  }
}
