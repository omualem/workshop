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

export default function LenderPricingPage() {
  return (
    <DashboardShell title="תמחור והנחות" subtitle="הגדרת הנחות לפי משך השכרה, מחירי סופי שבוע ומחירי עונה." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">
        כאן תוכלו להגדיר הנחות להשכרות ארוכות, תוספות לסופי שבוע, ולראות איך התמחור משפיע על הופעת הפריטים בחבילות.
      </Card>
    </DashboardShell>
  );
}
