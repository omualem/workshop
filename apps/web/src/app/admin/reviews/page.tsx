import { Card } from "@rental/ui";
import { DashboardShell } from "../../../components/dashboard-shell";
import { adminNavItems } from "../../../components/admin/admin-nav";
import { api } from "../../../lib/api";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await api.adminReviews();

  return (
    <DashboardShell
      title="ביקורות"
      subtitle="כל הביקורות שנרשמו במערכת."
      navItems={adminNavItems}
      activeHref="/admin/reviews"
    >
      <Card className="overflow-x-auto">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-600">אין כרגע ביקורות להצגה</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>נכתבה על ידי</th>
                <th>על</th>
                <th>דירוג</th>
                <th>תוכן הביקורת</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review: any) => (
                <tr key={review.id}>
                  <td>{review.reviewer?.fullName ?? "לא צוין"}</td>
                  <td>{review.reviewee?.fullName ?? "לא צוין"}</td>
                  <td>{review.rating}/5</td>
                  <td>{review.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardShell>
  );
}
