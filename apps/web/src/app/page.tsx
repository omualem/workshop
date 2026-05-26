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
            השכרה חכמה. חבילה אחת. ביטחון מלא.
          </span>
          <h1 className="surface-title">
            כל הציוד שאתם צריכים — בחבילה אחת, ממשכירים מאומתים.
          </h1>
          <p className="surface-subtitle">
            מספרים לנו מה צריך, מתי ולאן, ואנחנו בונים לכם את החבילה המשתלמת והאמינה ביותר.
            השוו מחיר, מרחק איסוף, איכות וזמינות — והזמינו בלחיצה אחת.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/bundle-request">
              <Button className="px-6 py-3">בניית חבילה מותאמת</Button>
            </Link>
            <Link href="/search">
              <Button variant="secondary" className="px-6 py-3">
                גלישה בקטלוג
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-section pb-24">
        <div className="mb-8">
          <div className="surface-eyebrow">קטלוג</div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">פריטים מומלצים</h2>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            אין כרגע פריטים זמינים. נסו שוב מאוחר יותר.
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
