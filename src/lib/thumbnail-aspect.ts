import fs from "fs";
import path from "path";

const DEFAULT_ASPECT = 16 / 10;

type Dimensions = { width: number; height: number };

function parseAspectFromUrl(url: string): number | null {
  const picsum = url.match(/\/(\d{2,4})\/(\d{2,4})(?:[/?#]|$)/);
  if (picsum) {
    const width = Number(picsum[1]);
    const height = Number(picsum[2]);
    if (width > 0 && height > 0) return width / height;
  }

  try {
    const parsed = new URL(url, "http://localhost");
    const w = parsed.searchParams.get("w") ?? parsed.searchParams.get("width");
    const h = parsed.searchParams.get("h") ?? parsed.searchParams.get("height");
    if (w && h) {
      const width = Number(w);
      const height = Number(h);
      if (width > 0 && height > 0) return width / height;
    }
  } catch {
    /* ignore invalid URLs */
  }

  return null;
}

function readImageDimensions(buffer: Buffer): Dimensions | null {
  if (buffer.length >= 24 && buffer[0] === 0x89 && buffer[1] === 0x50) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length - 8) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker === 0xc0 || marker === 0xc2) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + length;
    }
  }

  return null;
}

function readLocalImageAspect(thumbnail: string): number | null {
  try {
    const filePath = path.join(process.cwd(), "public", thumbnail.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) return null;
    const buffer = fs.readFileSync(filePath);
    const dims = readImageDimensions(buffer);
    return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : null;
  } catch {
    return null;
  }
}

async function readRemoteImageAspect(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, {
      headers: { Range: "bytes=0-65535" },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;
    const dims = readImageDimensions(Buffer.from(await res.arrayBuffer()));
    return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : null;
  } catch {
    return null;
  }
}

export async function getThumbnailAspectRatio(thumbnail: string | null): Promise<number> {
  if (!thumbnail) return DEFAULT_ASPECT;

  const fromUrl = parseAspectFromUrl(thumbnail);
  if (fromUrl) return fromUrl;

  if (thumbnail.startsWith("/") && !thumbnail.startsWith("//")) {
    const fromFile = readLocalImageAspect(thumbnail);
    if (fromFile) return fromFile;
  }

  if (thumbnail.startsWith("http")) {
    const fromRemote = await readRemoteImageAspect(thumbnail);
    if (fromRemote) return fromRemote;
  }

  return DEFAULT_ASPECT;
}

export async function enrichGamesWithAspect<T extends { thumbnail: string | null }>(
  games: T[]
): Promise<(T & { aspectRatio: number })[]> {
  return Promise.all(
    games.map(async (game) => ({
      ...game,
      aspectRatio: await getThumbnailAspectRatio(game.thumbnail),
    }))
  );
}

export function aspectToCssRatio(ratio: number) {
  return `${Math.max(0.5, Math.min(2.5, ratio)).toFixed(4)} / 1`;
}
