import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const filesToEnsure = [
  [".env.example", ".env"],
  ["apps/api/.env.example", "apps/api/.env"],
  ["apps/web/.env.example", "apps/web/.env.local"],
];

for (const [sourceRelative, targetRelative] of filesToEnsure) {
  const source = path.join(repoRoot, sourceRelative);
  const target = path.join(repoRoot, targetRelative);

  if (!fs.existsSync(source) || fs.existsSync(target)) {
    continue;
  }

  fs.copyFileSync(source, target);
  console.log(`Created ${targetRelative} from ${sourceRelative}`);
}
