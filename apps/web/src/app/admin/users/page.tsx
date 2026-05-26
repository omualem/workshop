import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { UserManager } from "../../../components/admin/user-manager";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      title="משתמשים"
      subtitle="ניהול כל המשתמשים — פרופילי שוכר ומשכיר, סטטוסים ופרטי קשר."
      navItems={adminNavItems}
      activeHref="/admin/users"
    >
      <UserManager />
    </DashboardShell>
  );
}
