"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  siteName: string;
  cdnUrl: string;
  domain: string;
  featureFlags: {
    userRegistration: boolean;
    developerUploads: boolean;
    adsEnabled: boolean;
  };
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function save(key: string, value: unknown) {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save("platform", form);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {saved && <p className="text-sm text-green-400">Settings saved.</p>}
      <div className="form-field">
        <label className="form-label">Site Name</label>
        <input
          className="form-input"
          value={form.siteName}
          onChange={(e) => setForm({ ...form, siteName: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label className="form-label">CDN URL</label>
        <input
          className="form-input"
          value={form.cdnUrl}
          onChange={(e) => setForm({ ...form, cdnUrl: e.target.value })}
          placeholder="https://cdn.example.com"
        />
      </div>
      <div className="form-field">
        <label className="form-label">Domain</label>
        <input
          className="form-input"
          value={form.domain}
          onChange={(e) => setForm({ ...form, domain: e.target.value })}
        />
      </div>
      <fieldset className="space-y-2">
        <legend className="form-label mb-2">Feature Flags</legend>
        {(["userRegistration", "developerUploads", "adsEnabled"] as const).map((flag) => (
          <label key={flag} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featureFlags[flag]}
              onChange={(e) =>
                setForm({
                  ...form,
                  featureFlags: { ...form.featureFlags, [flag]: e.target.checked },
                })
              }
            />
            {flag}
          </label>
        ))}
      </fieldset>
      <button type="submit" className="btn-primary">Save Settings</button>
    </form>
  );
}
