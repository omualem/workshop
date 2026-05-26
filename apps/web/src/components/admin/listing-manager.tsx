"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { Button, Card } from "@rental/ui";
import { api } from "../../lib/api";
import {
  AddressSelector,
  type AddressSelectionValue,
} from "../forms/address-selector";

type ListingStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "BLOCKED"
  | "ARCHIVED";

type AvailabilityStatus = "BLOCKED" | "BOOKED" | "MAINTENANCE";

type AvailabilityRow = {
  id: string;
  startDate: string;
  endDate: string;
  status: AvailabilityStatus;
  reason: string;
};

type ListingFormState = {
  id?: string;
  status: ListingStatus;
  lenderId: string;
  categoryId: string;
  titleHe: string;
  descriptionHe: string;
  // cityId + streetId + addressNumber are the source of truth for the
  // address. pickupAddressText / pickupLat / pickupLng are derived by the
  // backend and are never part of editable form state.
  cityId: string;
  cityNameHe: string;
  streetId: string;
  streetNameHe: string;
  addressNumber: string;
  basePriceDaily: string;
  depositAmount: string;
  inventoryCount: string;
  minRentalDays: string;
  maxRentalDays: string;
  deliverySupported: boolean;
  requiresOperator: boolean;
  setupRequired: boolean;
  pickupInstructions: string;
  cancellationPolicy: string;
  returnTerms: string;
  includedItemsText: string;
  imageUrlsText: string;
  availabilityBlocks: AvailabilityRow[];
};

type CategoryOption = {
  id: string;
  nameHe: string;
  parentId: string | null;
  status?: string;
};

type LenderOption = {
  userId: string;
  displayName: string;
  user?: {
    fullName?: string;
  };
};

function createRowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createEmptyAvailabilityRow(): AvailabilityRow {
  return {
    id: createRowId(),
    startDate: "",
    endDate: "",
    status: "BLOCKED",
    reason: "",
  };
}

const emptyListingForm: ListingFormState = {
  status: "ACTIVE",
  lenderId: "",
  categoryId: "",
  titleHe: "",
  descriptionHe: "",
  cityId: "",
  cityNameHe: "",
  streetId: "",
  streetNameHe: "",
  addressNumber: "",
  basePriceDaily: "",
  depositAmount: "0",
  inventoryCount: "1",
  minRentalDays: "1",
  maxRentalDays: "30",
  deliverySupported: false,
  requiresOperator: false,
  setupRequired: false,
  pickupInstructions: "",
  cancellationPolicy: "",
  returnTerms: "",
  includedItemsText: "",
  imageUrlsText: "",
  availabilityBlocks: [],
};


const statusLabels: Record<ListingStatus, string> = {
  DRAFT: "טיוטה",
  PENDING_REVIEW: "ממתין לבדיקה",
  ACTIVE: "פעיל",
  BLOCKED: "חסום",
  ARCHIVED: "בארכיון",
};

const availabilityStatusLabels: Record<AvailabilityStatus, string> = {
  BLOCKED: "חסום",
  BOOKED: "תפוס",
  MAINTENANCE: "תחזוקה",
};

function parseMultilineList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildLeafCategories(categories: CategoryOption[]) {
  const activeCategories = categories.filter(
    (category) => (category.status ?? "ACTIVE") === "ACTIVE",
  );
  const parentIds = new Set(
    activeCategories
      .map((category) => category.parentId)
      .filter((value): value is string => Boolean(value)),
  );
  const categoryById = new Map(
    activeCategories.map((category) => [category.id, category]),
  );

  return activeCategories
    .filter((category) => !parentIds.has(category.id))
    .map((category) => ({
      ...category,
      labelHe: category.parentId
        ? `${categoryById.get(category.parentId)?.nameHe ?? "קטגוריה"} / ${category.nameHe}`
        : category.nameHe,
    }));
}

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-[24px] border border-slate-200 p-4 md:p-5">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function ListingManager({
  initialCreateOpen = false,
}: {
  initialCreateOpen?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: options = { categories: [], lenders: [] } } = useQuery({
    queryKey: ["admin-catalog-options"],
    queryFn: api.adminCatalogOptions,
  });
  const {
    data: listings = [],
    isLoading: isListingsLoading,
    error: listingsError,
  } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: () => api.adminListings(),
  });
  const { data: addressSeedCities = [] } = useQuery({
    queryKey: ["address-cities-seed"],
    queryFn: () => api.addressCities("", 20),
  });

  const [form, setForm] = useState<ListingFormState>(emptyListingForm);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    categoryId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(
    null,
  );

  const leafCategories = useMemo(
    () => buildLeafCategories(options.categories as CategoryOption[]),
    [options.categories],
  );

  useEffect(() => {
    if (initialCreateOpen) {
      setForm(emptyListingForm);
      setFeedback(null);
      setIsModalOpen(true);
    }
  }, [initialCreateOpen]);

  const createMutation = useMutation({
    mutationFn: api.createAdminListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      setForm(emptyListingForm);
      setFeedback({ type: "success", message: "הפריט נוצר בהצלחה." });
      setIsModalOpen(false);
      router.replace(pathname);
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "הפעולה נכשלה. נסו שוב.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => api.updateAdminListing(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      setForm(emptyListingForm);
      setFeedback({ type: "success", message: "הפריט עודכן בהצלחה." });
      setIsModalOpen(false);
      router.replace(pathname);
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "הפעולה נכשלה. נסו שוב.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteAdminListing,
    onMutate: (id: string) => {
      setDeletingListingId(id);
      setFeedback(null);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      setFeedback({ type: "success", message: "הפריט נמחק בהצלחה" });
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "מחיקת הפריט נכשלה",
      });
    },
    onSettled: () => {
      setDeletingListingId(null);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: api.duplicateAdminListing,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      setFeedback({ type: "success", message: "הפריט שוכפל בהצלחה." });
    },
    onError: (error) => {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "שכפול הפריט נכשל.",
      });
    },
  });

  const visibleItems = useMemo(
    () =>
      listings.filter((item: any) => {
        if (filters.status && item.status !== filters.status) return false;
        if (filters.categoryId && item.categoryId !== filters.categoryId) {
          return false;
        }
        if (!filters.search) return true;

        const value =
          `${item.titleHe ?? ""} ${item.descriptionHe ?? ""} ${item.city ?? ""}`.toLowerCase();
        return value.includes(filters.search.toLowerCase());
      }),
    [filters, listings],
  );

  const counts = useMemo(
    () => ({
      active: listings.filter((item: any) => item.status === "ACTIVE").length,
      pending: listings.filter((item: any) => item.status === "PENDING_REVIEW")
        .length,
      blocked: listings.filter((item: any) => item.status === "BLOCKED").length,
    }),
    [listings],
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyListingForm);
    setFeedback(null);
    router.replace(pathname);
  };

  const updateForm = <K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const startEdit = (item: any) => {
    setFeedback(null);
    setForm({
      id: item.id,
      status: (item.status ?? "ACTIVE") as ListingStatus,
      lenderId: item.lenderId ?? "",
      categoryId: item.categoryId ?? "",
      titleHe: item.titleHe ?? "",
      descriptionHe: item.descriptionHe ?? "",
      cityId: item.cityId ?? item.cityRef?.id ?? "",
      cityNameHe: item.cityRef?.nameHe ?? item.city ?? "",
      streetId: item.streetId ?? item.streetRef?.id ?? "",
      streetNameHe: item.streetRef?.nameHe ?? "",
      addressNumber:
        item.addressNumber !== undefined && item.addressNumber !== null
          ? String(item.addressNumber)
          : "",
      basePriceDaily: String(Number(item.basePriceDaily ?? 0)),
      depositAmount: String(Number(item.depositAmount ?? 0)),
      inventoryCount: String(Number(item.inventoryCount ?? 1)),
      minRentalDays: String(Number(item.minRentalDays ?? 1)),
      maxRentalDays: String(Number(item.maxRentalDays ?? 30)),
      deliverySupported: Boolean(item.deliverySupported),
      requiresOperator: Boolean(item.requiresOperator),
      setupRequired: Boolean(item.setupRequired),
      pickupInstructions: item.pickupInstructions ?? "",
      cancellationPolicy: item.cancellationPolicy ?? "",
      returnTerms: item.returnTerms ?? "",
      includedItemsText: Array.isArray(item.includedItems)
        ? item.includedItems.join("\n")
        : "",
      imageUrlsText: Array.isArray(item.media)
        ? item.media
            .map((media: { url?: string }) => media.url?.trim() ?? "")
            .filter(Boolean)
            .join("\n")
        : "",
      availabilityBlocks:
        Array.isArray(item.availabilityBlocks) && item.availabilityBlocks.length > 0
          ? item.availabilityBlocks.map((block: any) => ({
              id: createRowId(),
              startDate: String(block.startDate ?? "").slice(0, 10),
              endDate: String(block.endDate ?? "").slice(0, 10),
              status: (block.status ?? "BLOCKED") as AvailabilityStatus,
              reason: block.reason ?? "",
            }))
          : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    const confirmed = window.confirm(
      "האם למחוק את הפריט? פעולה זו לא ניתנת לביטול.",
    );
    if (!confirmed) return;
    deleteMutation.mutate(item.id);
  };

  const handleDuplicate = (item: any) => {
    duplicateMutation.mutate(item.id);
  };

  const handleToggleStatus = (item: any) => {
    updateMutation.mutate({
      id: item.id,
      payload: {
        status: item.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
      },
    });
  };

  const setAvailabilityRow = (
    index: number,
    key: keyof AvailabilityRow,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      availabilityBlocks: current.availabilityBlocks.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    }));
  };

  const addAvailabilityRow = () => {
    setForm((current) => ({
      ...current,
      availabilityBlocks: [
        ...current.availabilityBlocks,
        createEmptyAvailabilityRow(),
      ],
    }));
  };

  const removeAvailabilityRow = (index: number) => {
    setForm((current) => ({
      ...current,
      availabilityBlocks: current.availabilityBlocks.filter(
        (_, rowIndex) => rowIndex !== index,
      ),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    if (!form.lenderId) {
      setFeedback({ type: "error", message: "יש לבחור מלווה" });
      return;
    }
    if (!form.categoryId) {
      setFeedback({ type: "error", message: "יש לבחור קטגוריה" });
      return;
    }
    if (!form.titleHe.trim()) {
      setFeedback({ type: "error", message: "יש להזין כותרת" });
      return;
    }
    if (!form.basePriceDaily.trim()) {
      setFeedback({ type: "error", message: "יש להזין מחיר ליום" });
      return;
    }

    if (!form.lenderId) {
      setFeedback({ type: "error", message: "יש לבחור מלווה עבור הפריט." });
      return;
    }
    if (!form.categoryId) {
      setFeedback({ type: "error", message: "יש לבחור קטגוריית משנה." });
      return;
    }
    if (form.titleHe.trim().length < 2) {
      setFeedback({ type: "error", message: "יש להזין כותרת בעברית." });
      return;
    }
    if (form.descriptionHe.trim().length < 10) {
      setFeedback({ type: "error", message: "יש להזין תיאור מלא בעברית." });
      return;
    }

    const basePriceDaily = Number(form.basePriceDaily);
    const depositAmount = Number(form.depositAmount);
    const inventoryCount = Number(form.inventoryCount);
    const minRentalDays = Number(form.minRentalDays);
    const maxRentalDays = Number(form.maxRentalDays);
    const addressNumber = Number(form.addressNumber);
    if (!Number.isFinite(basePriceDaily) || basePriceDaily <= 0) {
      setFeedback({ type: "error", message: "מחיר ליום חייב להיות גדול מ-0" });
      return;
    }

    if (!Number.isFinite(basePriceDaily) || basePriceDaily <= 0) {
      setFeedback({ type: "error", message: "מחיר ליום חייב להיות גדול מאפס." });
      return;
    }
    if (!Number.isFinite(depositAmount) || depositAmount < 0) {
      setFeedback({ type: "error", message: "פיקדון חייב להיות אפס או יותר." });
      return;
    }
    if (!Number.isInteger(inventoryCount) || inventoryCount < 1) {
      setFeedback({ type: "error", message: "כמות במלאי חייבת להיות 1 או יותר." });
      return;
    }
    if (!Number.isInteger(minRentalDays) || minRentalDays < 1) {
      setFeedback({
        type: "error",
        message: "מינימום ימי השכרה חייב להיות 1 או יותר.",
      });
      return;
    }
    if (!Number.isInteger(maxRentalDays) || maxRentalDays < minRentalDays) {
      setFeedback({
        type: "error",
        message: "מקסימום ימי השכרה חייב להיות גדול או שווה למינימום.",
      });
      return;
    }

    if (addressSeedCities.length === 0) {
      setFeedback({
        type: "error",
        message: "מאגר הערים והרחובות לא נטען. הרץ npm run db:import:addresses.",
      });
      return;
    }
    if (!form.cityId || !form.streetId) {
      setFeedback({
        type: "error",
        message: "יש לבחור עיר ורחוב מתוך מאגר הכתובות.",
      });
      return;
    }
    if (!Number.isInteger(addressNumber) || addressNumber < 1) {
      setFeedback({
        type: "error",
        message: "מספר בית חייב להיות מספר שלם וחיובי.",
      });
      return;
    }

    const invalidAvailability = form.availabilityBlocks.find((block) => {
      if (!block.startDate && !block.endDate && !block.reason) return false;
      if (!block.startDate || !block.endDate) return true;
      return block.endDate < block.startDate;
    });

    if (invalidAvailability) {
      setFeedback({
        type: "error",
        message: "יש להזין טווחי זמינות תקינים עם תאריך התחלה וסיום.",
      });
      return;
    }

    const payload = {
      lenderId: form.lenderId,
      categoryId: form.categoryId,
      titleHe: form.titleHe.trim(),
      titleEn: form.titleHe.trim(),
      descriptionHe: form.descriptionHe.trim(),
      descriptionEn: form.descriptionHe.trim(),
      status: form.status,
      basePriceDaily,
      depositAmount,
      cityId: form.cityId,
      streetId: form.streetId,
      addressNumber,
      pickupInstructions: form.pickupInstructions.trim() || undefined,
      deliverySupported: form.deliverySupported,
      includedItems: parseMultilineList(form.includedItemsText),
      cancellationPolicy: form.cancellationPolicy.trim() || undefined,
      returnTerms: form.returnTerms.trim() || undefined,
      requiresOperator: form.requiresOperator,
      setupRequired: form.setupRequired,
      inventoryCount,
      minRentalDays,
      maxRentalDays,
      availabilityBlocks: form.availabilityBlocks
        .filter((block) => block.startDate && block.endDate)
        .map((block) => ({
          startDate: block.startDate,
          endDate: block.endDate,
          status: block.status,
          quantity: 1,
          reason: block.reason.trim() || undefined,
        })),
      imageUrls: parseMultilineList(form.imageUrlsText),
    };

    if (form.id) {
      updateMutation.mutate({ id: form.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-slate-500">פריטים פעילים</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {counts.active}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">ממתינים לבדיקה</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {counts.pending}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">פריטים חסומים</div>
          <div className="mt-2 text-3xl font-semibold text-slate-950">
            {counts.blocked}
          </div>
        </Card>
      </div>

      {feedback ? (
        <div
          className={[
            "rounded-2xl border px-4 py-3 text-sm",
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800",
          ].join(" ")}
        >
          {feedback.message}
        </div>
      ) : null}

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="min-w-56 flex-1 rounded-2xl border px-4 py-3 text-right"
            dir="rtl"
            placeholder="חיפוש לפי כותרת, תיאור או עיר"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
          />
          <select
            className="rounded-2xl border px-4 py-3 text-right"
            dir="rtl"
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
          >
            <option value="">כל הסטטוסים</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="rounded-2xl border px-4 py-3 text-right"
            dir="rtl"
            value={filters.categoryId}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                categoryId: event.target.value,
              }))
            }
          >
            <option value="">כל הקטגוריות</option>
            {leafCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.labelHe}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          {listingsError ? (
            <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              לא ניתן לטעון את הפריטים.
            </div>
          ) : null}
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-right">פריט</th>
                <th className="px-4 py-3 text-right">קטגוריה</th>
                <th className="px-4 py-3 text-right">מלווה</th>
                <th className="px-4 py-3 text-right">עיר</th>
                <th className="px-4 py-3 text-right">מחיר ליום</th>
                <th className="px-4 py-3 text-right">סטטוס</th>
                <th className="px-4 py-3 text-right">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {!isListingsLoading && visibleItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border-t px-4 py-12 text-center text-base text-slate-500"
                  >
                    אין עדיין פריטים במערכת
                  </td>
                </tr>
              ) : (
                visibleItems.map((item: any) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {item.titleHe}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.descriptionHe}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.category?.nameHe ??
                        leafCategories.find(
                          (category) => category.id === item.categoryId,
                        )?.labelHe ??
                        "לא משויך"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.lender?.displayName ??
                        (options.lenders as LenderOption[]).find(
                          (lender) => lender.userId === item.lenderId,
                        )?.displayName ??
                        "לא משויך"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.city ?? item.pickupAddressText ?? "לא צוין"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatCurrency(item.basePriceDaily)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {statusLabels[
                        (item.status ?? "ACTIVE") as ListingStatus
                      ] ?? item.status}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={deletingListingId === item.id}
                          onClick={() => startEdit(item)}
                        >
                          עריכה
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={duplicateMutation.isPending}
                          onClick={() => handleDuplicate(item)}
                        >
                          שכפל פריט
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleToggleStatus(item)}
                        >
                          {item.status === "ACTIVE" ? "השבתה" : "הפעלה"}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50"
                          disabled={deletingListingId === item.id}
                          onClick={() => handleDelete(item)}
                        >
                          {deletingListingId === item.id ? "מוחק..." : "מחיקה"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
            dir="rtl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  {form.id ? "עריכת פריט" : "יצירת פריט חדש"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  הטופס שומר פריט מלא עבור ניהול אדמין ואופטימיזציית חבילות.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                onClick={closeModal}
                aria-label="סגירת חלון יצירת פריט"
              >
                סגירה
              </button>
            </div>

            {feedback?.type === "error" ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {feedback.message}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Section title="פרטים בסיסיים">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">מלווה</span>
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.lenderId}
                    onChange={(event) =>
                      updateForm("lenderId", event.target.value)
                    }
                  >
                    <option value="">בחרו מלווה</option>
                    {(options.lenders as LenderOption[]).map((lender) => (
                      <option key={lender.userId} value={lender.userId}>
                        {lender.displayName || lender.user?.fullName || "ללא שם"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">קטגוריה</span>
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.categoryId}
                    onChange={(event) =>
                      updateForm("categoryId", event.target.value)
                    }
                  >
                    <option value="">בחרו קטגוריית משנה</option>
                    {leafCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.labelHe}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    כותרת בעברית
                  </span>
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.titleHe}
                    onChange={(event) => updateForm("titleHe", event.target.value)}
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    תיאור בעברית
                  </span>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.descriptionHe}
                    onChange={(event) =>
                      updateForm("descriptionHe", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">סטטוס</span>
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as ListingStatus)
                    }
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>


                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">מחיר ליום</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.basePriceDaily}
                    onChange={(event) =>
                      updateForm("basePriceDaily", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">פיקדון</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.depositAmount}
                    onChange={(event) =>
                      updateForm("depositAmount", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">כמות במלאי</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.inventoryCount}
                    onChange={(event) =>
                      updateForm("inventoryCount", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    פריטים כלולים
                  </span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    placeholder="כל פריט בשורה נפרדת או מופרד בפסיקים"
                    value={form.includedItemsText}
                    onChange={(event) =>
                      updateForm("includedItemsText", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    כתובות תמונה
                  </span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border px-4 py-3 text-left"
                    dir="ltr"
                    placeholder="https://example.com/image-1.jpg"
                    value={form.imageUrlsText}
                    onChange={(event) =>
                      updateForm("imageUrlsText", event.target.value)
                    }
                  />
                </label>
              </Section>

              <Section title="מיקום ואיסוף">
                <AddressSelector
                  value={{
                    cityId: form.cityId,
                    cityNameHe: form.cityNameHe,
                    streetId: form.streetId,
                    streetNameHe: form.streetNameHe,
                    addressNumber: form.addressNumber,
                  }}
                  onChange={(nextValue: AddressSelectionValue) =>
                    setForm((current) => ({
                      ...current,
                      cityId: nextValue.cityId,
                      cityNameHe: nextValue.cityNameHe,
                      streetId: nextValue.streetId,
                      streetNameHe: nextValue.streetNameHe,
                      addressNumber: nextValue.addressNumber,
                    }))
                  }
                />

                <div className="md:col-span-2">
                  <AddressVerifier
                    cityId={form.cityId}
                    streetId={form.streetId}
                    addressNumber={form.addressNumber}
                  />
                </div>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    הוראות איסוף
                  </span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.pickupInstructions}
                    onChange={(event) =>
                      updateForm("pickupInstructions", event.target.value)
                    }
                  />
                </label>
              </Section>

              <Section title="זמינות">
                <div className="md:col-span-2 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    הוסיפו טווחי תאריכים שבהם הפריט חסום, תפוס או בתחזוקה.
                  </p>
                  <Button type="button" variant="secondary" onClick={addAvailabilityRow}>
                    הוספת טווח
                  </Button>
                </div>

                <div className="md:col-span-2 space-y-3">
                  {form.availabilityBlocks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                      לא הוגדרו טווחי חוסר זמינות.
                    </div>
                  ) : (
                    form.availabilityBlocks.map((block, index) => (
                      <div
                        key={block.id}
                        className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-4"
                      >
                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">
                            מתאריך
                          </span>
                          <input
                            type="date"
                            className="w-full rounded-2xl border px-4 py-3"
                            value={block.startDate}
                            onChange={(event) =>
                              setAvailabilityRow(
                                index,
                                "startDate",
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">
                            עד תאריך
                          </span>
                          <input
                            type="date"
                            className="w-full rounded-2xl border px-4 py-3"
                            value={block.endDate}
                            onChange={(event) =>
                              setAvailabilityRow(
                                index,
                                "endDate",
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-slate-700">סוג</span>
                          <select
                            className="w-full rounded-2xl border px-4 py-3 text-right"
                            dir="rtl"
                            value={block.status}
                            onChange={(event) =>
                              setAvailabilityRow(
                                index,
                                "status",
                                event.target.value,
                              )
                            }
                          >
                            {Object.entries(availabilityStatusLabels).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ),
                            )}
                          </select>
                        </label>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-slate-700">פעולה</div>
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => removeAvailabilityRow(index)}
                          >
                            הסרה
                          </Button>
                        </div>

                        <label className="space-y-2 md:col-span-4">
                          <span className="text-sm font-medium text-slate-700">
                            תיוג / סיבה
                          </span>
                          <input
                            className="w-full rounded-2xl border px-4 py-3 text-right"
                            dir="rtl"
                            placeholder="לדוגמה: תפוס / תחזוקה"
                            value={block.reason}
                            onChange={(event) =>
                              setAvailabilityRow(index, "reason", event.target.value)
                            }
                          />
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </Section>

              <Section title="תנאי השכרה">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    מינימום ימי השכרה
                  </span>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.minRentalDays}
                    onChange={(event) =>
                      updateForm("minRentalDays", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    מקסימום ימי השכרה
                  </span>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.maxRentalDays}
                    onChange={(event) =>
                      updateForm("maxRentalDays", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    תנאי ביטול
                  </span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.cancellationPolicy}
                    onChange={(event) =>
                      updateForm("cancellationPolicy", event.target.value)
                    }
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    תנאי החזרה
                  </span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border px-4 py-3 text-right"
                    dir="rtl"
                    value={form.returnTerms}
                    onChange={(event) =>
                      updateForm("returnTerms", event.target.value)
                    }
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.deliverySupported}
                    onChange={(event) =>
                      updateForm("deliverySupported", event.target.checked)
                    }
                  />
                  <span className="text-sm text-slate-700">כולל אפשרות משלוח</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.requiresOperator}
                    onChange={(event) =>
                      updateForm("requiresOperator", event.target.checked)
                    }
                  />
                  <span className="text-sm text-slate-700">דורש מפעיל</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border px-4 py-3 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.setupRequired}
                    onChange={(event) =>
                      updateForm("setupRequired", event.target.checked)
                    }
                  />
                  <span className="text-sm text-slate-700">דורש התקנה</span>
                </label>
              </Section>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? form.id
                      ? "שומר..."
                      : "יוצר..."
                    : form.id
                      ? "שמירת שינויים"
                      : "יצירת פריט"}
                </Button>
                <Button type="button" variant="secondary" onClick={closeModal}>
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Display-only address check. cityId + streetId + addressNumber are the
// source of truth; coordinates are derived server-side, so this component
// only confirms the address resolves — it does not feed coordinates back
// into the form.
function AddressVerifier({
  cityId,
  streetId,
  addressNumber,
}: {
  cityId: string;
  streetId: string;
  addressNumber: string;
}) {
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success"; addressText: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const canCheck =
    Boolean(cityId) &&
    Boolean(streetId) &&
    Number.isInteger(Number(addressNumber)) &&
    Number(addressNumber) >= 1;

  async function handleCheck() {
    setStatus({ kind: "loading" });
    try {
      const response = await api.geocodeAddress({
        cityId,
        streetId,
        addressNumber: Number(addressNumber),
      });
      setStatus({ kind: "success", addressText: response.data.addressText });
    } catch {
      setStatus({ kind: "error", message: "לא ניתן לאמת את הכתובת" });
    }
  }

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/40 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">
          אימות קואורדינטות לפי הכתובת
        </span>
        <button
          type="button"
          onClick={handleCheck}
          disabled={!canCheck || status.kind === "loading"}
          className="rounded-full border border-cyan-600 bg-white px-3 py-1 text-xs font-semibold text-cyan-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          {status.kind === "loading" ? "בודק..." : "בדוק כתובת"}
        </button>
      </div>
      {status.kind === "success" ? (
        <p className="text-xs text-emerald-700">
          הכתובת אומתה בהצלחה — {status.addressText}
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p className="text-xs text-rose-700">{status.message}</p>
      ) : null}
    </div>
  );
}
