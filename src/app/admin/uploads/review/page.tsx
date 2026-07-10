import { UploadReviewActions } from "@/components/admin/upload-review-actions";
import { prisma } from "@/lib/db";

export default async function UploadReviewPage() {
  const uploads = await prisma.gameUpload.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      developer: { include: { user: { select: { username: true, email: true } } } },
    },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Upload Review Queue</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Approve or reject pending developer submissions. Check scan status before publishing.
      </p>

      {uploads.length === 0 ? (
        <p className="text-[var(--color-muted)]">No pending uploads.</p>
      ) : (
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div key={upload.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{upload.title}</h2>
                  <p className="text-sm text-[var(--color-muted)]">
                    by {upload.developer.user.username} · {upload.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <ScanBadge status={upload.scanStatus} />
              </div>
              {upload.description && (
                <p className="mb-3 text-sm text-[var(--color-muted)]">{upload.description}</p>
              )}
              <p className="mb-3 truncate text-xs text-[var(--color-muted)]">Embed: {upload.embedPath}</p>
              <UploadReviewActions uploadId={upload.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScanBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    CLEAN: "bg-green-500/20 text-green-400",
    SUSPICIOUS: "bg-orange-500/20 text-orange-400",
    FAILED: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${colors[status] ?? ""}`}>
      Scan: {status}
    </span>
  );
}
