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

export default function LenderAnalyticsPage() {
  return (
    <DashboardShell title="אנליטיקה" subtitle="Performance של listings ותרומה ל-bundle ranking." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">המסך יציג תרומת listings ל-bundles, שיעורי המרה, וכמה נקודות בדירוג אבדו בגלל חסר בתוכן או זמינות.</Card>
    </DashboardShell>
  );
}
