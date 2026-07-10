import {
  Zap,
  Gamepad2,
  Puzzle,
  Car,
  Trophy,
  Crown,
  Users,
  Crosshair,
  Compass,
  MousePointerClick,
  CircleDot,
  Layers,
  Target,
  Swords,
  Brain,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  gamepad: Gamepad2,
  puzzle: Puzzle,
  car: Car,
  trophy: Trophy,
  crown: Crown,
  users: Users,
  crosshair: Crosshair,
  compass: Compass,
  "mouse-pointer": MousePointerClick,
  "circle-dot": CircleDot,
  layers: Layers,
  target: Target,
  swords: Swords,
  brain: Brain,
  sparkles: Sparkles,
  tag: Tag,
};

export const CATEGORY_ICON_PRESETS: { key: string; label: string }[] = [
  { key: "zap", label: "Action" },
  { key: "gamepad", label: "Arcade" },
  { key: "layers", label: "Card" },
  { key: "car", label: "Driving" },
  { key: "users", label: "Multiplayer" },
  { key: "crosshair", label: "Shooting" },
  { key: "compass", label: "Adventure" },
  { key: "crown", label: "Board" },
  { key: "mouse-pointer", label: "Clicker" },
  { key: "circle-dot", label: ".io" },
  { key: "puzzle", label: "Puzzle" },
  { key: "target", label: "Simulation" },
  { key: "trophy", label: "Sports" },
  { key: "swords", label: "Fighting" },
  { key: "brain", label: "Strategy" },
  { key: "sparkles", label: "Casual" },
];

const SLUG_DEFAULT_ICONS: Record<string, string> = {
  action: "zap",
  arcade: "gamepad",
  puzzle: "puzzle",
  racing: "car",
  sports: "trophy",
  strategy: "crown",
  card: "layers",
  driving: "car",
  multiplayer: "users",
  shooting: "crosshair",
  adventure: "compass",
  board: "crown",
  clicker: "mouse-pointer",
  io: "circle-dot",
  simulation: "target",
};

/** Legacy emoji values → icon keys */
const EMOJI_TO_ICON_KEY: Record<string, string> = {
  "⚔️": "zap",
  "🧩": "puzzle",
  "🏎️": "car",
  "⚽": "trophy",
  "🕹️": "gamepad",
  "♟️": "crown",
  "🎮": "gamepad",
  "🎯": "target",
  "🌟": "sparkles",
  "🔫": "crosshair",
  "🏀": "trophy",
  "🎲": "sparkles",
  "👾": "gamepad",
  "🚀": "compass",
  "🧠": "brain",
  "🎪": "sparkles",
};

export function isCategoryIconImage(icon: string | null | undefined): boolean {
  return !!icon && (icon.startsWith("/") || icon.startsWith("http"));
}

export function resolveCategoryIconKey(
  icon: string | null | undefined,
  slug?: string
): string {
  if (icon && isCategoryIconImage(icon)) return "tag";
  if (icon && CATEGORY_ICONS[icon]) return icon;
  if (icon && EMOJI_TO_ICON_KEY[icon]) return EMOJI_TO_ICON_KEY[icon];
  if (slug && SLUG_DEFAULT_ICONS[slug]) return SLUG_DEFAULT_ICONS[slug];
  return "tag";
}

export function getCategoryIconComponent(key: string): LucideIcon {
  return CATEGORY_ICONS[key] ?? Tag;
}

export const CATEGORY_ICON_COLOR = "#a99bf5";

export const CATEGORY_ICON_SIZES = {
  sm: 20,
  md: 36,
  lg: 48,
} as const;
