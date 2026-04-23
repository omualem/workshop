import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const dbFiles = [
  "apps/api/prisma/dev.db",
  "apps/api/prisma/dev.db-journal",
  "apps/api/prisma/dev.db-shm",
  "apps/api/prisma/dev.db-wal",
];

for (const relativePath of dbFiles) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (fs.existsSync(absolutePath)) {
    fs.rmSync(absolutePath, { force: true });
    console.log(`Removed ${relativePath}`);
  }
}
