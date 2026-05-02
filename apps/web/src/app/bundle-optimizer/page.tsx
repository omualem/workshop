import { SiteShell } from "../../components/site-shell";
import { AppLogo } from "../../components/app-logo";
import { BundleOptimizerForm } from "../../components/forms/bundle-optimizer-form";

export default function BundleOptimizerPage() {
  return (
    <SiteShell activeHref="/bundle-optimizer">
      <section className="surface-section py-14" dir="rtl">
        <div className="mb-8 space-y-3">
          <div className="flex justify-start">
            <AppLogo size={40} priority className="h-10 w-10" />
          </div>
          <div className="surface-eyebrow">Bundle Optimizer</div>
          <h1 className="text-4xl font-semibold text-slate-950">אופטימיזציית חבילות חכמה</h1>
          <p className="max-w-3xl text-sm leading-8 text-slate-600">
            הזינו פריטים, תקציב ומיקום. האלגוריתם מסנן מועמדים לפי אילוצים קשיחים,
            מבצע Beam Search, ומדרג חבילות לפי פונקציית מטרה רב-ממדית.
          </p>
        </div>
        <BundleOptimizerForm />
      </section>
    </SiteShell>
  );
}
