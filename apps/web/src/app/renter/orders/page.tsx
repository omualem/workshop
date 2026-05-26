import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
];

export default function RenterOrdersPage() {
  return (
    <DashboardShell
      title="הזמנות"
      subtitle="מעקב אחר ההזמנות שלכם — סטטוס, תשלום, איסוף והחזרה."
      navItems={navItems}
    >
      <Card className="text-sm leading-7 text-slate-600">
        כאן יוצגו ההזמנות שלכם, פריטי ההזמנה, סטטוס התשלום והאיסוף וסיכום החזרה.
      </Card>
    </DashboardShell>
  );
}
