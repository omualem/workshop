"use client";

import { useRouter } from "next/navigation";

export function SearchPagination({
  page,
  totalPages,
  total,
  currentParams,
}: {
  page: number;
  totalPages: number;
  total: number;
  currentParams: Record<string, string | undefined>;
}) {
  const router = useRouter();

  const goTo = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(currentParams)) {
      if (value !== undefined && value !== "" && key !== "page") params.set(key, value);
    }
    params.set("page", String(p));
    router.push(`/search?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return (
      <div className="mt-8 text-center text-sm text-slate-500">
        סה״כ {total} {total === 1 ? "פריט" : "פריטים"}
      </div>
    );
  }

  const pageNumbers = buildPageList(page, totalPages);

  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <p className="text-sm text-slate-500">
        עמוד {page} מתוך {totalPages} · סה״כ {total} פריטים
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          הקודם
        </button>

        {pageNumbers.map((item, i) =>
          item === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => goTo(item as number)}
              className={`min-w-[2.5rem] rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                item === page
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          הבא
        </button>
      </div>
    </div>
  );
}

function buildPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
