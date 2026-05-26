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
      subtitle="טיפול בפניות ובמקרים חריגים בין שוכרים למשכירים."
      navItems={adminNavItems}
      activeHref="/admin/disputes"
    >
      <Card className="overflow-x-auto">
        {disputes.length === 0 ? (
          <p className="text-sm text-slate-600">אין כרגע מחלוקות פתוחות</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>נפתחה על ידי</th>
                <th>סטטוס</th>
                <th>סיבה</th>
                <th>מנהל המטפל</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute: any) => (
                <tr key={dispute.id}>
                  <td>{dispute.openedBy?.fullName ?? "לא צוין"}</td>
                  <td>{dispute.status}</td>
                  <td>{dispute.reason}</td>
                  <td>{dispute.assignedAdmin?.fullName ?? "טרם שויך"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
