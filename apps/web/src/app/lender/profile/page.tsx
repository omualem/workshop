import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/lender/dashboard", label: "סקירה" },
  { href: "/lender/listings", label: "Listings" },
  { href: "/lender/availability", label: "זמינות" },
  { href: "/lender/pricing", label: "תמחור" },
  { href: "/lender/bookings", label: "הזמנות" },
  { href: "/lender/reviews", label: "ביקורות" },
  { href: "/lender/analytics", label: "אנליטיקה" },
  { href: "/lender/profile", label: "פרופיל ואמינות" },
];

export default function LenderProfilePage() {
  return (
    <DashboardShell title="פרופיל ואמינות" subtitle="אמינות, response time, verification ורמות שיפור." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">המסך מציג את רכיבי ה-reliability score ואת הפעולות המומלצות לשיפורו.</Card>
    </DashboardShell>
  );
}
