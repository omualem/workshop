import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { api } from "../../../lib/api";

export const dynamic = "force-dynamic";

const metricLabels: Record<string, string> = {
  users: "משתמשים",
  renters: "שוכרים",
  lenders: "משכירים",
  listings: "פריטים",
  disputes: "מחלוקות",
};

export default async function AdminDashboardPage() {
  const [overview, moderationQueue] = await Promise.all([
    api.adminOverview() as Promise<Record<string, number>>,
    api.adminModeration(),
  ]);

  return (
    <DashboardShell
      title="לוח ניהול"
      subtitle="תמונת מצב חיה של המערכת: משתמשים, פריטים והזמנות."
      navItems={adminNavItems}
      activeHref="/admin/dashboard"
    >
      <div className="mb-6">
        <div className="surface-eyebrow">סקירה כללית</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">סקירה</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          כל הנתונים במסך זה מתעדכנים בזמן אמת ממסד הנתונים.
        </p>
      </div>

      <div className="dashboard-stat-grid">
        {Object.entries(metricLabels).map(([key, label]) => (
          <div key={key} className="dashboard-stat-card">
            <div className="dashboard-stat-label">{label}</div>
            <div className="dashboard-stat-value">{overview[key] ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="surface-panel mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          פריטים בהמתנה לאישור
        </h2>
        {moderationQueue.length === 0 ? (
          <p className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            אין כרגע פריטים שממתינים לאישור
          </p>
        ) : (
          <table className="dashboard-table mt-4">
            <thead>
              <tr>
                <th>פריט</th>
                <th>משכיר</th>
                <th>קטגוריה</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {moderationQueue.map((listing: any) => (
                <tr key={listing.id}>
                  <td>{listing.titleHe}</td>
                  <td>{listing.lender?.displayName ?? "לא צוין"}</td>
                  <td>{listing.category?.nameHe ?? "לא צוין"}</td>
                  <td>{listing.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
