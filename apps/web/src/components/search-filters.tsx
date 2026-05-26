"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = { id: string; nameHe: string; slug: string; children?: Category[] };

type Filters = {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  startDate: string;
  endDate: string;
};

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function nextFriday(): Date {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun…5=Fri
  const diff = ((5 - dow + 7) % 7) || 7;
  return addDays(today, diff);
}

export function SearchFilters({
  categories,
  currentParams,
}: {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}) {
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>({
    search: currentParams.search ?? "",
    categoryId: currentParams.categoryId ?? "",
    minPrice: currentParams.minPrice ?? "",
    maxPrice: currentParams.maxPrice ?? "",
    startDate: currentParams.startDate ?? "",
    endDate: currentParams.endDate ?? "",
  });

  const set = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const applyDateShortcut = (startDate: string, endDate: string) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const apply = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    // page intentionally omitted — applying filters resets to page 1
    router.push(`/search?${params.toString()}`);
  };

  const clear = () => {
    setFilters({ search: "", categoryId: "", minPrice: "", maxPrice: "", startDate: "", endDate: "" });
    router.push("/search");
  };

  const today = new Date();
  const shortcuts = [
    { label: "יום אחד", start: formatDate(today), end: formatDate(addDays(today, 1)) },
    {
      label: "סוף שבוע",
      start: formatDate(nextFriday()),
      end: formatDate(addDays(nextFriday(), 2)),
    },
    { label: "3 ימים", start: formatDate(today), end: formatDate(addDays(today, 3)) },
    { label: "שבוע", start: formatDate(today), end: formatDate(addDays(today, 7)) },
  ];

  const hasActiveFilters =
    filters.search ||
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.startDate ||
    filters.endDate;

  return (
    <aside className="surface-panel w-72 shrink-0 space-y-6 self-start p-5 sticky top-24">
      <h2 className="text-base font-semibold text-slate-900">סינון תוצאות</h2>

      {/* Text search */}
      <div className="space-y-2">
        <label className="form-label">חיפוש לפי שם פריט</label>
        <input
          className="form-input"
          placeholder="שם פריט או מותג"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="form-label">קטגוריה</label>
        <select
          className="form-select"
          value={filters.categoryId}
          onChange={(e) => set("categoryId", e.target.value)}
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((parent) =>
            parent.children && parent.children.length > 0 ? (
              <optgroup key={parent.id} label={parent.nameHe}>
                {parent.children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.nameHe}
                  </option>
                ))}
              </optgroup>
            ) : (
              <option key={parent.id} value={parent.id}>
                {parent.nameHe}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <label className="form-label">טווח מחיר ליום (₪)</label>
        <div className="flex items-center gap-2">
          <input
            className="form-input"
            type="number"
            min="0"
            placeholder="מינימום"
            value={filters.minPrice}
            onChange={(e) => set("minPrice", e.target.value)}
          />
          <span className="shrink-0 text-slate-400">—</span>
          <input
            className="form-input"
            type="number"
            min="0"
            placeholder="מקסימום"
            value={filters.maxPrice}
            onChange={(e) => set("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Date availability */}
      <div className="space-y-2">
        <label className="form-label">זמינות לתאריכים</label>
        <input
          className="form-input"
          type="date"
          value={filters.startDate}
          onChange={(e) => set("startDate", e.target.value)}
        />
        <input
          className="form-input"
          type="date"
          value={filters.endDate}
          min={filters.startDate}
          onChange={(e) => set("endDate", e.target.value)}
        />
        <div className="flex flex-wrap gap-2 pt-1">
          {shortcuts.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => applyDateShortcut(s.start, s.end)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-cyan-400 hover:text-cyan-700"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={apply}
          className="flex-1 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          הצגת תוצאות
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clear}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            איפוס
          </button>
        )}
      </div>
    </aside>
  );
}
