import { Card, Button } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
];

export default function CheckoutPage() {
  return (
    <DashboardShell
      title="אישור הזמנה"
      subtitle="בדיקה אחרונה לפני שליחת ההזמנה למשכירים."
      navItems={navItems}
    >
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">סיכום ההזמנה</h2>
        <p className="text-sm leading-7 text-slate-600">
          בדקו את הפריטים, התאריכים והעלויות. אחרי האישור — המשכירים יקבלו את הבקשה ויחזרו אליכם עם פרטי האיסוף.
        </p>
        <Button>אישור ושליחת הזמנה</Button>
      </Card>
    </DashboardShell>
  );
}
