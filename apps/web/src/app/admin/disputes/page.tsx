import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/admin/dashboard", label: "סקירה" },
  { href: "/admin/users", label: "משתמשים" },
  { href: "/admin/listings", label: "Moderation" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/disputes", label: "Disputes" },
  { href: "/admin/reviews", label: "ביקורות" },
  { href: "/admin/categories", label: "קטגוריות" },
  { href: "/admin/ranking", label: "Ranking Config" },
  { href: "/admin/audit", label: "Audit Logs" },
];

export default function AdminDisputesPage() {
  return (
    <DashboardShell title="Disputes" subtitle="ניהול מחלוקות ופתרון מקרים חריגים." navItems={navItems}>
      <Card className="text-sm leading-7 text-slate-600">מחלוקות, שיוך אדמין, resolution notes ו-status tracking.</Card>
    </DashboardShell>
  );
}
