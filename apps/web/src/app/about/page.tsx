import { Card } from "@rental/ui";
import { SiteShell } from "../../components/site-shell";

export default function AboutPage() {
  return (
    <SiteShell activeHref="/about">
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-slate-950">איך מנוע הדירוג עובד</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            המנוע לא מחפש רק “מה זמין”, אלא יוצר חבילות, מנרמל מדדים, מחיל penalties על חוסר איזון,
            ושומר הסברים ו-debug data עבור כל חיפוש.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            "מחיר נמדד מול התייחסות שוק ולא רק לפי הזול ביותר.",
            "אמינות מבוססת על דירוג, ביטולים, איחורים, תלונות ואימות.",
            "לוגיסטיקה מתעדפת פחות נקודות איסוף ומרחק קצר יותר.",
            "stability penalizes bundles with one weak dimension.",
          ].map((text) => (
            <Card key={text} className="text-sm leading-7 text-slate-700">
              {text}
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
