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
      subtitle="ניהול מלא של פריטי ההשכרה לפי מלווה, קטגוריה וסטטוס, עם יצירה ועדכון מתוך עמוד הניהול."
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
