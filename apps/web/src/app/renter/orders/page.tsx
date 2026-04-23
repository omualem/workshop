import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
  { href: "/renter/bundle-results", label: "תוצאות bundle" },
];

export default function RenterOrdersPage() {
  return (
    <DashboardShell title="הזמנות" subtitle="מעקב אחר סטטוס, תשלומים, והחזרות." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">כאן מוצגים orders, פריטי ההזמנה, סטטוס וסיכום אמינות/logistics snapshots.</Card>
    </DashboardShell>
  );
}
