import { SiteShell } from "../../components/site-shell";

const pdfPath = "/docs/bundle-optimization-model.pdf";

export default function HowItWorksPage() {
  return (
    <SiteShell activeHref="/how-it-works">
      <section className="surface-section py-10" dir="rtl">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-semibold text-slate-950">
              איך זה עובד
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              המודל שמסביר כיצד המערכת בונה ומדרגת חבילות פריטים.
            </p>
          </div>

          <object
            data={pdfPath}
            type="application/pdf"
            className="h-[80vh] w-full rounded-[8px] border border-slate-200 bg-white"
            aria-label="מודל אופטימיזציית חבילות"
          >
            <div className="flex h-[80vh] w-full items-center justify-center rounded-[8px] border border-slate-200 bg-white p-6 text-center">
              <a
                href={pdfPath}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-cyan-700 underline-offset-4 hover:underline"
              >
                פתח את הקובץ בלשונית חדשה
              </a>
            </div>
          </object>
        </div>
      </section>
    </SiteShell>
  );
}
