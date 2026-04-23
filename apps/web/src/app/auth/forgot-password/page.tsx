import { Card, Button } from "@rental/ui";
import { SiteShell } from "../../../components/site-shell";

export default function ForgotPasswordPage() {
  return (
    <SiteShell>
      <section className="surface-section py-14">
        <Card className="mx-auto max-w-md space-y-5 p-6 md:p-8">
          <div>
            <div className="surface-eyebrow">Recovery</div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">שכחת סיסמה</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              שלחו קישור איפוס לכתובת האימייל של החשבון.
            </p>
          </div>
          <div>
            <label className="form-label">אימייל</label>
            <input className="form-input" placeholder="name@example.com" />
          </div>
          <Button className="w-full py-3">שלח קישור איפוס</Button>
        </Card>
      </section>
    </SiteShell>
  );
}
