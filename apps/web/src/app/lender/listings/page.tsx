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

export default function LenderListingsPage() {
  return (
    <DashboardShell title="ניהול פריטים" subtitle="הוספה ועריכה של פריטים, תמונות, מאפיינים והמלצות לשיפור איכות ההצגה." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">
        כאן תוסיפו פריטים חדשים, תעלו תמונות, תמלאו פרטים טכניים ותקבלו טיפים לשיפור הופעת הפריטים בחיפושים ובחבילות.
      </Card>
    </DashboardShell>
  );
}
