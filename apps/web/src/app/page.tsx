import type { ReactNode } from "react";
import Link from "next/link";
import { Button, ListingCard } from "@rental/ui";
import { api } from "../lib/api";
import { SiteShell } from "../components/site-shell";

const HOW_IT_WORKS = [
  {
    n: "1",
    title: "מספרים מה צריך",
    body: "בוחרים פריטים, תאריכים, תקציב וכתובת איסוף.",
  },
  {
    n: "2",
    title: "המערכת בונה חבילות",
    body: "סורקים מועמדים ומדרגים לפי מחיר, מרחק, אמינות וזמינות.",
  },
  {
    n: "3",
    title: "בוחרים את ההצעה הטובה ביותר",
    body: "משווים חבילות מדורגות עם הסבר לכל בחירה ומזמינים.",
  },
];

const TRUST_STRIP: Array<{ label: string; icon: ReactNode }> = [
  {
    label: "השוואת מחיר",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M4 19V5m16 14V5M4 12h16M8 8v8M16 8v8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "פחות נקודות איסוף",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 21s-7-7.6-7-12a7 7 0 1 1 14 0c0 4.4-7 12-7 12Z" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    label: "דירוגים עם ביטחון",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="m12 3 2.6 5.4 5.9.6-4.4 4 1.2 5.9L12 16l-5.3 2.9 1.2-5.9-4.4-4 5.9-.6L12 3Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "התאמה לתקציב",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M3 7h18v10H3z" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M7 7V5h10v2" />
      </svg>
    ),
  },
];

const SAMPLE_BUNDLE: Array<{
  titleHe: string;
  city: string;
  price: number;
  reliability: number;
}> = [
  { titleHe: "מצלמת DSLR", city: "תל אביב", price: 220, reliability: 9.4 },
  { titleHe: "סט תאורת LED", city: "תל אביב", price: 140, reliability: 9.1 },
  { titleHe: "חצובה מקצועית", city: "רמת גן", price: 60, reliability: 8.8 },
];

export default async function HomePage() {
  const result = await api.listings({ pageSize: "9" });
  const listings = result.items.slice(0, 9);

  const previewItems =
    listings.length >= 3
      ? listings.slice(0, 3).map((l: any) => ({
          titleHe: l.titleHe as string,
          city: (l.city ?? l.category?.nameHe ?? "ישראל") as string,
          price: Number(l.basePriceDaily),
          reliability: Math.min(
            9.9,
            Math.max(7.5, Number(l.lender?.averageRating ?? 4.6) * 2),
          ),
        }))
      : SAMPLE_BUNDLE;

  const totalPrice = previewItems.reduce((s, i) => s + i.price, 0);
  const avgReliability =
    previewItems.reduce((s, i) => s + i.reliability, 0) / previewItems.length;

  return (
    <SiteShell activeHref="/">
      {/* Hero */}
      <section className="surface-section pt-16 pb-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="space-y-6 lg:max-w-xl">
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

          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-bl from-cyan-100/70 via-white to-slate-100" />
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-700">
                    תוצאה לדוגמה
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    החבילה המומלצת ביותר
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ציון {avgReliability.toFixed(1)}
                </span>
              </div>

              <ul className="mt-5 space-y-2.5">
                {previewItems.map((item, idx) => (
                  <li
                    key={`${item.titleHe}-${idx}`}
                    className="rounded-2xl border border-slate-100 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {item.titleHe}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                            <path d="M12 21s-7-7.6-7-12a7 7 0 1 1 14 0c0 4.4-7 12-7 12Z" strokeLinejoin="round" />
                            <circle cx="12" cy="9" r="2" />
                          </svg>
                          <span>{item.city}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-left">
                        <div className="text-sm font-semibold text-slate-900">
                          ₪{item.price.toFixed(0)}
                          <span className="ms-1 text-[11px] font-normal text-slate-400">
                            ליום
                          </span>
                        </div>
                        <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          <span className="text-amber-500">★</span>
                          {item.reliability.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-xl bg-slate-50 px-2 py-3">
                  <div className="text-base font-semibold text-slate-900">
                    {previewItems.length}
                  </div>
                  <div className="text-slate-500">פריטים</div>
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-3">
                  <div className="text-base font-semibold text-slate-900">
                    ₪{totalPrice.toFixed(0)}
                  </div>
                  <div className="text-slate-500">סה״כ ליום</div>
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-3">
                  <div className="text-base font-semibold text-slate-900">
                    {avgReliability.toFixed(1)}
                  </div>
                  <div className="text-slate-500">אמינות ממוצעת</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="surface-section pb-2">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 sm:grid-cols-4">
          {TRUST_STRIP.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-2 py-1 text-sm font-medium text-slate-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="surface-section py-14">
        <div className="mb-8 max-w-2xl">
          <div className="surface-eyebrow">איך זה עובד</div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            שלוש פעולות פשוטות, חבילה אחת מותאמת
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.n}
              className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-700">
                {step.n}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm leading-7 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="surface-section pb-16">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="surface-eyebrow">קטלוג</div>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              פריטים מומלצים
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              מבחר פריטים פופולריים ממשכירים מאומתים — לחצו על פריט כדי לראות פרטים מלאים.
            </p>
          </div>
          <Link href="/search" className="hidden md:inline-flex">
            <Button variant="secondary" className="px-5 py-2.5">
              לכל הקטלוג
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            אין כרגע פריטים זמינים. נסו שוב מאוחר יותר.
          </div>
        ) : (
          <>
            <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing: any) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="block h-full"
                >
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
            <div className="mt-8 text-center md:hidden">
              <Link href="/search">
                <Button variant="secondary" className="px-8 py-3">
                  לכל הפריטים בקטלוג
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Final CTA */}
      <section className="surface-section pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-l from-cyan-50 via-white to-white p-10 text-center shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
            מוכנים לבנות חבילה?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            הגדירו תאריכים, תקציב ופריטים — ונמצא עבורכם את האפשרויות המתאימות ביותר.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/bundle-request">
              <Button className="px-7 py-3">בניית חבילה מותאמת</Button>
            </Link>
            <Link href="/search">
              <Button variant="secondary" className="px-7 py-3">
                צפייה בקטלוג
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
