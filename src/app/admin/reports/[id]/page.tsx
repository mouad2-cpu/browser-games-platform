import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { closeReportAction, deleteReportAction } from "@/app/actions/admin/reports";

type Props = { params: Promise<{ id: string }> };

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;

  const report = await prisma.gameReport.findUnique({
    where: { id },
    include: {
      game: { select: { title: true, slug: true, id: true } },
      submitter: { select: { username: true, email: true } },
    },
  });

  if (!report) notFound();

  return (
    <div>
      <Link href="/admin/reports" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
        ← Reports
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold">Report #{report.id.slice(-8)}</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Info label="Type" value={report.reportType.replace("_", " ")} />
        <Info label="Status" value={report.status} />
        <Info label="Issue" value={report.issueType} />
        <Info label="Date" value={report.createdAt.toLocaleString()} />
        {report.email && <Info label="Contact" value={report.email} />}
      </div>

      {report.game && (
        <p className="mb-4 text-sm">
          Game:{" "}
          <Link href={`/admin/games/${report.game.id}`} className="text-[var(--color-accent)]">
            {report.game.title}
          </Link>
        </p>
      )}

      <div className="mb-6 rounded-xl bg-[var(--color-surface)] p-4">
        <h2 className="mb-2 font-semibold">Message</h2>
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">{report.message}</p>
      </div>

      <div className="flex gap-2">
        {report.status === "OPEN" && (
          <form action={closeReportAction}>
            <input type="hidden" name="reportId" value={report.id} />
            <button type="submit" className="btn-primary text-sm">Mark Closed</button>
          </form>
        )}
        <form action={deleteReportAction}>
          <input type="hidden" name="reportId" value={report.id} />
          <button type="submit" className="rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-3">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
