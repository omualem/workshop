import { Card, Button } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
  { href: "/renter/bundle-results", label: "תוצאות bundle" },
];

export default function CheckoutPage() {
  return (
    <DashboardShell title="Checkout" subtitle="ארכיטקטורת הזמנה payment-ready עם snapshots של scores." navItems={navItems}>
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">אישור בקשת הזמנה</h2>
        <p className="text-sm leading-7 text-slate-600">
          שלב זה שומר Booking ו-BookingItems, ומוכן לחיבור ל-provider חיצוני של authorization/capture.
        </p>
        <Button>שלח בקשת הזמנה</Button>
      </Card>
    </DashboardShell>
  );
}
