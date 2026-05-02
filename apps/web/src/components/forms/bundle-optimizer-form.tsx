"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button, Card } from "@rental/ui";
import { api } from "../../lib/api";
import {
  AddressSelector,
  type AddressSelectionValue,
} from "./address-selector";

type ConditionLevel = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "HEAVY_USE";

const CONDITION_OPTIONS: { value: ConditionLevel; label: string }[] = [
  { value: "NEW", label: "חדש" },
  { value: "LIKE_NEW", label: "כמו חדש" },
  { value: "GOOD", label: "טוב" },
  { value: "FAIR", label: "סביר" },
  { value: "HEAVY_USE", label: "שימוש כבד" },
];

type ProfileKey = "balanced" | "cheapest" | "closest" | "mostReliable" | "highQuality";

export const RANKING_PROFILES: Record<
  ProfileKey,
  {
    label: string;
    weights: {
      price: number;
      distance: number;
      reliability: number;
      condition: number;
      availability: number;
    };
  }
> = {
  balanced: {
    label: "מאוזן",
    weights: { price: 0.2, distance: 0.2, reliability: 0.2, condition: 0.2, availability: 0.2 },
  },
  cheapest: {
    label: "הכי זול",
    weights: { price: 0.4, distance: 0.15, reliability: 0.15, condition: 0.15, availability: 0.15 },
  },
  closest: {
    label: "הכי קרוב",
    weights: { price: 0.15, distance: 0.4, reliability: 0.15, condition: 0.15, availability: 0.15 },
  },
  mostReliable: {
    label: "הכי אמין",
    weights: { price: 0.15, distance: 0.15, reliability: 0.4, condition: 0.2, availability: 0.1 },
  },
  highQuality: {
    label: "איכות גבוהה",
    weights: { price: 0.1, distance: 0.15, reliability: 0.2, condition: 0.4, availability: 0.15 },
  },
};

type SpecificListingPick = {
  id: string;
  titleHe: string;
  categoryId: string;
  categoryNameHe?: string;
  basePriceDaily?: number | string;
  lenderName?: string | null;
};

type SlotConstraints = {
  minPrice?: number;
  maxPrice?: number;
  minCondition?: ConditionLevel;
  maxDistanceKm?: number;
  allowAlternatives?: boolean;
};

type SlotState = {
  uiId: string;
  mode: "category" | "specificListing";
  parentCategoryId?: string;
  categoryId?: string;
  specific?: SpecificListingPick;
  quantity: number;
  constraints: SlotConstraints;
};

type CategoryNode = {
  id: string;
  nameHe: string;
  nameEn?: string;
  children?: CategoryNode[];
};

type OptimizerRequestBody = ReturnType<typeof buildOptimizerRequest>;

type OptimizerResponse = {
  success: boolean;
  data: {
    requestSummary?: OptimizerRequestBody;
    algorithm?: { name: string; method: string; complexity: string; formula?: string };
    bundles: Array<{
      label: string;
      score: number;
      totalPrice: number;
      budget: number;
      pickupPointCount: number;
      metrics: Record<string, number>;
      scoreBreakdown: Record<string, number>;
      derived?: {
        avgDistance: number;
        maxDistance: number;
        pickupCost: number;
        pickupStops: number;
        deviationDaysSum: number;
      };
      explanations: string[];
      tradeoffs: string[];
      includedItems: Array<{
        slotKey: string;
        listingId: string;
        titleHe: string;
        condition: string;
        price: number;
        distanceKm: number;
      }>;
    }>;
    messageHe?: string;
    suggestions?: string[];
    debug?: Record<string, unknown>;
  };
};

type ValidationState = {
  global?: string;
  slotErrors: Record<string, string[]>;
};

const emptyAddressSelection: AddressSelectionValue = {
  cityId: "",
  cityNameHe: "",
  streetId: "",
  streetNameHe: "",
  addressNumber: "",
};

let slotCounter = 0;
const newSlot = (mode: SlotState["mode"] = "category"): SlotState => {
  slotCounter += 1;
  return {
    uiId: `slot-${slotCounter}`,
    mode,
    quantity: 1,
    constraints: {},
  };
};

export function BundleOptimizerForm() {
  const today = new Date().toISOString().slice(0, 10);
  const inThree = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(inThree);
  const [addressSelection, setAddressSelection] = useState<AddressSelectionValue>(
    emptyAddressSelection,
  );
  const [budget, setBudget] = useState(1500);
  const [maxPickupPoints, setMaxPickupPoints] = useState<number | "">(3);
  const [profile, setProfile] = useState<ProfileKey>("balanced");
  const [slots, setSlots] = useState<SlotState[]>(() => [newSlot("category")]);
  const [validation, setValidation] = useState<ValidationState>({ slotErrors: {} });
  const [result, setResult] = useState<OptimizerResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<OptimizerRequestBody | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.categories() as Promise<CategoryNode[]>,
  });
  const parentCategories = categoriesQuery.data ?? [];

  const mutation = useMutation({
    mutationFn: (body: OptimizerRequestBody) => api.optimizeBundle(body),
    onSuccess: (response) => setResult(response as OptimizerResponse),
  });

  function onSubmit() {
    const nextValidation = validateForm({
      slots,
      startDate,
      endDate,
      budget,
      addressSelection,
    });
    setValidation(nextValidation);
    if (nextValidation.global || Object.keys(nextValidation.slotErrors).length > 0) return;

    const body = buildOptimizerRequest({
      slots,
      startDate,
      endDate,
      addressSelection,
      budget,
      maxPickupPoints: typeof maxPickupPoints === "number" ? maxPickupPoints : undefined,
      profile,
    });
    setLastRequest(body);
    mutation.mutate(body);
  }

  const updateSlot = (uiId: string, patch: Partial<SlotState>) =>
    setSlots((prev) => prev.map((s) => (s.uiId === uiId ? { ...s, ...patch } : s)));
  const removeSlot = (uiId: string) => setSlots((prev) => prev.filter((s) => s.uiId !== uiId));
  const addSlot = () => setSlots((prev) => [...prev, newSlot("category")]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]" dir="rtl">
      <Card className="space-y-6 p-6 md:p-7">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">בקשת חבילה - בניית דרישות</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            הוסיפו פריטים לפי קטגוריה או לפי מוצר ספציפי. המערכת תסנן מועמדים לפי האילוצים,
            תבצע חיפוש קרן, ותדרג חבילות לפי פרופיל הדירוג שבחרתם.
          </p>
        </div>

        <section className="space-y-3 rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700">אילוצים גלובליים</h3>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="תאריך התחלה">
              <input className="form-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Field>
            <Field label="תאריך סיום">
              <input className="form-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Field>
          </div>

          <Field label="כתובת איסוף">
            <input
              className="form-input"
              value={buildRequestedAddress(addressSelection)}
              readOnly
              placeholder="לדוגמה: תל אביב, ישראל"
            />
            <div className="mt-3">
              <AddressSelector
                value={addressSelection}
                onChange={setAddressSelection}
                previewLabel="כתובת שנבחרה"
              />
            </div>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              המיקום משמש לחישוב מרחק מהמשכירים.
            </p>
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="תקציב מקסימלי (₪)">
              <input
                className="form-input"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
              />
            </Field>
            <Field label="מקסימום נקודות איסוף">
              <input
                className="form-input"
                type="number"
                min={1}
                value={maxPickupPoints === "" ? "" : maxPickupPoints}
                onChange={(e) =>
                  setMaxPickupPoints(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10) || 1))
                }
              />
            </Field>
          </div>

          <Field label="פרופיל דירוג">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(RANKING_PROFILES) as ProfileKey[]).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setProfile(key)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    profile === key
                      ? "border-cyan-600 bg-cyan-50 text-cyan-800"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {RANKING_PROFILES[key].label}
                </button>
              ))}
            </div>
          </Field>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-700">מה תרצו לשכור?</h3>
            <button
              type="button"
              onClick={addSlot}
              className="rounded-md border border-cyan-600 bg-white px-3 py-1 text-xs font-semibold text-cyan-700"
            >
              + הוסף פריט לחבילה
            </button>
          </div>

          {slots.length === 0 && (
            <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
              עדיין לא הוספתם פריטים. לחצו על הוסף פריט לחבילה כדי להתחיל.
            </p>
          )}

          {slots.map((slot, idx) => (
            <SlotCard
              key={slot.uiId}
              index={idx + 1}
              slot={slot}
              parentCategories={parentCategories}
              errors={validation.slotErrors[slot.uiId] ?? []}
              onPatch={(patch) => updateSlot(slot.uiId, patch)}
              onRemove={() => removeSlot(slot.uiId)}
              loadingCategories={categoriesQuery.isLoading}
            />
          ))}
        </section>

        {validation.global && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{validation.global}</p>
        )}

        <Button onClick={onSubmit} disabled={mutation.isPending} className="w-full py-3">
          {mutation.isPending ? "מחפש חבילות מתאימות..." : "חפש חבילות מתאימות"}
        </Button>

        {mutation.isError && (
          <p className="text-sm text-rose-600">שגיאה בקריאה לשרת. ודאו שה-API רץ על פורט 4000.</p>
        )}
      </Card>

      <ResultsPanel result={result} isPending={mutation.isPending} slots={slots} lastRequest={lastRequest} />
    </div>
  );
}

function SlotCard({
  index,
  slot,
  parentCategories,
  errors,
  onPatch,
  onRemove,
  loadingCategories,
}: {
  index: number;
  slot: SlotState;
  parentCategories: CategoryNode[];
  errors: string[];
  onPatch: (patch: Partial<SlotState>) => void;
  onRemove: () => void;
  loadingCategories: boolean;
}) {
  const parent = parentCategories.find((c) => c.id === slot.parentCategoryId);
  const subcategories = useMemo(() => parent?.children ?? [], [parent]);
  const selectedCategory = subcategories.find((c) => c.id === slot.categoryId);

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">פריט {index}</div>
        <button type="button" onClick={onRemove} className="text-xs text-rose-600 hover:underline">
          הסר
        </button>
      </div>

      <div className="flex gap-2 text-xs">
        <ModeButton active={slot.mode === "category"} onClick={() => onPatch({ mode: "category", specific: undefined })}>
          לפי קטגוריה
        </ModeButton>
        <ModeButton
          active={slot.mode === "specificListing"}
          onClick={() => onPatch({ mode: "specificListing", parentCategoryId: undefined, categoryId: undefined })}
        >
          מוצר ספציפי
        </ModeButton>
      </div>

      {slot.mode === "category" ? (
        <CategoryModeFields
          slot={slot}
          parentCategories={parentCategories}
          subcategories={subcategories}
          selectedParent={parent}
          selectedCategory={selectedCategory}
          loadingCategories={loadingCategories}
          onPatch={onPatch}
        />
      ) : (
        <SpecificListingModeFields slot={slot} onPatch={onPatch} />
      )}

      <div className="grid gap-3 border-t border-slate-200 pt-3 md:grid-cols-3">
        <Field label="כמות">
          <input
            type="number"
            min={1}
            className="form-input"
            value={slot.quantity}
            onChange={(e) => onPatch({ quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
          />
        </Field>
        <Field label="מרחק מקסימלי (ק״מ)">
          <input
            type="number"
            min={0}
            className="form-input"
            value={slot.constraints.maxDistanceKm ?? ""}
            onChange={(e) =>
              onPatch({
                constraints: {
                  ...slot.constraints,
                  maxDistanceKm: e.target.value === "" ? undefined : parseFloat(e.target.value),
                },
              })
            }
          />
        </Field>
        <Field label="מצב מינימלי">
          <select
            className="form-input"
            value={slot.constraints.minCondition ?? ""}
            onChange={(e) =>
              onPatch({
                constraints: {
                  ...slot.constraints,
                  minCondition: (e.target.value as ConditionLevel) || undefined,
                },
              })
            }
          >
            <option value="">ללא דרישה</option>
            {CONDITION_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {slot.mode === "category" && (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="מחיר מינימלי (₪)">
            <input
              type="number"
              min={0}
              className="form-input"
              value={slot.constraints.minPrice ?? ""}
              onChange={(e) =>
                onPatch({
                  constraints: {
                    ...slot.constraints,
                    minPrice: e.target.value === "" ? undefined : parseFloat(e.target.value),
                  },
                })
              }
            />
          </Field>
          <Field label="מחיר מקסימלי (₪)">
            <input
              type="number"
              min={0}
              className="form-input"
              value={slot.constraints.maxPrice ?? ""}
              onChange={(e) =>
                onPatch({
                  constraints: {
                    ...slot.constraints,
                    maxPrice: e.target.value === "" ? undefined : parseFloat(e.target.value),
                  },
                })
              }
            />
          </Field>
        </div>
      )}

      {slot.mode === "specificListing" && (
        <label className="flex items-center gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={slot.constraints.allowAlternatives === true}
            onChange={(e) =>
              onPatch({
                constraints: { ...slot.constraints, allowAlternatives: e.target.checked },
              })
            }
          />
          אפשר חלופות מאותה קטגוריה אם המוצר לא זמין
        </label>
      )}

      {errors.length > 0 && (
        <ul className="space-y-1 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1 ${
        active ? "border-cyan-600 bg-cyan-50 text-cyan-800" : "border-slate-300 bg-white text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function CategoryModeFields({
  slot,
  parentCategories,
  subcategories,
  selectedParent,
  selectedCategory,
  loadingCategories,
  onPatch,
}: {
  slot: SlotState;
  parentCategories: CategoryNode[];
  subcategories: CategoryNode[];
  selectedParent?: CategoryNode;
  selectedCategory?: CategoryNode;
  loadingCategories: boolean;
  onPatch: (patch: Partial<SlotState>) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="קטגוריית-על">
          <select
            className="form-input"
            value={slot.parentCategoryId ?? ""}
            onChange={(e) => onPatch({ parentCategoryId: e.target.value || undefined, categoryId: undefined })}
            disabled={loadingCategories}
          >
            <option value="">בחרו קטגוריה</option>
            {parentCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameHe}
              </option>
            ))}
          </select>
        </Field>
        <Field label="תת-קטגוריה">
          <select
            className="form-input"
            value={slot.categoryId ?? ""}
            onChange={(e) => onPatch({ categoryId: e.target.value || undefined })}
            disabled={!slot.parentCategoryId}
          >
            <option value="">
              {slot.parentCategoryId ? "בחרו תת-קטגוריה" : "בחרו קודם קטגוריית-על"}
            </option>
            {subcategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameHe}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {(selectedParent || selectedCategory) && (
        <p className="text-xs text-slate-600">
          בחירה נוכחית: {[selectedParent?.nameHe, selectedCategory?.nameHe].filter(Boolean).join(" / ")}
        </p>
      )}
    </div>
  );
}

function SpecificListingModeFields({ slot, onPatch }: { slot: SlotState; onPatch: (patch: Partial<SlotState>) => void }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const search = useQuery({
    queryKey: ["listings-search", debounced],
    queryFn: () => api.searchListings(debounced, 10),
    enabled: !slot.specific && debounced.length > 0,
  });

  if (slot.specific) {
    return (
      <div className="rounded-md border border-cyan-200 bg-cyan-50 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">{slot.specific.titleHe}</div>
            <div className="text-xs text-slate-600">
              {slot.specific.categoryNameHe ?? "קטגוריה"}
              {slot.specific.lenderName ? ` · ${slot.specific.lenderName}` : ""}
              {slot.specific.basePriceDaily !== undefined ? ` · ₪${Number(slot.specific.basePriceDaily)} ליום` : ""}
            </div>
          </div>
          <button
            type="button"
            className="text-xs text-rose-600 hover:underline"
            onClick={() => {
              onPatch({ specific: undefined });
              setQuery("");
            }}
          >
            נקה בחירה
          </button>
        </div>
      </div>
    );
  }

  const items = search.data ?? [];
  const showEmpty = !search.isLoading && debounced.length > 0 && items.length === 0;

  return (
    <div className="space-y-2">
      <Field label="חיפוש מוצר">
        <input className="form-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="הקלידו שם מוצר..." />
      </Field>
      {search.isLoading && debounced.length > 0 && <p className="text-xs text-slate-500">טוען...</p>}
      {showEmpty && (
        <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500">
          אין עדיין מוצרים זמינים לבחירה
        </p>
      )}
      {items.length > 0 && (
        <ul className="max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white text-sm">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-right hover:bg-cyan-50"
                onClick={() =>
                  onPatch({
                    specific: {
                      id: it.id,
                      titleHe: it.titleHe,
                      categoryId: it.categoryId,
                      categoryNameHe: it.category?.nameHe,
                      basePriceDaily: it.basePriceDaily,
                      lenderName: it.lenderName,
                    },
                  })
                }
              >
                <span className="font-medium text-slate-900">{it.titleHe}</span>
                <span className="text-xs text-slate-500">
                  {it.category?.nameHe ?? ""}
                  {it.basePriceDaily !== undefined ? ` · ₪${Number(it.basePriceDaily)}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function buildRequestedAddress(addressSelection: AddressSelectionValue) {
  const parts: string[] = [];
  if (addressSelection.streetNameHe.trim()) {
    parts.push(`רחוב ${addressSelection.streetNameHe.trim()}`);
  }
  if (addressSelection.addressNumber.trim()) {
    parts.push(addressSelection.addressNumber.trim());
  }
  const streetPart = parts.join(" ");
  if (streetPart && addressSelection.cityNameHe.trim()) {
    return `${streetPart}, ${addressSelection.cityNameHe.trim()}`;
  }
  if (streetPart) return streetPart;
  return addressSelection.cityNameHe.trim();
}

function validateForm(args: {
  slots: SlotState[];
  startDate: string;
  endDate: string;
  budget: number;
  addressSelection: AddressSelectionValue;
}): ValidationState {
  const slotErrors: Record<string, string[]> = {};
  let global: string | undefined;

  if (!args.startDate || !args.endDate) global = "יש לבחור טווח תאריכים";
  else if (new Date(args.endDate) <= new Date(args.startDate)) {
    global = "תאריך הסיום חייב להיות אחרי תאריך ההתחלה";
  } else if (!args.budget || args.budget <= 0) {
    global = "יש להזין תקציב חוקי";
  } else if (
    !args.addressSelection.cityId ||
    !args.addressSelection.streetId ||
    !Number.isInteger(Number(args.addressSelection.addressNumber)) ||
    Number(args.addressSelection.addressNumber) < 1
  ) {
    global = "יש לבחור עיר, רחוב ומספר בית תקינים.";
  } else if (args.slots.length === 0) {
    global = "יש להוסיף לפחות פריט אחד לחבילה";
  }

  for (const slot of args.slots) {
    const errors: string[] = [];
    if (slot.mode === "category" && !slot.categoryId) errors.push("יש לבחור קטגוריה ותת-קטגוריה");
    if (slot.mode === "specificListing" && !slot.specific) errors.push("יש לבחור מוצר ספציפי");
    if (slot.constraints.minPrice !== undefined && slot.constraints.maxPrice !== undefined && slot.constraints.maxPrice < slot.constraints.minPrice) {
      errors.push("מחיר מקסימלי חייב להיות גדול או שווה למחיר מינימלי");
    }
    if (errors.length > 0) slotErrors[slot.uiId] = errors;
  }

  return { global, slotErrors };
}

export function buildOptimizerRequest(args: {
  slots: SlotState[];
  startDate: string;
  endDate: string;
  addressSelection: AddressSelectionValue;
  budget: number;
  maxPickupPoints: number | undefined;
  profile: ProfileKey;
}) {
  const address = buildRequestedAddress(args.addressSelection);
  const userLocation = {
    address,
    cityId: args.addressSelection.cityId,
    streetId: args.addressSelection.streetId,
    addressNumber: Number.parseInt(args.addressSelection.addressNumber, 10),
  };
  const weights = RANKING_PROFILES[args.profile].weights;

  const slots = args.slots.map((s, idx) => {
    const slotKey = `slot-${idx + 1}`;
    if (s.mode === "category") {
      return {
        slotKey,
        mode: "category" as const,
        categoryId: s.categoryId!,
        quantity: s.quantity,
        constraints: cleanConstraints(s.constraints),
      };
    }
    return {
      slotKey,
      mode: "specificListing" as const,
      specificListingId: s.specific!.id,
      quantity: s.quantity,
      constraints: cleanConstraints(s.constraints),
    };
  });

  return {
    slots,
    dateRange: { startDate: args.startDate, endDate: args.endDate },
    userLocation,
    budget: args.budget,
    preferences: {
      weights,
      lambdaVariance: 0.35,
      alphaBottleneck: 0.25,
      betaPickup: 0.4,
      gammaMaxDistance: 0.15,
      alphaDistanceMix: 0.6,
      topKPerSlot: 30,
      beamWidth: 50,
    },
    ...(args.maxPickupPoints !== undefined ? { maxPickupPoints: args.maxPickupPoints } : {}),
  };
}

function cleanConstraints(c: SlotConstraints) {
  const out: Record<string, unknown> = {};
  if (c.minPrice !== undefined && !Number.isNaN(c.minPrice)) out.minPrice = c.minPrice;
  if (c.maxPrice !== undefined && !Number.isNaN(c.maxPrice)) out.maxPrice = c.maxPrice;
  if (c.minCondition) out.minCondition = c.minCondition;
  if (c.maxDistanceKm !== undefined && !Number.isNaN(c.maxDistanceKm)) out.maxDistanceKm = c.maxDistanceKm;
  if (c.allowAlternatives !== undefined) out.allowAlternatives = c.allowAlternatives;
  return out;
}

function ResultsPanel({
  result,
  isPending,
  slots,
  lastRequest,
}: {
  result: OptimizerResponse | null;
  isPending: boolean;
  slots: SlotState[];
  lastRequest: OptimizerRequestBody | null;
}) {
  if (isPending) {
    return <Card className="p-6 text-sm text-slate-600">מחפש חבילות מתאימות...</Card>;
  }

  if (!result) {
    return (
      <Card className="space-y-2 p-6 text-sm leading-7 text-slate-600">
        <h3 className="text-lg font-semibold text-slate-900">איך זה עובד</h3>
        <p>
          לכל פריט בבקשה המערכת בונה מאגר מועמדים, מסננת לפי אילוצים קשיחים, ומחזירה חבילות
          מדורגות עם פירוט ציונים והסברים.
        </p>
      </Card>
    );
  }

  const data = result.data;
  const bundles = data.bundles;

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-5">
        <div className="text-sm font-semibold text-slate-900">נמצאו {bundles.length} חבילות</div>
        <AppliedConstraints request={data.requestSummary ?? lastRequest} />
      </Card>

      {bundles.length === 0 && (
        <EmptyResults messageHe={data.messageHe} suggestions={data.suggestions ?? []} slots={slots} />
      )}

      {data.algorithm && (
        <Card className="space-y-2 bg-slate-950 p-5 text-white" dir="ltr">
          <div className="text-xs uppercase tracking-wide text-cyan-300">Algorithm</div>
          <div className="text-sm font-semibold">{data.algorithm.name}</div>
          <div className="text-xs text-slate-300">{data.algorithm.method}</div>
          <div className="text-xs text-slate-400">Complexity: {data.algorithm.complexity}</div>
          {data.algorithm.formula && (
            <pre className="mt-2 overflow-x-auto rounded bg-slate-800 p-3 text-[11px] text-slate-100">
              {data.algorithm.formula}
            </pre>
          )}
        </Card>
      )}

      {bundles.map((bundle, idx) => (
        <BundleCard key={idx} bundle={bundle} />
      ))}
    </div>
  );
}

function AppliedConstraints({ request }: { request: OptimizerRequestBody | null | undefined }) {
  if (!request) return null;
  const constraints = [
    `תקציב עד ₪${request.budget}`,
    request.maxPickupPoints ? `עד ${request.maxPickupPoints} נקודות איסוף` : undefined,
    `תאריכים: ${request.dateRange.startDate} עד ${request.dateRange.endDate}`,
    `פריטים: ${request.slots.length}`,
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {constraints.map((item) => (
        <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
          {item}
        </span>
      ))}
    </div>
  );
}

function EmptyResults({ messageHe, suggestions, slots }: { messageHe?: string; suggestions: string[]; slots: SlotState[] }) {
  const slotHints = suggestions.filter((s) => s.includes("סלוט") || s.includes("slot-"));
  const general = suggestions.filter((s) => !slotHints.includes(s));

  return (
    <Card className="space-y-3 p-6">
      <h3 className="text-xl font-semibold text-rose-700">
        {messageHe ?? "לא נמצאה חבילה שעומדת בכל האילוצים"}
      </h3>
      {slotHints.length > 0 && (
        <p className="text-sm font-semibold text-rose-700">לא נמצאו מוצרים זמינים לבניית חבילה</p>
      )}

      {slotHints.length > 0 && (
        <ul className="list-disc space-y-1 pr-5 text-sm text-rose-700">
          {slotHints.map((s) => {
            const m = s.match(/slot-\d+/);
            const slotKey = m?.[0];
            const idx = slotKey ? parseInt(slotKey.replace("slot-", ""), 10) : NaN;
            const slot = !Number.isNaN(idx) ? slots[idx - 1] : undefined;
            const slotLabel = slot
              ? slot.mode === "category"
                ? `פריט ${idx} (קטגוריה)`
                : `פריט ${idx} (${slot.specific?.titleHe ?? "מוצר ספציפי"})`
              : slotKey ?? s;
            return <li key={s}>לא נמצאו מוצרים מתאימים עבור: {slotLabel}</li>;
          })}
        </ul>
      )}

      {general.length > 0 && (
        <>
          <p className="text-sm font-semibold text-slate-700">הצעות:</p>
          <ul className="list-disc space-y-1 pr-5 text-sm text-slate-700">
            {general.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

function BundleCard({ bundle }: { bundle: OptimizerResponse["data"]["bundles"][number] }) {
  return (
    <Card className="space-y-3 p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-950">{bundle.label}</h3>
        <div className="text-2xl font-bold text-emerald-600">{bundle.score.toFixed(2)}</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
        <Stat label="מחיר כולל" value={`₪${bundle.totalPrice}`} />
        <Stat label="תקציב" value={`₪${bundle.budget}`} />
        <Stat label="נקודות איסוף" value={String(bundle.pickupPointCount)} />
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold text-slate-500">מדדים</div>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {Object.entries(bundle.metrics).map(([k, v]) => (
            <Stat key={k} label={metricLabel(k)} value={v.toFixed(2)} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold text-slate-500">פירוט ציון</div>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-7" dir="ltr">
          <Stat label="utility" value={bundle.scoreBreakdown.weightedUtility.toFixed(2)} />
          <Stat label="variance" value={`-${bundle.scoreBreakdown.variancePenalty.toFixed(2)}`} />
          <Stat label="bottleneck" value={`+${bundle.scoreBreakdown.bottleneckTerm.toFixed(2)}`} />
          <Stat label="pickup" value={`-${bundle.scoreBreakdown.pickupPenalty.toFixed(2)}`} />
          <Stat label="max distance" value={`-${(bundle.scoreBreakdown.maxDistancePenalty ?? 0).toFixed(2)}`} />
          <Stat label="low score" value={`-${(bundle.scoreBreakdown.lowScorePenalty ?? 0).toFixed(2)}`} />
          <Stat label="score" value={bundle.scoreBreakdown.finalScore.toFixed(2)} />
        </div>
      </div>

      {bundle.derived && (
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-500">נתונים נגזרים</div>
          <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
            <Stat label="ממוצע מרחק" value={`${bundle.derived.avgDistance.toFixed(1)} ק״מ`} />
            <Stat label="מקסימום מרחק" value={`${bundle.derived.maxDistance.toFixed(1)} ק״מ`} />
            <Stat label="עלות איסוף" value={`${bundle.derived.pickupCost.toFixed(1)} ק״מ`} />
            <Stat label="עצירות" value={String(bundle.derived.pickupStops)} />
            <Stat label="סטיית ימים" value={String(bundle.derived.deviationDaysSum)} />
          </div>
        </div>
      )}

      {bundle.explanations.length > 0 && (
        <ul className="list-disc space-y-1 pr-5 text-sm text-emerald-800">
          {bundle.explanations.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {bundle.tradeoffs.length > 0 && (
        <ul className="list-disc space-y-1 pr-5 text-sm text-amber-800">
          {bundle.tradeoffs.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      <div className="border-t border-slate-200 pt-3">
        <div className="mb-1 text-xs font-semibold text-slate-500">פריטים בחבילה</div>
        <ul className="space-y-1 text-sm text-slate-700">
          {bundle.includedItems.map((it) => (
            <li key={`${it.slotKey}-${it.listingId}`} className="flex justify-between gap-3">
              <span>
                <span className="font-medium">{it.titleHe}</span>
                <span className="mr-2 text-xs text-slate-400">({it.slotKey})</span>
              </span>
              <span className="text-xs text-slate-500">
                ₪{it.price} · {it.distanceKm.toFixed(1)} ק״מ · {it.condition}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-1">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function metricLabel(key: string): string {
  const map: Record<string, string> = {
    price: "מחיר",
    distance: "מרחק",
    reliability: "אמינות",
    condition: "מצב",
    availability: "זמינות",
  };
  return map[key] ?? key;
}
