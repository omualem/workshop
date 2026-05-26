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

export default function LenderReviewsPage() {
  return (
    <DashboardShell title="ביקורות" subtitle="ביקורות שכותבים שוכרים ותובנות לשיפור האמינות והשירות." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">
        כאן תוכלו לקרוא את הביקורות שקיבלתם, להבין מה השוכרים מעריכים אצלכם ומה אפשר לשפר בפעם הבאה.
      </Card>
    </DashboardShell>
  );
}
