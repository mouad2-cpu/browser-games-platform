import { HOME_PLACEMENTS } from "@/lib/home-placements";

type Props = {
  name?: string;
  defaultValue?: string;
  label?: string;
};

export function HomePlacementSelect({
  name = "placement",
  defaultValue = "between_top_picks_featured",
  label = "Where on homepage",
}: Props) {
  return (
    <div className="form-field mb-0">
      <label className="form-label">{label}</label>
      <select name={name} defaultValue={defaultValue} className="form-input">
        {HOME_PLACEMENTS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-[var(--color-muted)]">
        Pick a spot between two sections, or first/last on the page. Use sort order if several share the same spot.
      </p>
    </div>
  );
}
