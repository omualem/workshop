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

export default function LenderProfilePage() {
  return (
    <DashboardShell title="פרופיל ואמינות" subtitle="ציון האמינות שלכם, רמת האימות והפעולות שישפרו אותו." navItems={navItems} activeHref="/lender/profile">
      <Card className="text-sm leading-7 text-slate-600">
        כאן תראו מהם המרכיבים של ציון האמינות שלכם — דירוגים, אחוז הזמנות שהושלמו בהצלחה, זמן מענה ורמת אימות — ומה אפשר לשפר.
      </Card>
    </DashboardShell>
  );
}
