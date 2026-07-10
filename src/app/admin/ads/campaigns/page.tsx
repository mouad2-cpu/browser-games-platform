import { prisma } from "@/lib/db";

export default async function AdCampaignsPage() {
  const campaigns = await prisma.adCampaign.findMany({
    include: { slot: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Ad Campaigns</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Create and monitor campaigns across ad slots.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">CPM</th>
              <th className="px-4 py-3">Impressions</th>
              <th className="px-4 py-3">Clicks</th>
              <th className="px-4 py-3">CTR</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {campaigns.map((c) => {
              const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0";
              return (
                <tr key={c.id} className="bg-[var(--color-bg)]">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.slot.name} ({c.slot.placement})</td>
                  <td className="px-4 py-3">${c.cpm.toFixed(2)}</td>
                  <td className="px-4 py-3">{c.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3">{ctr}%</td>
                  <td className="px-4 py-3">{c.isActive ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
