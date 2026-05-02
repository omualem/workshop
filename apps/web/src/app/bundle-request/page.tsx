import { SiteShell } from "../../components/site-shell";
import { AppLogo } from "../../components/app-logo";
import { BundleOptimizerForm } from "../../components/forms/bundle-optimizer-form";

export default function BundleRequestPage() {
  return (
    <SiteShell activeHref="/bundle-request">
      <section className="surface-section py-14" dir="rtl">
        <div className="mb-8 space-y-3">
          <div className="flex justify-start">
            <AppLogo size={40} priority className="h-10 w-10" />
          </div>
          <div className="surface-eyebrow">Bundle Request</div>
          <h1 className="text-4xl font-semibold text-slate-950">בנאי בקשת חבילה</h1>
          <p className="max-w-3xl text-sm leading-8 text-slate-600">
            הוסיפו פריטים לבקשה לפי קטגוריה או לפי מוצר ספציפי, בחרו תאריכים,
            תקציב ופרופיל דירוג. המערכת תריץ את אלגוריתם האופטימיזציה ותציג את
            החבילות המתאימות ביותר עם פירוט הניקוד וההסברים.
          </p>
        </div>
        <BundleOptimizerForm />
      </section>
    </SiteShell>
  );
}
