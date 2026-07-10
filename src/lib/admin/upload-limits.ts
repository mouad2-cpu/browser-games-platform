export const MAX_THUMBNAIL_BYTES = 10 * 1024 * 1024;
export const MAX_PREVIEW_VIDEO_BYTES = 15 * 1024 * 1024;

export function maxSizeLabel(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return Number.isInteger(mb) ? `${mb}MB` : `${mb.toFixed(1)}MB`;
}
