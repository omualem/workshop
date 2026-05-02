"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type AddressCityOption, type AddressStreetOption } from "../../lib/api";

export type AddressSelectionValue = {
  cityId: string;
  cityNameHe: string;
  settlementCode?: number;
  streetId: string;
  streetNameHe: string;
  addressNumber: string;
};

type AddressSelectorProps = {
  value: AddressSelectionValue;
  onChange: (next: AddressSelectionValue) => void;
  streetRequired?: boolean;
  addressNumberRequired?: boolean;
  previewLabel?: string;
};

const emptyCity: AddressCityOption[] = [];
const emptyStreet: AddressStreetOption[] = [];

export function AddressSelector({
  value,
  onChange,
  streetRequired = true,
  addressNumberRequired = true,
  previewLabel = "כתובת איסוף מלאה",
}: AddressSelectorProps) {
  const [cityQuery, setCityQuery] = useState(value.cityNameHe);
  const [streetQuery, setStreetQuery] = useState(value.streetNameHe);

  useEffect(() => {
    setCityQuery(value.cityNameHe);
  }, [value.cityNameHe]);

  useEffect(() => {
    setStreetQuery(value.streetNameHe);
  }, [value.streetNameHe]);

  const citiesQuery = useQuery({
    queryKey: ["address-cities", cityQuery],
    queryFn: () => api.addressCities(cityQuery, 20),
  });

  const streetsQuery = useQuery({
    queryKey: ["address-streets", value.cityId, streetQuery],
    queryFn: () =>
      api.addressStreets({
        cityId: value.cityId,
        q: streetQuery,
        limit: 20,
      }),
    enabled: Boolean(value.cityId),
  });

  const addressCatalogMissing =
    citiesQuery.isSuccess && (citiesQuery.data ?? emptyCity).length === 0;

  const preview = useMemo(() => {
    const parts: string[] = [];
    if (value.streetNameHe) {
      parts.push(`רחוב ${value.streetNameHe}`);
    }
    if (value.addressNumber.trim()) {
      parts.push(value.addressNumber.trim());
    }
    const streetPart = parts.join(" ");
    if (streetPart && value.cityNameHe) {
      return `${streetPart}, ${value.cityNameHe}`;
    }
    if (streetPart) return streetPart;
    if (value.cityNameHe) return value.cityNameHe;
    return "";
  }, [value.addressNumber, value.cityNameHe, value.streetNameHe]);

  return (
    <div className="space-y-4 md:col-span-2">
      {addressCatalogMissing ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <div>מאגר הערים והרחובות לא נטען</div>
          <div className="mt-1 text-xs">הרץ `npm run db:import:addresses`</div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <AddressField
          label="עיר"
          value={cityQuery}
          onChange={(nextValue) => {
            setCityQuery(nextValue);
            onChange({
              cityId: "",
              cityNameHe: nextValue,
              streetId: "",
              streetNameHe: "",
              addressNumber: value.addressNumber,
            });
          }}
          placeholder="חיפוש עיר"
          disabled={addressCatalogMissing}
        />

        <AddressField
          label="רחוב"
          value={streetQuery}
          onChange={(nextValue) => {
            setStreetQuery(nextValue);
            onChange({
              ...value,
              streetId: "",
              streetNameHe: nextValue,
            });
          }}
          placeholder={
            value.cityId ? "חיפוש רחוב" : "בחרו קודם עיר"
          }
          disabled={addressCatalogMissing || !value.cityId}
        />

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">מספר בית</span>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            className="w-full rounded-2xl border px-4 py-3 text-right disabled:bg-slate-100"
            dir="rtl"
            value={value.addressNumber}
            disabled={addressCatalogMissing || (addressNumberRequired && !value.streetId)}
            onChange={(event) =>
              onChange({
                ...value,
                addressNumber: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SuggestionList
          items={citiesQuery.data ?? emptyCity}
          loading={citiesQuery.isLoading}
          emptyMessage="לא נמצאו ערים תואמות"
          onSelect={(city) =>
            onChange({
              cityId: city.id,
              cityNameHe: city.nameHe,
              settlementCode: city.settlementCode,
              streetId: "",
              streetNameHe: "",
              addressNumber: value.addressNumber,
            })
          }
        />

        <SuggestionList
          items={streetsQuery.data ?? emptyStreet}
          loading={streetsQuery.isLoading}
          emptyMessage="לא נמצאו רחובות לעיר שנבחרה"
          disabled={!value.cityId}
          onSelect={(street) =>
            onChange({
              ...value,
              streetId: street.id,
              streetNameHe: street.nameHe,
            })
          }
        />
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">{previewLabel}</span>
        <input
          readOnly
          className="w-full rounded-2xl border bg-slate-50 px-4 py-3 text-right text-slate-700"
          dir="rtl"
          value={preview}
          placeholder="הכתובת תיווצר אוטומטית"
        />
      </label>

      {streetRequired && !value.streetId && value.cityId ? (
        <div className="text-xs text-slate-500">יש לבחור רחוב מתוך המאגר.</div>
      ) : null}
    </div>
  );
}

function AddressField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="w-full rounded-2xl border px-4 py-3 text-right disabled:bg-slate-100"
        dir="rtl"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SuggestionList<T extends AddressCityOption | AddressStreetOption>({
  items,
  loading,
  emptyMessage,
  disabled,
  onSelect,
}: {
  items: T[];
  loading: boolean;
  emptyMessage: string;
  disabled?: boolean;
  onSelect: (item: T) => void;
}) {
  if (disabled) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-400">
        בחרו קודם עיר
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 px-4 py-5 text-sm text-slate-500">
        טוען אפשרויות...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="max-h-52 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-right text-sm last:border-b-0 hover:bg-slate-50"
          onClick={() => onSelect(item)}
        >
          <span className="text-slate-900">{item.nameHe}</span>
          <span className="text-xs text-slate-400">
            {"settlementCode" in item ? item.settlementCode : item.streetCode}
          </span>
        </button>
      ))}
    </div>
  );
}
