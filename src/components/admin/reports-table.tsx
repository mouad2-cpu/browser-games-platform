import Link from "next/link";
import { ReportStatus, ReportType } from "@prisma/client";
import { closeReportAction, deleteReportAction } from "@/app/actions/admin/reports";

type Report = {
  id: string;
  reportType: ReportType;
  issueType: string;
  email: string | null;
  message: string;
  status: ReportStatus;
  createdAt: Date;
  game: { title: string; slug: string } | null;
};

type Props = {
  reports: Report[];
  filter: "open" | "all";
};

export function ReportsTable({ reports, filter }: Props) {
  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Link
          href="/admin/reports?filter=open"
          className={`rounded-lg px-3 py-1.5 text-sm ${
            filter === "open"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-surface)] text-[var(--color-muted)]"
          }`}
        >
          Open only
        </Link>
        <Link
          href="/admin/reports?filter=all"
          className={`rounded-lg px-3 py-1.5 text-sm ${
            filter === "all"
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-surface)] text-[var(--color-muted)]"
          }`}
        >
          All
        </Link>
      </div>

      {reports.length === 0 ? (
        <p className="text-[var(--color-muted)]">No reports found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Game</th>
                <th className="px-4 py-3 font-medium">Issue</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {reports.map((report) => (
                <tr key={report.id} className="bg-[var(--color-bg)]">
                  <td className="px-4 py-3 text-xs">{report.reportType.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    {report.game ? (
                      <Link href={`/game/${report.game.slug}`} className="text-[var(--color-accent)] hover:underline">
                        {report.game.title}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">{report.issueType}</td>
                  <td className="max-w-xs truncate px-4 py-3" title={report.message}>
                    {report.message}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {report.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        report.status === "OPEN"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/reports/${report.id}`} className="text-xs text-[var(--color-accent)] hover:underline">
                        View
                      </Link>
                      {report.status === "OPEN" && (
                        <form action={closeReportAction}>
                          <input type="hidden" name="reportId" value={report.id} />
                          <button type="submit" className="text-xs text-[var(--color-accent)] hover:underline">
                            Close
                          </button>
                        </form>
                      )}
                      <form action={deleteReportAction}>
                        <input type="hidden" name="reportId" value={report.id} />
                        <button type="submit" className="text-xs text-red-400 hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
