import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { CategoryManager } from "../../../components/admin/category-manager";

export default function AdminCategoriesPage() {
  return (
    <DashboardShell
      title="ניהול קטגוריות"
      subtitle="יצירה, עריכה וארגון של taxonomy, קטגוריות אב ו-schema של מאפיינים."
      navItems={adminNavItems}
    >
      <CategoryManager />
    </DashboardShell>
  );
}
