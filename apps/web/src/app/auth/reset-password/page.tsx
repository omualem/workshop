import { Card, Button } from "@rental/ui";
import { SiteShell } from "../../../components/site-shell";

export default function ResetPasswordPage() {
  return (
    <SiteShell>
      <section className="surface-section py-14">
        <Card className="mx-auto max-w-md space-y-5 p-6 md:p-8">
          <div>
            <div className="surface-eyebrow">Recovery</div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-950">איפוס סיסמה</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              הזינו סיסמה חדשה כדי להחזיר גישה לחשבון.
            </p>
          </div>
          <div>
            <label className="form-label">סיסמה חדשה</label>
            <input className="form-input" type="password" />
          </div>
          <Button className="w-full py-3">עדכון סיסמה</Button>
        </Card>
      </section>
    </SiteShell>
  );
}
