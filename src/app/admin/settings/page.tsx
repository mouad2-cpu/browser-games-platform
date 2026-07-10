import { SettingsForm } from "@/components/admin/settings-form";
import { prisma } from "@/lib/db";

const DEFAULT_SETTINGS = {
  siteName: "BrowserGames",
  cdnUrl: "",
  domain: "localhost:3000",
  featureFlags: {
    userRegistration: true,
    developerUploads: true,
    adsEnabled: false,
  },
};

export default async function SettingsPage() {
  const rows = await prisma.platformSetting.findMany();
  const stored = Object.fromEntries(
    rows.map((r) => {
      try {
        return [r.key, JSON.parse(r.value)];
      } catch {
        return [r.key, r.value];
      }
    })
  );

  const settings = { ...DEFAULT_SETTINGS, ...stored };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Settings</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Platform config, CDN, domain, and feature flags.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
