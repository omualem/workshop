import Link from "next/link";
import { Button, ListingCard } from "@rental/ui";
import { api } from "../lib/api";
import { SiteShell } from "../components/site-shell";

export default async function HomePage() {
  const result = await api.listings({ pageSize: "10" });
  const listings = result.items;

  return (
    <SiteShell activeHref="/">
      <section className="surface-section py-16">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
            שוק השכרה חכם לריבוי פריטים
          </span>
          <h1 className="surface-title">
            שכירו כל מה שצריך לפרויקט שלכם — בחבילה אחת, ממלווים מאומתים.
          </h1>
          <p className="surface-subtitle">
            RentMatch מאתרת עבורכם קומבינציות מציוד ממספר מלווים, מדרגת כל חבילה לפי מחיר,
            אמינות, לוגיסטיקה, זמינות ואיכות — ומסבירה בעברית למה כל חבילה מדורגת כפי שהיא.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/search">
              <Button className="px-6 py-3">עיינו בקטלוג</Button>
            </Link>
            <Link href="/bundle-request">
              <Button variant="secondary" className="px-6 py-3">
                בנו בקשת חבילה
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-section pb-24">
        <div className="mb-8">
          <div className="surface-eyebrow">Marketplace</div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">מוצרים לדוגמה</h2>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            אין פריטים זמינים כרגע
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {listings.map((listing: any) => (
                <Link key={listing.id} href={`/listings/${listing.id}`} className="block">
                  <ListingCard
                    title={listing.titleHe}
                    category={listing.category.nameHe}
                    price={listing.basePriceDaily}
                    lenderName={listing.lender.displayName}
                    rating={listing.lender.averageRating}
                    completedTransactions={listing.lender.completedTransactionsCount}
                    description={listing.descriptionHe}
                    imageUrl={listing.media?.[0]?.url}
                  />
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/search">
                <Button variant="secondary" className="px-8 py-3">
                  לכל הפריטים בקטלוג
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </SiteShell>
  );
}
