import { MetricBars, ReputationBadge, Card } from "@rental/ui";
import { SiteShell } from "../../../components/site-shell";
import { api } from "../../../lib/api";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await api.listing(id);

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="aspect-[16/10] rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.16),_transparent_38%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)]" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">{listing.category.nameHe}</div>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950">{listing.titleHe}</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">{listing.descriptionHe}</p>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="space-y-4">
              <div className="text-sm text-slate-500">החל מיום</div>
              <div className="text-4xl font-semibold text-slate-950">₪{listing.basePriceDaily}</div>
              <div className="text-sm text-slate-500">פיקדון ₪{listing.depositAmount}</div>
              <ReputationBadge
                rating={listing.lender.averageRating}
                completedTransactions={listing.lender.completedTransactionsCount}
              />
            </Card>
            <Card className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-950">איתותי איכות</h2>
              <MetricBars
                metrics={[
                  { label: "איכות מוצר", score: 9.1 },
                  { label: "אמינות מלווה", score: 9.0 },
                  { label: "שלמות listing", score: 8.4 },
                ]}
              />
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                {listing.completenessHints.map((hint: string) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
