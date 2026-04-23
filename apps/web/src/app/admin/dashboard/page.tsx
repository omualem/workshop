import { DashboardShell } from "../../../components/dashboard-shell";
import { api } from "../../../lib/api";

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

export default async function AdminDashboardPage() {
  const overview = await api.adminOverview();

  return (
    <DashboardShell
      title="לוח אדמין"
      subtitle="תצפית על משתמשים, moderation, observability ודירוג."
      navItems={navItems}
      activeHref="/admin/dashboard"
    >
      <div className="mb-6">
        <div className="surface-eyebrow">Admin Overview</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">סקירה</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          תמונת מצב מהירה על ליבה התפעולית של המערכת, כולל moderation, דירוג ותקלות.
        </p>
      </div>

      <div className="dashboard-stat-grid">
        {Object.entries(overview).map(([key, value]) => (
          <div key={key} className="dashboard-stat-card">
            <div className="dashboard-stat-label">{key}</div>
            <div className="dashboard-stat-value">{String(value)}</div>
          </div>
        ))}
      </div>

      <div className="surface-panel mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-950">תור moderation</h2>
        <table className="dashboard-table mt-4">
          <thead>
            <tr>
              <th>Listing</th>
              <th>מלווה</th>
              <th>סיבה</th>
              <th>גיל</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>מקרן קצר טווח</td>
              <td>Compact AV Cluster</td>
              <td>תיאור חלקי</td>
              <td>שעה</td>
            </tr>
            <tr>
              <td>חבילת תאורה ניידת</td>
              <td>Bundle Hub Central</td>
              <td>התנגשות זמינות</td>
              <td>3 שעות</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
