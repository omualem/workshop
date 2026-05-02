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
      subtitle="ביקורות אמיתיות שהוזנו למערכת."
      navItems={adminNavItems}
      activeHref="/admin/reviews"
    >
      <Card className="overflow-x-auto">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-600">אין עדיין ביקורות</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>כותב</th>
                <th>מקבל ביקורת</th>
                <th>דירוג</th>
                <th>טקסט</th>
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
