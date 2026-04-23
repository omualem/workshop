import { SiteShell } from "../../../components/site-shell";
import { SignInForm } from "../../../components/forms/auth-form";

export default function SignInPage() {
  return (
    <SiteShell>
      <section className="surface-section py-14">
        <SignInForm />
      </section>
    </SiteShell>
  );
}
