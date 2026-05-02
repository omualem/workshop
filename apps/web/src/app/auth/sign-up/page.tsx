import { SiteShell } from "../../../components/site-shell";
import { SignUpForm } from "../../../components/forms/auth-form";

export default function SignUpPage() {
  return (
    <SiteShell activeHref="/">
      <section className="surface-section py-14">
        <SignUpForm />
      </section>
    </SiteShell>
  );
}
