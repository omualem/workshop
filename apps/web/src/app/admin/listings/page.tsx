import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { ListingManager } from "../../../components/admin/listing-manager";

export default function AdminListingsPage() {
  return (
    <DashboardShell
      title="ניהול פריטים"
      subtitle="הוספה, עריכה וארגון של listings לפי מלווה, קטגוריה וסטטוס."
      navItems={adminNavItems}
    >
      <ListingManager />
    </DashboardShell>
  );
}
