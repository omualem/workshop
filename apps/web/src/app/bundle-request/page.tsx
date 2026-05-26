import { SiteShell } from "../../components/site-shell";
import { AppLogo } from "../../components/app-logo";
import { BundleOptimizerForm } from "../../components/forms/bundle-optimizer-form";

export default function BundleRequestPage() {
  return (
    <SiteShell activeHref="/bundle-request">
      <section className="surface-section py-8" dir="rtl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <AppLogo size={40} priority className="h-10 w-10" />
          <div className="surface-eyebrow">Bundle Request</div>
        </div>
        <BundleOptimizerForm />
      </section>
    </SiteShell>
  );
}
