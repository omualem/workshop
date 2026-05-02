import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { api } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function AdminRankingPage() {
  const configs = await api.adminRankingConfig();

  return (
    <DashboardShell
      title="הגדרות דירוג"
      subtitle="פריסטים ומשקלים שנשמרו במסד הנתונים."
      navItems={adminNavItems}
      activeHref="/admin/ranking"
    >
      <Card className="overflow-x-auto">
        {configs.length === 0 ? (
          <p className="text-sm text-slate-600">אין הגדרות דירוג להצגה</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>מפתח</th>
                <th>שם</th>
                <th>עודכן על ידי</th>
                <th>עודכן בתאריך</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((config: any) => (
                <tr key={config.id}>
                  <td>{config.presetKey}</td>
                  <td>{config.displayNameHe}</td>
                  <td>{config.updatedBy?.fullName ?? "לא צוין"}</td>
                  <td>{new Date(config.updatedAt).toLocaleString("he-IL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
