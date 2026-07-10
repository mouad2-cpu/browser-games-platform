import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function DeveloperDetailPage({ params }: Props) {
  const { id } = await params;

  const developer = await prisma.developer.findUnique({
    where: { id },
    include: {
      user: { select: { username: true, email: true, createdAt: true } },
      uploads: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!developer) notFound();

  return (
    <div>
      <Link href="/admin/developers" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
        ← Developers
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold">{developer.user.username}</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Info label="Company" value={developer.companyName ?? "—"} />
        <Info label="Revenue Share" value={`${(developer.revenueShare * 100).toFixed(0)}%`} />
        <Info label="Total Revenue" value={`$${developer.totalRevenue.toFixed(2)}`} />
        <Info label="Payout Status" value={developer.payoutStatus} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent Uploads</h2>
        <ul className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
          {developer.uploads.map((u) => (
            <li key={u.id} className="flex justify-between px-4 py-3 text-sm">
              <span>{u.title}</span>
              <span className="text-[var(--color-muted)]">{u.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
