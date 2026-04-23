import { Card } from "@rental/ui";
import { SiteShell } from "../../../components/site-shell";
import { api } from "../../../lib/api";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await api.categories();
  const category = categories.find((item: any) => item.slug === slug) ?? categories[0];

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-950">{category.nameHe}</h1>
          <p className="mt-2 text-sm text-slate-600">קטגוריה בעברית מלאה עם RTL וחוזי API i18n-ready.</p>
        </div>
        <Card className="text-sm leading-7 text-slate-600">
          כאן ניתן להציג taxonomy, פילטרים, תוצאות וייחוסי bundle לפי הקטגוריה שנבחרה.
        </Card>
      </section>
    </SiteShell>
  );
}
