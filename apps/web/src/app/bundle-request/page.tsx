import { SiteShell } from "../../components/site-shell";
import { BundleRequestForm } from "../../components/forms/bundle-request-form";

export default function BundleRequestPage() {
  return (
    <SiteShell>
      <section className="surface-section py-14">
        <div className="mb-8 space-y-3">
          <div className="surface-eyebrow">Bundle Request</div>
          <h1 className="text-4xl font-semibold text-slate-950">בקשת חבילה חכמה</h1>
          <p className="max-w-3xl text-sm leading-8 text-slate-600">
            בחרו פריטים, תאריכים, מיקום והעדפת דירוג. המערכת תחפש כמה קומבינציות
            אפשריות, תנקד אותן ותציג מה כל חבילה מרוויחה ומה היא מקריבה.
          </p>
        </div>
        <BundleRequestForm />
      </section>
    </SiteShell>
  );
}
