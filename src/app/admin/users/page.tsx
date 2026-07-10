import { prisma } from "@/lib/db";
import { UserActions } from "@/components/admin/user-actions";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBanned: true,
      lastActiveAt: true,
      createdAt: true,
      _count: { select: { playEvents: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Users</h1>
      <p className="mb-6 text-sm text-[var(--color-muted)]">
        Manage accounts, bans, and activity history.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Plays</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {users.map((user) => (
              <tr key={user.id} className="bg-[var(--color-bg)]">
                <td className="px-4 py-3">
                  <a href={`/admin/users/${user.id}`} className="font-medium hover:text-[var(--color-accent)]">
                    {user.username}
                  </a>
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user._count.playEvents}</td>
                <td className="px-4 py-3">
                  {user.isBanned ? (
                    <span className="text-red-400">Banned</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <UserActions userId={user.id} isBanned={user.isBanned} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
