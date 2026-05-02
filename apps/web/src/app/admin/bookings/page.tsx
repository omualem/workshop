import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { api } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await api.adminBookings();

  return (
    <DashboardShell
      title="הזמנות"
      subtitle="הזמנות אמיתיות מתוך מסד הנתונים."
      navItems={adminNavItems}
      activeHref="/admin/bookings"
    >
      <Card className="overflow-x-auto">
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-600">אין הזמנות להצגה</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>שוכר</th>
                <th>סטטוס</th>
                <th>פריטים</th>
                <th>סכום</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking.id}>
                  <td>{booking.renter?.fullName ?? "לא צוין"}</td>
                  <td>{booking.status}</td>
                  <td>{booking.items?.length ?? 0}</td>
                  <td>₪{Number(booking.totalPrice).toLocaleString("he-IL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
