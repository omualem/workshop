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

export default function LenderBookingsPage() {
  return (
    <DashboardShell title="בוקינג אינבוקס" subtitle="אישור, דחייה ועדכון סטטוסים." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">כאן המלווה רואה בקשות booking לפי item ownership ומעדכן סטטוסים עם audit logging.</Card>
    </DashboardShell>
  );
}
