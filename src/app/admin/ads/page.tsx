import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdsPage() {
  const slots = await prisma.adSlot.findMany({
    include: { _count: { select: { campaigns: true } } },
  });

  const totalImpressions = await prisma.adCampaign.aggregate({
    _sum: { impressions: true, clicks: true },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Ad Slots</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Configure placements: home, pre-game, sidebar. Track CPM and performance.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Impressions" value={(totalImpressions._sum.impressions ?? 0).toLocaleString()} />
        <Stat label="Clicks" value={(totalImpressions._sum.clicks ?? 0).toLocaleString()} />
        <Stat
          label="CTR"
          value={
            totalImpressions._sum.impressions
              ? `${(((totalImpressions._sum.clicks ?? 0) / totalImpressions._sum.impressions) * 100).toFixed(2)}%`
              : "0%"
          }
        />
      </div>

      <Link href="/admin/ads/campaigns" className="btn-primary mb-6 inline-block text-sm">
        Manage Campaigns →
      </Link>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Placement</th>
              <th className="px-4 py-3">CPM</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Campaigns</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {slots.map((slot) => (
              <tr key={slot.id} className="bg-[var(--color-bg)]">
                <td className="px-4 py-3 font-medium">{slot.name}</td>
                <td className="px-4 py-3">{slot.placement}</td>
                <td className="px-4 py-3">${slot.cpm.toFixed(2)}</td>
                <td className="px-4 py-3">{slot.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{slot._count.campaigns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
