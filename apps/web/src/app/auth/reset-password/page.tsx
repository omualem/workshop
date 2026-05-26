import { Card, Button } from "@rental/ui";
import { SiteShell } from "../../../components/site-shell";

export default function ResetPasswordPage() {
  return (
    <SiteShell activeHref="/">
      <section className="surface-section py-14">
        <Card className="mx-auto max-w-md space-y-5 p-6 md:p-8">
          <div>
            <div className="surface-eyebrow">איפוס סיסמה</div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">בחירת סיסמה חדשה</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              הגדירו סיסמה חדשה כדי להמשיך להשתמש בחשבון.
            </p>
          </div>
          <div>
            <label className="form-label">סיסמה חדשה</label>
            <input className="form-input" type="password" placeholder="לפחות 8 תווים" />
          </div>
          <Button className="w-full py-3">שמירת סיסמה</Button>
        </Card>
      </section>
    </SiteShell>
  );
}
