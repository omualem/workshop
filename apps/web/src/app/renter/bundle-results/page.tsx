import { ComparisonTable, ExplanationCard, MetricBars, ScorePill, Card, Button } from "@rental/ui";
import Link from "next/link";
import { DashboardShell } from "../../../components/dashboard-shell";
import { api } from "../../../lib/api";

const navItems = [
  { href: "/renter/dashboard", label: "סקירה" },
  { href: "/renter/orders", label: "הזמנות" },
  { href: "/renter/favorites", label: "מועדפים" },
  { href: "/renter/saved-searches", label: "חיפושים שמורים" },
  { href: "/renter/settings", label: "הגדרות" },
  { href: "/renter/bundle-results", label: "תוצאות bundle" },
];

export default async function BundleResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ searchId?: string }>;
}) {
  const { searchId } = await searchParams;
  const results = await api.bundleResults(searchId ?? "demo-search");

  return (
    <DashboardShell
      title="לוח מזמין"
      subtitle="תוצאות bundle, השוואות והזמנות פעילות במקום אחד."
      navItems={navItems}
      activeHref="/renter/bundle-results"
    >
      <div className="mb-6">
        <div className="surface-eyebrow">Bundle Results</div>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">תוצאות חבילות</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Best Balanced, Best Price ו-Easiest Pickup עם פירוק ציונים מלא והסברים
          קריאים.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {results.topRankedBundles.map((bundle: any) => (
          <Card key={bundle.id} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="surface-eyebrow">{bundle.label}</div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {bundle.explanation.he.title}
                </h2>
              </div>
              <ScorePill score={bundle.overallScore} label="דירוג" />
            </div>
            <MetricBars
              metrics={[
                { label: "מחיר", score: bundle.scores.price },
                { label: "אמינות", score: bundle.scores.reliability },
                { label: "לוגיסטיקה", score: bundle.scores.logistics },
                { label: "זמינות", score: bundle.scores.availability },
                { label: "איכות", score: bundle.scores.quality },
              ]}
            />
            <ExplanationCard
              title={bundle.explanation.he.title}
              subtitle={bundle.explanation.he.subtitle}
              strengths={bundle.explanation.he.strengths}
              tradeoffs={bundle.explanation.he.tradeoffs}
            />
            <div className="flex justify-between text-sm text-slate-600">
              <span>סה"כ מחיר</span>
              <span>₪{bundle.totalBundlePrice}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>נקודות איסוף</span>
              <span>{bundle.pickupPointsCount}</span>
            </div>
            <Link href={`/renter/checkout?bundleId=${bundle.id}`}>
              <Button className="w-full">צפה בפרטים והזמן</Button>
            </Link>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <ComparisonTable
          columns={results.topRankedBundles.map((bundle: any) => ({
            title: bundle.explanation.he.title,
            score: bundle.overallScore,
            price: `₪${bundle.totalBundlePrice}`,
            pickupPoints: `${bundle.pickupPointsCount}`,
            explanation: bundle.explanation.he.subtitle,
          }))}
        />
      </div>
    </DashboardShell>
  );
}
