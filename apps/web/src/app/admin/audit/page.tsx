import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { api } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const logs = await api.adminAuditLogs();

  return (
    <DashboardShell
      title="יומן פעולות"
      subtitle="Audit trail של פעולות אמיתיות שנרשמו במסד הנתונים."
      navItems={adminNavItems}
      activeHref="/admin/audit"
    >
      <Card className="overflow-x-auto">
        {logs.length === 0 ? (
          <p className="text-sm text-slate-600">אין עדיין פעולות ביומן</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>פעולה</th>
                <th>ישות</th>
                <th>משתמש</th>
                <th>תאריך</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>{log.entityType}</td>
                  <td>{log.actor?.fullName ?? "מערכת"}</td>
                  <td>{new Date(log.createdAt).toLocaleString("he-IL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
