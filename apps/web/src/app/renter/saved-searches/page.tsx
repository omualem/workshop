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

export default function SavedSearchesPage() {
  return (
    <DashboardShell title="חיפושים שמורים" subtitle="גישה מהירה לחיפושי bundles קודמים." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">ניתן לשמור ולשחזר בקשות bundle כולל sliders, budget ו-filters.</Card>
    </DashboardShell>
  );
}
