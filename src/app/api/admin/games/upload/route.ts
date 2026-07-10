import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { adminApiAuth } from "@/lib/admin/api-auth";
import { PERMISSIONS } from "@/lib/rbac";
import { saveUploadedGame } from "@/lib/admin/save-game-files";
import { MAX_PREVIEW_VIDEO_BYTES, MAX_THUMBNAIL_BYTES, maxSizeLabel } from "@/lib/admin/upload-limits";

export const runtime = "nodejs";
export const maxDuration = 120;

async function saveThumbnail(slug: string, file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { error: "Invalid thumbnail type. Use JPEG, PNG, WebP, or GIF." } as const;
  }
  if (file.size > MAX_THUMBNAIL_BYTES) {
    return { error: `Thumbnail must be under ${maxSizeLabel(MAX_THUMBNAIL_BYTES)}.` } as const;
  }
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${slug}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return { path: `/uploads/thumbnails/${filename}` } as const;
}

async function savePreviewVideo(slug: string, file: File) {
  const allowed = ["video/mp4", "video/webm", "video/quicktime"];
  if (!allowed.includes(file.type)) {
    return { error: "Preview video must be MP4, WebM, or MOV." } as const;
  }
  if (file.size > MAX_PREVIEW_VIDEO_BYTES) {
    return { error: `Preview video must be under ${maxSizeLabel(MAX_PREVIEW_VIDEO_BYTES)}.` } as const;
  }
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
  const filename = `${slug}-preview-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "previews");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return { path: `/uploads/previews/${filename}` } as const;
}

export async function POST(request: Request) {
  const auth = await adminApiAuth(PERMISSIONS.GAMES_EDIT);
  if (auth.error) return auth.error;

  try {
    const formData = await request.formData();
    const slug = String(formData.get("slug") ?? "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const result: {
      embedPath?: string;
      thumbnail?: string;
      previewVideo?: string;
    } = {};

    const embedMode = String(formData.get("embedMode") ?? "url");
    if (embedMode === "game") {
      const gameResult = await saveUploadedGame(slug, formData);
      if ("error" in gameResult) {
        return NextResponse.json({ error: gameResult.error }, { status: 400 });
      }
      result.embedPath = gameResult.embedPath;
    }

    const thumbnailFile = formData.get("thumbnailFile");
    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      const thumbResult = await saveThumbnail(slug, thumbnailFile);
      if ("error" in thumbResult) {
        return NextResponse.json({ error: thumbResult.error }, { status: 400 });
      }
      result.thumbnail = thumbResult.path;
    }

    const previewFile = formData.get("previewVideoFile");
    if (previewFile instanceof File && previewFile.size > 0) {
      const previewResult = await savePreviewVideo(slug, previewFile);
      if ("error" in previewResult) {
        return NextResponse.json({ error: previewResult.error }, { status: 400 });
      }
      result.previewVideo = previewResult.path;
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 }
    );
  }
}
