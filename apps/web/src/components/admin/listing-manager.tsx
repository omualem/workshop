"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card } from "@rental/ui";
import { api } from "../../lib/api";

type ListingFormState = {
  id?: string;
  lenderId: string;
  categoryId: string;
  titleHe: string;
  titleEn: string;
  descriptionHe: string;
  descriptionEn: string;
  condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";
  status: "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "BLOCKED" | "ARCHIVED";
  basePriceDaily: number;
  depositAmount: number;
  pickupLat: number;
  pickupLng: number;
  pickupAddressText: string;
  deliverySupported: boolean;
  inventoryCount: number;
  minRentalDays: number;
  maxRentalDays: number;
};

const emptyListingForm: ListingFormState = {
  lenderId: "",
  categoryId: "",
  titleHe: "",
  titleEn: "",
  descriptionHe: "",
  descriptionEn: "",
  condition: "GOOD",
  status: "ACTIVE",
  basePriceDaily: 0,
  depositAmount: 0,
  pickupLat: 32.0853,
  pickupLng: 34.7818,
  pickupAddressText: "",
  deliverySupported: false,
  inventoryCount: 1,
  minRentalDays: 1,
  maxRentalDays: 7,
};

export function ListingManager() {
  const { data: options = { categories: [], lenders: [] } } = useQuery({
    queryKey: ["admin-catalog-options"],
    queryFn: api.adminCatalogOptions,
  });
  const { data: remoteListings = [] } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: () => api.adminListings(),
  });

  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<ListingFormState>(emptyListingForm);
  const [filters, setFilters] = useState({ search: "", status: "", categoryId: "" });

  const mergedItems = items.length > 0 ? items : remoteListings;

  const createMutation = useMutation({
    mutationFn: api.createAdminListing,
    onSuccess: (created) => {
      setItems((current) => [{ ...created }, ...(current.length ? current : remoteListings)]);
      setForm(emptyListingForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.updateAdminListing(id, payload),
    onSuccess: (updated) => {
      setItems((current) =>
        (current.length ? current : remoteListings).map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
      setForm(emptyListingForm);
    },
  });

  const visibleItems = useMemo(
    () =>
      mergedItems.filter((item) => {
        if (filters.status && item.status !== filters.status) {
          return false;
        }
        if (filters.categoryId && item.categoryId !== filters.categoryId) {
          return false;
        }
        if (filters.search) {
          const value = `${item.titleHe} ${item.titleEn} ${item.descriptionHe}`.toLowerCase();
          return value.includes(filters.search.toLowerCase());
        }
        return true;
      }),
    [filters, mergedItems],
  );

  const counts = useMemo(
    () => ({
      active: mergedItems.filter((item) => item.status === "ACTIVE").length,
      pending: mergedItems.filter((item) => item.status === "PENDING_REVIEW").length,
      blocked: mergedItems.filter((item) => item.status === "BLOCKED").length,
    }),
    [mergedItems],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      lenderId: form.lenderId,
      categoryId: form.categoryId,
      titleHe: form.titleHe,
      titleEn: form.titleEn,
      descriptionHe: form.descriptionHe,
      descriptionEn: form.descriptionEn,
      condition: form.condition,
      status: form.status,
      basePriceDaily: Number(form.basePriceDaily),
      depositAmount: Number(form.depositAmount),
      pickupLat: Number(form.pickupLat),
      pickupLng: Number(form.pickupLng),
      pickupAddressText: form.pickupAddressText,
      deliverySupported: form.deliverySupported,
      inventoryCount: Number(form.inventoryCount),
      minRentalDays: Number(form.minRentalDays),
      maxRentalDays: Number(form.maxRentalDays),
    };

    if (form.id) {
      updateMutation.mutate({ id: form.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const startEdit = (item: any) => {
    setForm({
      id: item.id,
      lenderId: item.lenderId,
      categoryId: item.categoryId,
      titleHe: item.titleHe,
      titleEn: item.titleEn,
      descriptionHe: item.descriptionHe,
      descriptionEn: item.descriptionEn,
      condition: item.condition,
      status: item.status,
      basePriceDaily: Number(item.basePriceDaily),
      depositAmount: Number(item.depositAmount),
      pickupLat: Number(item.pickupLat),
      pickupLng: Number(item.pickupLng),
      pickupAddressText: item.pickupAddressText,
      deliverySupported: Boolean(item.deliverySupported),
      inventoryCount: Number(item.inventoryCount),
      minRentalDays: Number(item.minRentalDays),
      maxRentalDays: Number(item.maxRentalDays),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card><div className="text-sm text-slate-500">פעילים</div><div className="mt-2 text-3xl font-semibold">{counts.active}</div></Card>
        <Card><div className="text-sm text-slate-500">ממתינים לבדיקה</div><div className="mt-2 text-3xl font-semibold">{counts.pending}</div></Card>
        <Card><div className="text-sm text-slate-500">חסומים</div><div className="mt-2 text-3xl font-semibold">{counts.blocked}</div></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{form.id ? "עריכת פריט" : "הוספת פריט"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              האדמין יכול להוסיף, לערוך ולסדר פריטים לפי קטגוריה, סטטוס ומלווה.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <select className="rounded-2xl border px-4 py-3" value={form.lenderId} onChange={(event) => setForm((current) => ({ ...current, lenderId: event.target.value }))}>
              <option value="">בחר מלווה</option>
              {options.lenders.map((lender: any) => (
                <option key={lender.userId} value={lender.userId}>{lender.displayName}</option>
              ))}
            </select>
            <select className="rounded-2xl border px-4 py-3" value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}>
              <option value="">בחר קטגוריה</option>
              {options.categories.map((category: any) => (
                <option key={category.id} value={category.id}>{category.nameHe}</option>
              ))}
            </select>
            <input className="rounded-2xl border px-4 py-3 md:col-span-2" placeholder="כותרת בעברית" value={form.titleHe} onChange={(event) => setForm((current) => ({ ...current, titleHe: event.target.value }))} />
            <input className="rounded-2xl border px-4 py-3 md:col-span-2" placeholder="English title" value={form.titleEn} onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))} />
            <textarea className="min-h-24 rounded-2xl border px-4 py-3 md:col-span-2" placeholder="תיאור בעברית" value={form.descriptionHe} onChange={(event) => setForm((current) => ({ ...current, descriptionHe: event.target.value }))} />
            <textarea className="min-h-24 rounded-2xl border px-4 py-3 md:col-span-2" placeholder="English description" value={form.descriptionEn} onChange={(event) => setForm((current) => ({ ...current, descriptionEn: event.target.value }))} />
            <select className="rounded-2xl border px-4 py-3" value={form.condition} onChange={(event) => setForm((current) => ({ ...current, condition: event.target.value as ListingFormState["condition"] }))}>
              <option value="NEW">NEW</option>
              <option value="LIKE_NEW">LIKE_NEW</option>
              <option value="GOOD">GOOD</option>
              <option value="FAIR">FAIR</option>
              <option value="HEAVY_USE">HEAVY_USE</option>
            </select>
            <select className="rounded-2xl border px-4 py-3" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ListingFormState["status"] }))}>
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            <input type="number" className="rounded-2xl border px-4 py-3" placeholder="מחיר יומי" value={form.basePriceDaily} onChange={(event) => setForm((current) => ({ ...current, basePriceDaily: Number(event.target.value) }))} />
            <input type="number" className="rounded-2xl border px-4 py-3" placeholder="פיקדון" value={form.depositAmount} onChange={(event) => setForm((current) => ({ ...current, depositAmount: Number(event.target.value) }))} />
            <input className="rounded-2xl border px-4 py-3 md:col-span-2" placeholder="כתובת איסוף" value={form.pickupAddressText} onChange={(event) => setForm((current) => ({ ...current, pickupAddressText: event.target.value }))} />
            <input type="number" step="0.000001" className="rounded-2xl border px-4 py-3" placeholder="Latitude" value={form.pickupLat} onChange={(event) => setForm((current) => ({ ...current, pickupLat: Number(event.target.value) }))} />
            <input type="number" step="0.000001" className="rounded-2xl border px-4 py-3" placeholder="Longitude" value={form.pickupLng} onChange={(event) => setForm((current) => ({ ...current, pickupLng: Number(event.target.value) }))} />
            <input type="number" className="rounded-2xl border px-4 py-3" placeholder="מלאי" value={form.inventoryCount} onChange={(event) => setForm((current) => ({ ...current, inventoryCount: Number(event.target.value) }))} />
            <input type="number" className="rounded-2xl border px-4 py-3" placeholder="מינימום ימים" value={form.minRentalDays} onChange={(event) => setForm((current) => ({ ...current, minRentalDays: Number(event.target.value) }))} />
            <input type="number" className="rounded-2xl border px-4 py-3" placeholder="מקסימום ימים" value={form.maxRentalDays} onChange={(event) => setForm((current) => ({ ...current, maxRentalDays: Number(event.target.value) }))} />
            <label className="flex items-center gap-3 rounded-2xl border px-4 py-3 md:col-span-2">
              <input type="checkbox" checked={form.deliverySupported} onChange={(event) => setForm((current) => ({ ...current, deliverySupported: event.target.checked }))} />
              <span className="text-sm text-slate-700">תומך במשלוח</span>
            </label>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit">{form.id ? "שמור פריט" : "הוסף פריט"}</Button>
              {form.id ? <Button type="button" variant="secondary" onClick={() => setForm(emptyListingForm)}>ביטול</Button> : null}
            </div>
          </form>
        </Card>

        <Card className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <input className="flex-1 rounded-2xl border px-4 py-3" placeholder="חיפוש לפי כותרת או תיאור" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
            <select className="rounded-2xl border px-4 py-3" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">כל הסטטוסים</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            <select className="rounded-2xl border px-4 py-3" value={filters.categoryId} onChange={(event) => setFilters((current) => ({ ...current, categoryId: event.target.value }))}>
              <option value="">כל הקטגוריות</option>
              {options.categories.map((category: any) => (
                <option key={category.id} value={category.id}>{category.nameHe}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-right">פריט</th>
                  <th className="px-4 py-3 text-right">קטגוריה</th>
                  <th className="px-4 py-3 text-right">מלווה</th>
                  <th className="px-4 py-3 text-right">מחיר</th>
                  <th className="px-4 py-3 text-right">סטטוס</th>
                  <th className="px-4 py-3 text-right">פעולה</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{item.titleHe}</div>
                      <div className="text-xs text-slate-500">{item.pickupAddressText}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.category?.nameHe ?? options.categories.find((category: any) => category.id === item.categoryId)?.nameHe ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{item.lender?.displayName ?? options.lenders.find((lender: any) => lender.userId === item.lenderId)?.displayName ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">₪{Number(item.basePriceDaily).toFixed(0)}</td>
                    <td className="px-4 py-3 text-slate-600">{item.status}</td>
                    <td className="px-4 py-3">
                      <Button variant="secondary" onClick={() => startEdit(item)}>ערוך</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
