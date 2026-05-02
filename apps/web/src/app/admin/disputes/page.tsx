import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { api } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  const disputes = await api.adminDisputes();

  return (
    <DashboardShell
      title="מחלוקות"
      subtitle="ניהול מחלוקות ופתרון מקרים חריגים על בסיס נתוני אמת."
      navItems={adminNavItems}
      activeHref="/admin/disputes"
    >
      <Card className="overflow-x-auto">
        {disputes.length === 0 ? (
          <p className="text-sm text-slate-600">אין מחלוקות פתוחות</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>נפתח על ידי</th>
                <th>סטטוס</th>
                <th>סיבה</th>
                <th>אדמין מטפל</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute: any) => (
                <tr key={dispute.id}>
                  <td>{dispute.openedBy?.fullName ?? "לא צוין"}</td>
                  <td>{dispute.status}</td>
                  <td>{dispute.reason}</td>
                  <td>{dispute.assignedAdmin?.fullName ?? "לא שויך"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
