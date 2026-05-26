import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
];

export default function FavoritesPage() {
  return (
    <DashboardShell
      title="מועדפים"
      subtitle="הפריטים שאהבתם, זמינים כאן בכל רגע — ומוכנים להצטרף לחבילה הבאה."
      navItems={navItems}
    >
      <Card className="text-sm leading-7 text-slate-600">
        עוד לא סימנתם פריטים כמועדפים. גלשו בקטלוג ולחצו על הלב כדי לשמור פריטים לעיון מאוחר יותר.
      </Card>
    </DashboardShell>
  );
}
