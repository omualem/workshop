import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/lender/dashboard", label: "סקירה" },
  { href: "/lender/listings", label: "Listings" },
  { href: "/lender/availability", label: "זמינות" },
  { href: "/lender/pricing", label: "תמחור" },
  { href: "/lender/bookings", label: "הזמנות" },
  { href: "/lender/reviews", label: "ביקורות" },
  { href: "/lender/analytics", label: "אנליטיקה" },
  { href: "/lender/profile", label: "פרופיל ואמינות" },
];

export default function LenderDashboardPage() {
  return (
    <DashboardShell
      title="לוח מלווה"
      subtitle="ניהול קטלוג, זמינות, תמחור ואיכות listing."
      navItems={navItems}
      activeHref="/lender/dashboard"
    >
      <div className="mb-6">
        <div className="surface-eyebrow">Lender Overview</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">סקירה</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          מצב listing, איכות הצגה, אמינות משוקללת ותרומה של הפריטים שלך ל-bundles.
        </p>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">Listings פעילים</div>
          <div className="dashboard-stat-value">12</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">אמינות משוקללת</div>
          <div className="dashboard-stat-value">8.9</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">תרומות ל-bundles</div>
          <div className="dashboard-stat-value">31</div>
        </div>
      </div>

      <div className="surface-panel mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-950">הזדמנויות לשיפור</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
          <p>הוסף עוד 2 תמונות לחצובת הווידאו כדי לשפר איכות listing.</p>
          <p>עדכן availability ל-3 פריטים מרכזיים שחוסמים הופעה ב-bundles.</p>
          <p>שקול הנחת duration ל-3 ימים ומעלה כדי לעלות בפרופיל Best Price.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
