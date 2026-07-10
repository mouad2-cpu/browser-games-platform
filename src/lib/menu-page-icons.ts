import {
  BookOpen,
  FileText,
  HelpCircle,
  Info,
  Mail,
  Scale,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";

export const MENU_PAGE_ICON_PRESETS = [
  { key: "mail", label: "Mail", Icon: Mail },
  { key: "scale", label: "Legal", Icon: Scale },
  { key: "shield", label: "Privacy", Icon: Shield },
  { key: "file-text", label: "Document", Icon: FileText },
  { key: "info", label: "Info", Icon: Info },
  { key: "help-circle", label: "Help", Icon: HelpCircle },
  { key: "book-open", label: "Book", Icon: BookOpen },
  { key: "users", label: "Parents", Icon: Users },
] as const;

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  MENU_PAGE_ICON_PRESETS.map(({ key, Icon }) => [key, Icon])
);

export function getMenuPageIcon(name: string | null | undefined): LucideIcon {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return FileText;
}
