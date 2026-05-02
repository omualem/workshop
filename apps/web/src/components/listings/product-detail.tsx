"use client";

import { useMemo, useState } from "react";
import { Button, Card } from "@rental/ui";
import { api } from "../../lib/api";

type ProductMedia = {
  id: string;
  url: string;
  altText?: string;
};

type ProductAttribute = {
  key: string;
  labelHe: string;
  labelEn?: string;
  value: unknown;
};

type ProductReview = {
  id: string;
  rating: number;
  text: string;
  createdAt?: string;
  reviewer?: {
    fullName?: string;
  };
};

export type ProductDetail = {
  id: string;
  titleHe: string;
  titleEn?: string;
  descriptionHe?: string;
  descriptionEn?: string;
  suitableFor?: string | null;
  mainUses?: string | null;
  category?: {
    nameHe: string;
  };
  categoryBreadcrumb?: Array<{
    nameHe: string;
    slug: string;
  }>;
  media?: ProductMedia[];
  basePriceDaily?: number | string;
  depositAmount?: number | string;
  minRentalDays?: number;
  maxRentalDays?: number;
  condition?: string;
  deliverySupported?: boolean;
  city?: string | null;
  pickupAddressText?: string | null;
  pickupInstructions?: string | null;
  location?: {
    city?: string | null;
    area?: string | null;
    pickupSummary?: string | null;
    pickupAddressText?: string | null;
    deliverySupported?: boolean;
  };
  attributes?: ProductAttribute[];
  includedItems?: string[];
  rentalTerms?: {
    deposit?: number | string;
    cancellationPolicy?: string | null;
    returnTerms?: string | null;
    requiresOperator?: boolean;
    setupRequired?: boolean;
  };
  lenderSummary?: {
    displayName?: string;
    rating?: number;
    reliability?: string;
    responseScore?: number;
    completedTransactions?: number;
  };
  lender?: {
    displayName?: string;
    averageRating?: number | string;
    completedTransactionsCount?: number;
    responseTimeScore?: number | string;
    reliabilityScoreCached?: number | string;
  };
  reviewSummary?: {
    averageRating?: number | null;
    count?: number;
  };
  recentReviews?: ProductReview[];
  reviews?: ProductReview[];
};

const conditionLabels: Record<string, string> = {
  NEW: "חדש",
  LIKE_NEW: "כמו חדש",
  GOOD: "טוב",
  FAIR: "סביר",
  HEAVY_USE: "שחוק",
};

function formatPrice(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  return `₪${Number.isFinite(amount) ? amount.toLocaleString("he-IL") : "0"}`;
}

function formatValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "כן" : "לא";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === null || value === undefined || value === "") {
    return "לא צוין";
  }

  return String(value);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-slate-950">{children}</h2>;
}

export function ProductHeader({ product }: { product: ProductDetail }) {
  const breadcrumb = product.categoryBreadcrumb?.length
    ? product.categoryBreadcrumb
    : product.category
      ? [{ nameHe: product.category.nameHe, slug: "category" }]
      : [];

  return (
    <header className="space-y-3">
      <nav
        className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500"
        aria-label="קטגוריה"
      >
        {breadcrumb.map((item, index) => (
          <span
            key={`${item.slug}-${index}`}
            className="inline-flex items-center gap-2"
          >
            {index > 0 ? <span className="text-slate-300">/</span> : null}
            <span>{item.nameHe}</span>
          </span>
        ))}
      </nav>
      <h1 className="text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
        {product.titleHe}
      </h1>
    </header>
  );
}

export function ProductImageGallery({
  media,
  title,
}: {
  media?: ProductMedia[];
  title: string;
}) {
  const images = media ?? [];
  const [selectedId, setSelectedId] = useState(images[0]?.id);
  const selected = images.find((image) => image.id === selectedId) ?? images[0];

  if (!selected) {
    return (
      <section className="space-y-4" aria-label="תמונות">
        <div className="flex aspect-[4/3] items-center justify-center rounded-[8px] border border-slate-200 bg-slate-50 text-center text-sm font-medium text-slate-500">
          אין תמונות למוצר
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label="תמונות">
      <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
        <img
          src={selected.url}
          alt={selected.altText ?? title}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedId(image.id)}
              className={`overflow-hidden rounded-[8px] border bg-white ${
                selected.id === image.id
                  ? "border-slate-950"
                  : "border-slate-200"
              }`}
            >
              <img
                src={image.url}
                alt={image.altText ?? title}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function ProductPriceCard({ product }: { product: ProductDetail }) {
  return (
    <Card className="space-y-5">
      <SectionTitle>מחיר</SectionTitle>
      <div className="rounded-[8px] bg-slate-50 p-4">
        <div className="text-sm font-medium text-slate-500">מחיר ליום</div>
        <div className="mt-1 text-4xl font-bold text-slate-950">
          {formatPrice(product.basePriceDaily)}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[8px] border border-slate-200 p-3">
          <dt className="text-slate-500">פיקדון</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {formatPrice(product.depositAmount)}
          </dd>
        </div>
        <div className="rounded-[8px] border border-slate-200 p-3">
          <dt className="text-slate-500">מינימום ימים</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {product.minRentalDays ?? 1}
          </dd>
        </div>
        <div className="rounded-[8px] border border-slate-200 p-3">
          <dt className="text-slate-500">מקסימום ימים</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {product.maxRentalDays ?? 30}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export function ProductDescriptionSection({
  product,
}: {
  product: ProductDetail;
}) {
  return (
    <Card className="space-y-5">
      <SectionTitle>תיאור</SectionTitle>
      <p className="text-base leading-8 text-slate-700">
        {product.descriptionHe || "לא נוסף תיאור למוצר."}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[8px] border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-950">למי זה מתאים</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {product.suitableFor || "לא צוין"}
          </p>
        </div>
        <div className="rounded-[8px] border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-950">שימושים עיקריים</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {product.mainUses || "לא צוין"}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function ProductAttributesTable({
  attributes = [],
}: {
  attributes?: ProductAttribute[];
}) {
  if (attributes.length === 0) {
    return (
      <Card className="space-y-3">
        <SectionTitle>פרטים טכניים</SectionTitle>
        <p className="text-sm text-slate-500">אין מאפיינים נוספים</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <SectionTitle>פרטים טכניים</SectionTitle>
      <div className="overflow-hidden rounded-[8px] border border-slate-200">
        <table className="w-full text-sm">
          <tbody>
            {attributes.map((attribute) => (
              <tr key={attribute.key} className="border-t first:border-t-0">
                <th className="w-1/2 bg-slate-50 px-4 py-3 text-right font-semibold text-slate-700">
                  {attribute.labelHe}
                </th>
                <td className="px-4 py-3 text-slate-700">
                  {formatValue(attribute.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ProductConditionCard({ condition }: { condition?: string }) {
  return (
    <Card className="space-y-3">
      <SectionTitle>מצב המוצר</SectionTitle>
      <div className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
        {conditionLabels[condition ?? ""] ?? "לא צוין"}
      </div>
    </Card>
  );
}

export function ProductAvailabilityChecker({
  listingId,
}: {
  listingId: string;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "available" | "unavailable"
  >("idle");

  const canCheck = startDate.length > 0 && endDate.length > 0;

  const checkAvailability = async () => {
    if (!canCheck) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      const result = await api.listingAvailability(
        listingId,
        startDate,
        endDate,
      );
      setStatus(result.available ? "available" : "unavailable");
    } catch {
      setStatus("unavailable");
    }
  };

  const message = useMemo(() => {
    if (status === "available") return "זמין בתאריכים שבחרת";
    if (status === "unavailable") return "לא זמין בתאריכים שבחרת";
    if (status === "loading") return "בודק זמינות...";
    return "בחר תאריכים כדי לבדוק זמינות";
  }, [status]);

  return (
    <Card className="space-y-4">
      <SectionTitle>זמינות</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">מתאריך</span>
          <input
            className="form-input"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-600">עד תאריך</span>
          <input
            className="form-input"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>
      </div>
      <div
        className={`rounded-[8px] border p-4 text-sm font-semibold ${
          status === "available"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : status === "unavailable"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-slate-200 bg-slate-50 text-slate-600"
        }`}
      >
        {message}
      </div>
      <Button
        type="button"
        onClick={checkAvailability}
        disabled={!canCheck || status === "loading"}
      >
        בדוק זמינות
      </Button>
    </Card>
  );
}

export function ProductLocationCard({ product }: { product: ProductDetail }) {
  const location = product.location;
  const pickupSummary =
    location?.pickupSummary ||
    product.pickupInstructions ||
    product.pickupAddressText ||
    "פרטי איסוף יימסרו לאחר אישור ההזמנה";

  return (
    <Card className="space-y-4">
      <SectionTitle>מיקום ואיסוף</SectionTitle>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-slate-500">עיר / אזור</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {location?.city || product.city || "לא צוין"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">פרטי איסוף</dt>
          <dd className="mt-1 leading-7 text-slate-700">{pickupSummary}</dd>
        </div>
        <div>
          <dt className="text-slate-500">משלוח</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {(location?.deliverySupported ?? product.deliverySupported)
              ? "זמין בתיאום"
              : "לא זמין"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export function LenderSummaryCard({ product }: { product: ProductDetail }) {
  const lender = product.lenderSummary;
  const rating = lender?.rating ?? Number(product.lender?.averageRating ?? 0);

  return (
    <Card className="space-y-4">
      <SectionTitle>פרטי המשכיר</SectionTitle>
      <div>
        <div className="text-xl font-semibold text-slate-950">
          {lender?.displayName || product.lender?.displayName || "לא צוין"}
        </div>
        <div className="mt-2 text-sm text-slate-500">
          דירוג {rating ? rating.toFixed(1) : "אין עדיין"}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[8px] bg-slate-50 p-3">
          <dt className="text-slate-500">אמינות</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {lender?.reliability || "אמינות בבדיקה"}
          </dd>
        </div>
        <div className="rounded-[8px] bg-slate-50 p-3">
          <dt className="text-slate-500">מענה</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {lender?.responseScore ?? "לא צוין"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export function RentalTermsCard({ product }: { product: ProductDetail }) {
  const terms = product.rentalTerms;

  return (
    <Card className="space-y-4">
      <SectionTitle>תנאי השכרה</SectionTitle>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-slate-500">פיקדון</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {formatPrice(terms?.deposit ?? product.depositAmount)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">תנאי ביטול</dt>
          <dd className="mt-1 leading-7 text-slate-700">
            {terms?.cancellationPolicy || "לא צוינו תנאי ביטול"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">תנאי החזרה</dt>
          <dd className="mt-1 leading-7 text-slate-700">
            {terms?.returnTerms || "לא צוינו תנאי החזרה"}
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[8px] bg-slate-50 p-3">
            <dt className="text-slate-500">דורש מפעיל</dt>
            <dd className="mt-1 font-semibold text-slate-950">
              {terms?.requiresOperator ? "כן" : "לא"}
            </dd>
          </div>
          <div className="rounded-[8px] bg-slate-50 p-3">
            <dt className="text-slate-500">דורש הקמה</dt>
            <dd className="mt-1 font-semibold text-slate-950">
              {terms?.setupRequired ? "כן" : "לא"}
            </dd>
          </div>
        </div>
      </dl>
    </Card>
  );
}

export function IncludedItemsCard({ items = [] }: { items?: string[] }) {
  return (
    <Card className="space-y-4">
      <SectionTitle>מה כלול</SectionTitle>
      {items.length > 0 ? (
        <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-[8px] border border-slate-200 px-3 py-2"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">לא צוינו פריטים כלולים</p>
      )}
    </Card>
  );
}

export function ReviewsSection({ product }: { product: ProductDetail }) {
  const reviews = product.recentReviews ?? product.reviews ?? [];
  const summary = product.reviewSummary;

  return (
    <Card className="space-y-5">
      <SectionTitle>ביקורות</SectionTitle>
      <div className="rounded-[8px] bg-slate-50 p-4 text-sm text-slate-700">
        דירוג ממוצע:{" "}
        {summary?.averageRating
          ? summary.averageRating.toFixed(1)
          : "אין עדיין"}{" "}
        · {summary?.count ?? reviews.length} ביקורות
      </div>
      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[8px] border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-slate-950">
                  {review.reviewer?.fullName || "משתמש"}
                </span>
                <span className="text-slate-500">דירוג {review.rating}/5</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {review.text}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">אין עדיין ביקורות</p>
      )}
    </Card>
  );
}
