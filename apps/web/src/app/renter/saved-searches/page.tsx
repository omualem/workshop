import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
];

export default function SavedSearchesPage() {
  return (
    <DashboardShell
      title="חיפושים שמורים"
      subtitle="כל בקשת חבילה שתשמרו תיגש בלחיצה אחת — עם כל הסינונים, ההעדפות והתקציב."
      navItems={navItems}
    >
      <Card className="text-sm leading-7 text-slate-600">
        בנו בקשת חבילה ושמרו אותה כדי לחזור אליה בקלות בפעם הבאה שתצטרכו ציוד דומה.
      </Card>
    </DashboardShell>
  );
}
