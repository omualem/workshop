import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { api } from "../../../lib/api";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = {
  ADMIN: "אדמין",
  RENTER: "שוכר",
  LENDER: "מלווה",
  GUEST: "אורח",
};

export default async function AdminUsersPage() {
  const users = await api.adminUsers();
  const counts = {
    admins: users.filter((user) => user.role === "ADMIN").length,
    renters: users.filter((user) => user.role === "RENTER").length,
    lenders: users.filter((user) => user.role === "LENDER").length,
  };

  return (
    <DashboardShell
      title="משתמשים"
      subtitle="משתמשים אמיתיים ממסד הנתונים, כולל פרופילי שוכרים ומלווים."
      navItems={adminNavItems}
      activeHref="/admin/users"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">אדמינים</div>
          <div className="mt-2 text-3xl font-semibold">{counts.admins}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">שוכרים</div>
          <div className="mt-2 text-3xl font-semibold">{counts.renters}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">מלווים</div>
          <div className="mt-2 text-3xl font-semibold">{counts.lenders}</div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        {users.length === 0 ? (
          <p className="text-sm text-slate-600">אין משתמשים להצגה</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>אימייל</th>
                <th>תפקיד</th>
                <th>סטטוס</th>
                <th>פרופיל</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{roleLabels[user.role] ?? user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    {user.role === "RENTER" && user.hasRenterProfile
                      ? "פרופיל שוכר קיים"
                      : null}
                    {user.role === "LENDER" && user.hasLenderProfile
                      ? user.lenderDisplayName
                      : null}
                    {user.role === "ADMIN" ? "אדמין" : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
