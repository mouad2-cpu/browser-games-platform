import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/components/admin/analytics/analytics-dashboard";
import { getAnalyticsDashboard } from "@/lib/analytics/dashboard";
import { resolveAnalyticsRange } from "@/lib/analytics/range";
import { getSession } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";

type Props = {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function AnalyticsPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, PERMISSIONS.ANALYTICS_VIEW)) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  let range;
  try {
    range = resolveAnalyticsRange(params);
  } catch {
    range = resolveAnalyticsRange({ range: "30d" });
  }
  const data = await getAnalyticsDashboard(range);

  return <AnalyticsDashboard initialData={data} />;
}
