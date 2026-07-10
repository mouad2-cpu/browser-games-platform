import type { Role } from "@prisma/client";
import type { Session } from "./auth";

export const PERMISSIONS = {
  GAMES_CREATE: "games.create",
  GAMES_EDIT: "games.edit",
  GAMES_DELETE: "games.delete",
  USERS_BAN: "users.ban",
  UPLOADS_APPROVE: "uploads.approve",
  ADS_MANAGE: "ads.manage",
  ANALYTICS_VIEW: "analytics.view",
  SETTINGS_MANAGE: "settings.manage",
  MODERATION_MANAGE: "moderation.manage",
  DEVELOPERS_MANAGE: "developers.manage",
  REPORTS_MANAGE: "reports.manage",
  CATEGORIES_MANAGE: "categories.manage",
  MENU_MANAGE: "menu.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const STAFF_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "ANALYST",
  "AD_MANAGER",
];

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [],
  SUPER_ADMIN: ALL_PERMISSIONS,
  ADMIN: [
    PERMISSIONS.GAMES_CREATE,
    PERMISSIONS.GAMES_EDIT,
    PERMISSIONS.GAMES_DELETE,
    PERMISSIONS.USERS_BAN,
    PERMISSIONS.UPLOADS_APPROVE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.MODERATION_MANAGE,
    PERMISSIONS.DEVELOPERS_MANAGE,
    PERMISSIONS.REPORTS_MANAGE,
    PERMISSIONS.CATEGORIES_MANAGE,
    PERMISSIONS.MENU_MANAGE,
  ],
  MODERATOR: [
    PERMISSIONS.GAMES_EDIT,
    PERMISSIONS.UPLOADS_APPROVE,
    PERMISSIONS.MODERATION_MANAGE,
    PERMISSIONS.REPORTS_MANAGE,
  ],
  ANALYST: [PERMISSIONS.ANALYTICS_VIEW],
  AD_MANAGER: [PERMISSIONS.ADS_MANAGE, PERMISSIONS.ANALYTICS_VIEW],
};

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function requireStaff(session: Session | null): Session {
  if (!session || !isStaffRole(session.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function requirePermission(
  session: Session | null,
  permission: Permission
): Session {
  const staff = requireStaff(session);
  if (!hasPermission(staff.role, permission)) {
    throw new Error("Forbidden");
  }
  return staff;
}

export type AdminNavItem = {
  href: string;
  label: string;
  permission?: Permission;
  children?: { href: string; label: string; permission?: Permission }[];
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  {
    href: "/admin/games",
    label: "Games",
    permission: PERMISSIONS.GAMES_EDIT,
  },
  { href: "/admin/users", label: "Users", permission: PERMISSIONS.USERS_BAN },
  {
    href: "/admin/uploads",
    label: "Uploads",
    permission: PERMISSIONS.UPLOADS_APPROVE,
    children: [{ href: "/admin/uploads/review", label: "Review Queue" }],
  },
  {
    href: "/admin/homepage",
    label: "Homepage",
    permission: PERMISSIONS.CATEGORIES_MANAGE,
  },
  {
    href: "/admin/menu",
    label: "Menu",
    children: [
      { href: "/admin/menu", label: "All items" },
      { href: "/admin/menu/pages/new", label: "Add menu page" },
    ],
  },
  {
    href: "/admin/reports",
    label: "Reports",
    permission: PERMISSIONS.REPORTS_MANAGE,
  },
  {
    href: "/admin/ads",
    label: "Ads",
    permission: PERMISSIONS.ADS_MANAGE,
    children: [{ href: "/admin/ads/campaigns", label: "Campaigns" }],
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    permission: PERMISSIONS.ANALYTICS_VIEW,
  },
  {
    href: "/admin/developers",
    label: "Developers",
    permission: PERMISSIONS.DEVELOPERS_MANAGE,
  },
  {
    href: "/admin/moderation",
    label: "Moderation",
    permission: PERMISSIONS.MODERATION_MANAGE,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    permission: PERMISSIONS.SETTINGS_MANAGE,
  },
];

export function getNavForRole(role: Role): AdminNavItem[] {
  return ADMIN_NAV.filter((item) => {
    if (item.href === "/admin/menu") {
      return hasAnyPermission(role, [PERMISSIONS.MENU_MANAGE, PERMISSIONS.CATEGORIES_MANAGE]);
    }
    return !item.permission || hasPermission(role, item.permission);
  }).map((item) => ({
    ...item,
    children: item.children?.filter(
      (c) => !c.permission || hasPermission(role, c.permission)
    ),
  }));
}
