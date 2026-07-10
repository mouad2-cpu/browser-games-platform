import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function UploadsPage() {
  const counts = await prisma.gameUpload.groupBy({
    by: ["status"],
    _count: true,
  });

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Uploads</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Developer game submissions and review pipeline.
      </p>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={countMap.PENDING ?? 0} href="/admin/uploads/review" />
        <StatCard label="Approved" value={countMap.APPROVED ?? 0} />
        <StatCard label="Rejected" value={countMap.REJECTED ?? 0} />
      </div>
      <Link href="/admin/uploads/review" className="btn-primary text-sm">
        Open Review Queue →
      </Link>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const el = (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{el}</Link> : el;
}
