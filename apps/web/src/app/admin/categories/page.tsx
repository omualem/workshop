import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { CategoryManager } from "../../../components/admin/category-manager";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <DashboardShell
      title="קטגוריות"
      subtitle="ניהול עץ הקטגוריות — הוספה, עריכה, ארכוב והגדרת מאפיינים."
      navItems={adminNavItems}
      activeHref="/admin/categories"
    >
      <CategoryManager />
    </DashboardShell>
  );
}