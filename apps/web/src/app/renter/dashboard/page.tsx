import { DashboardShell } from "../../../components/dashboard-shell";

const renterNav = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
  { href: "/renter/bundle-results", label: "תוצאות bundle" },
];

export default function RenterDashboardPage() {
  return (
    <DashboardShell
      title="לוח מזמין"
      subtitle="ניהול חיפושים, bundles מדורגים, הזמנות ומועדפים."
      navItems={renterNav}
      activeHref="/renter/dashboard"
    >
      <div className="mb-6">
        <div className="surface-eyebrow">Renter Overview</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">סקירה</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          bundles פעילים, הזמנות קרובות ויכולת קפיצה מהירה לחיפושים האחרונים.
        </p>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">חיפושים פעילים</div>
          <div className="dashboard-stat-value">4</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">הזמנות פעילות</div>
          <div className="dashboard-stat-value">2</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">מועדפים</div>
          <div className="dashboard-stat-value">11</div>
        </div>
      </div>

      <div className="surface-panel mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-950">הזמנות קרובות</h2>
        <table className="dashboard-table mt-4">
          <thead>
            <tr>
              <th>חבילה</th>
              <th>תאריך</th>
              <th>סה"כ</th>
              <th>סטטוס</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ערכת צילום עירונית</td>
              <td>02.05.2026</td>
              <td>₪1,280</td>
              <td><span className="dashboard-tag dashboard-tag-ok">מאושרת</span></td>
            </tr>
            <tr>
              <td>חבילת הקרנה לקהילה</td>
              <td>08.05.2026</td>
              <td>₪2,040</td>
              <td><span className="dashboard-tag dashboard-tag-warn">ממתינה</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
