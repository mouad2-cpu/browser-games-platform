import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB total

const ALLOWED_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".js",
  ".css",
  ".json",
  ".wasm",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".mp3",
  ".ogg",
  ".wav",
  ".mp4",
  ".webm",
  ".ttf",
  ".woff",
  ".woff2",
  ".data",
  ".bin",
  ".pck",
  ".zip",
]);

type FileWithPath = File & { webkitRelativePath?: string };

function safeRelativePath(file: FileWithPath): string {
  const rel = file.webkitRelativePath || file.name;
  const normalized = rel.replace(/\\/g, "/").split("/");
  // Drop top-level folder name from directory uploads (e.g. "MyGame/index.html" → "index.html")
  const parts = normalized.length > 1 ? normalized.slice(1) : normalized;
  const joined = parts.join("/");
  if (joined.includes("..")) throw new Error("Invalid file path");
  return joined || file.name;
}

function isAllowedFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

export async function saveUploadedGame(
  slug: string,
  formData: FormData
): Promise<{ embedPath: string } | { error: string }> {
  const gameDir = path.join(process.cwd(), "public", "uploads", "games", slug);
  await mkdir(gameDir, { recursive: true });

  const indexFile = formData.get("gameIndex") as File | null;
  const folderFiles = formData.getAll("gameFiles") as FileWithPath[];

  let totalSize = 0;

  if (folderFiles.length > 0) {
    for (const file of folderFiles) {
      if (file.size === 0) continue;
      totalSize += file.size;
      if (file.size > MAX_FILE_SIZE) {
        return { error: `File too large: ${file.name} (max 50MB each)` };
      }
      if (totalSize > MAX_TOTAL_SIZE) {
        return { error: "Total upload exceeds 200MB limit" };
      }

      const relPath = safeRelativePath(file);
      if (!isAllowedFile(relPath)) {
        return { error: `File type not allowed: ${relPath}` };
      }

      const dest = path.join(gameDir, relPath);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(await file.arrayBuffer()));
    }
  } else if (indexFile && indexFile.size > 0) {
    if (indexFile.size > MAX_FILE_SIZE) {
      return { error: "index.html exceeds 50MB limit" };
    }
    const name = indexFile.name.toLowerCase();
    if (!name.endsWith(".html") && !name.endsWith(".htm")) {
      return { error: "Upload an index.html file or select a game folder" };
    }
    await writeFile(path.join(gameDir, "index.html"), Buffer.from(await indexFile.arrayBuffer()));
  } else {
    return { error: "Upload index.html or select your game folder" };
  }

  const indexPath = path.join(gameDir, "index.html");
  try {
    const { access } = await import("fs/promises");
    await access(indexPath);
  } catch {
    return { error: "Game folder must contain index.html at the root" };
  }

  return { embedPath: `/uploads/games/${slug}/index.html` };
}
