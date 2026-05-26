import { DashboardShell } from "../../../components/dashboard-shell";

const navItems = [
  { href: "/lender/dashboard", label: "סקירה" },
  { href: "/lender/listings", label: "פריטים שלי" },
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
      title="לוח המשכיר"
      subtitle="ניהול הפריטים שלכם, זמינות, תמחור ואיכות הצגה."
      navItems={navItems}
      activeHref="/lender/dashboard"
    >
      <div className="mb-6">
        <div className="surface-eyebrow">סקירה כללית</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">שלום, וברוכים הבאים</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          תמונת מצב עדכנית של הפריטים שלכם, ציון האמינות וההופעות בחבילות שמוצעות לשוכרים.
        </p>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">פריטים פעילים</div>
          <div className="dashboard-stat-value">12</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">ציון אמינות</div>
          <div className="dashboard-stat-value">8.9</div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">הופעות בחבילות</div>
          <div className="dashboard-stat-value">31</div>
        </div>
      </div>

      <div className="surface-panel mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-950">הזדמנויות לשיפור</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
          <p>הוסיפו עוד 2 תמונות לחצובת הווידאו — פריטים עם יותר תמונות נצפים יותר.</p>
          <p>עדכנו זמינות ל-3 פריטים מרכזיים שכרגע לא מופיעים בחבילות.</p>
          <p>שקלו להוסיף הנחה להשכרה של 3 ימים ומעלה כדי לעלות בדירוג עבור שוכרים שמחפשים מחיר משתלם.</p>
        </div>
      </div>
    </DashboardShell>
  );
}
