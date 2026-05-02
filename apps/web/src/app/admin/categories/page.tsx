import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { CategoryManager } from "../../../components/admin/category-manager";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <DashboardShell
      title="ניהול קטגוריות"
      subtitle="יצירה, עריכה וארגון של עץ הקטגוריות ומאפייני הקטגוריה."
      navItems={adminNavItems}
    >
      <CategoryManager />
    </DashboardShell>
  );
}
