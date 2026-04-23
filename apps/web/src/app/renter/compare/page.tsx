import { ComparisonTable } from "@rental/ui";
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

export default async function ComparePage() {
  const results = await api.bundleResults("demo-search");

  return (
    <DashboardShell title="השוואת חבילות" subtitle="השוואה side-by-side בין bundles מובילים." navItems={navItems}>
      <ComparisonTable
        columns={results.topRankedBundles.map((bundle: any) => ({
          title: bundle.explanation.he.title,
          score: bundle.overallScore,
          price: `₪${bundle.totalBundlePrice}`,
          pickupPoints: `${bundle.pickupPointsCount}`,
          explanation: bundle.explanation.he.subtitle,
        }))}
      />
    </DashboardShell>
  );
}
