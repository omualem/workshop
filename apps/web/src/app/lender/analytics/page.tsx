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

export default function LenderAnalyticsPage() {
  return (
    <DashboardShell title="אנליטיקה" subtitle="ביצועי הפריטים שלכם, אחוזי המרה ומה שאפשר לשפר." navItems={navItems} activeHref="/lender/analytics">
      <Card className="text-sm leading-7 text-slate-600">
        כאן יוצגו כמה צפיות הפריטים שלכם קיבלו, כמה הזמנות נסגרו, ואיזה פריטים זקוקים לעדכון תמונות, תיאור או זמינות.
      </Card>
    </DashboardShell>
  );
}
