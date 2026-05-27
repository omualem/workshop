import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/lender/dashboard", label: "סקירה" },
  { href: "/lender/listings", label: "פריטים שלי" },
  { href: "/lender/availability", label: "זמינות" },
  { href: "/lender/pricing", label: "תמחור" },
  { href: "/lender/bookings", label: "הזמנות" },
  { href: "/lender/reviews", label: "ביקורות" },
  { href: "/lender/analytics", label: "אנליטיקה" },
  { href: "/lender/profile", label: "פרופיל ואמינות" },
];

export default function LenderBookingsPage() {
  return (
    <DashboardShell title="הזמנות נכנסות" subtitle="אישור, דחייה ועדכון סטטוס של הזמנות לפריטים שלכם." navItems={navItems} activeHref="/lender/bookings">
      <Card className="text-sm leading-7 text-slate-600">
        כאן תקבלו את כל בקשות ההזמנה לפריטים שבבעלותכם, עם אפשרות לאשר, לדחות או לבקש פרטים נוספים מהשוכר.
      </Card>
    </DashboardShell>
  );
}
