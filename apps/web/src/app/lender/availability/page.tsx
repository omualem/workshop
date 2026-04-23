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

export default function LenderAvailabilityPage() {
  return (
    <DashboardShell title="לוח זמינות" subtitle="חסימות תאריכים, תחזוקה והגנת overlap." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">המסך נבנה ל-RTL ויציג blocks, booking conflicts והמלצות לשיפור כיסוי זמינות.</Card>
    </DashboardShell>
  );
}
