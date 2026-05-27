import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
];

export default function SettingsPage() {
  return (
    <DashboardShell
      title="הגדרות חשבון"
      subtitle="עדכון פרטים אישיים, כתובת ברירת מחדל והעדפות חיפוש."
      navItems={navItems}
      activeHref="/renter/settings"
    >
      <Card className="text-sm leading-7 text-slate-600">
        ההעדפות שלכם נשמרות אוטומטית בפרופיל ומופעלות בחיפוש הבא.
      </Card>
    </DashboardShell>
  );
}
