import Link from "next/link";
import { ListingCard } from "@rental/ui";
import { SiteShell } from "../../components/site-shell";
import { SearchFilters } from "../../components/search-filters";
import { SearchPagination } from "../../components/search-pagination";
import { api } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const [result, categories] = await Promise.all([
    api.listings(params),
    api.categories(),
  ]);

  return (
    <SiteShell activeHref="/search">
      <div className="surface-section py-14">
        <div className="mb-8">
          <div className="surface-eyebrow">Marketplace</div>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">חיפוש ציוד</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            קטלוג ציבורי עם פילטרים לפי קטגוריה, מחיר ותאריכים. סנן, גלה והמשך לבניית חבילה.
          </p>
        </div>

        {/* RTL: aside first → appears on the right; main content → appears on the left */}
        <div className="flex items-start gap-8">
          <SearchFilters categories={categories as any} currentParams={params} />

          <div className="min-w-0 flex-1">
            {result.items.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center">
                <p className="text-lg font-medium text-slate-700">
                  לא נמצאו פריטים תואמים למסננים שבחרת
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  נסו להרחיב את טווח המחיר, לבחור קטגוריה אחרת או לשנות את התאריכים.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm text-slate-500">
                  {result.total} פריטים נמצאו · עמוד {result.page}
                </p>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {result.items.map((listing: any) => (
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
              </>
            )}

            <SearchPagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              currentParams={params}
            />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
