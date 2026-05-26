import Link from "next/link";
import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { ListingManager } from "../../../components/admin/listing-manager";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ create?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const initialCreateOpen = params?.create === "1";

  return (
    <DashboardShell
      title="ניהול פריטים"
      subtitle="כל פריטי ההשכרה במערכת — סינון לפי משכיר, קטגוריה וסטטוס, עם יצירה ועריכה מהמסך."
      navItems={adminNavItems}
      activeHref="/admin/listings"
      headerActions={
        <Link href="/admin/listings?create=1" className="btn btn-soft">
          + פריט חדש
        </Link>
      }
    >
      <ListingManager initialCreateOpen={initialCreateOpen} />
    </DashboardShell>
  );
}
