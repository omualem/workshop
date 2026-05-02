import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function candidatePaths(file: string) {
  return [
    path.resolve(process.cwd(), "logos", file),
    path.resolve(process.cwd(), "..", "logos", file),
    path.resolve(process.cwd(), "..", "..", "logos", file),
  ];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const ext = path.extname(file).toLowerCase();
  const contentType = MIME_BY_EXT[ext];

  if (!contentType) {
    return NextResponse.json({ error: "Unsupported logo type" }, { status: 404 });
  }

  for (const filePath of candidatePaths(file)) {
    try {
      const buffer = await readFile(filePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ error: "Logo not found" }, { status: 404 });
}
