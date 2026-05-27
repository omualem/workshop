import { SiteShell } from "../../components/site-shell";
import { AppLogo } from "../../components/app-logo";
import { BundleOptimizerForm } from "../../components/forms/bundle-optimizer-form";

export default function BundleRequestPage() {
  return (
    <SiteShell activeHref="/bundle-request">
      <section className="surface-section py-10" dir="rtl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <AppLogo size={40} priority className="h-10 w-10" />
          <div className="surface-eyebrow">בקשת חבילה</div>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
            בנו את החבילה שלכם
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            הוסיפו פריטים, הגדירו תקציב ותאריכים, ונבנה עבורכם את החבילה האופטימלית עם פירוט ציונים והסברים.
          </p>
        </div>
        <BundleOptimizerForm />
      </section>
    </SiteShell>
  );
}
