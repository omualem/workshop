import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["apps/web/src"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);
const patterns = [
  { name: "replacement-character", value: "\uFFFD" },
  { name: "visible-bom", value: "\u00ef\u00bb\u00bf" },
  { name: "utf8-as-latin-yod", value: "\u00d7\u2122" },
  { name: "utf8-as-latin-shin", value: "\u00d7\u00a9" },
  { name: "utf8-as-latin-lamed", value: "\u00d7\u0153" },
  { name: "cp1255-gimel-low-quote", value: "\u05d2\u201a" },
  { name: "cp1255-gimel-dagger", value: "\u05d2\u2020" },
  { name: "cp1255-gimel-double-dagger", value: "\u05d2\u2021" },
  { name: "cp1255-gimel-permille", value: "\u05d2\u2030" },
  { name: "cp1255-final-nun-inverted", value: "\u05df\u00bf\u00bd" },
];

function listFiles(root) {
  const files = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...listFiles(path));
      continue;
    }
    const ext = path.slice(path.lastIndexOf("."));
    if (extensions.has(ext)) files.push(path);
  }
  return files;
}

const matches = [];

for (const file of roots.flatMap(listFiles)) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    const hit = patterns.find((pattern) => line.includes(pattern.value));
    if (hit) {
      matches.push(`${file}:${index + 1}: ${hit.name}: ${line.trim()}`);
    }
  });
}

if (matches.length > 0) {
  console.error(matches.join("\n"));
  process.exit(1);
}

console.log("No Hebrew mojibake patterns found in apps/web/src.");
