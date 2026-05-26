"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  api,
  type AddressCityOption,
  type AddressStreetOption,
} from "../../lib/api";

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

const MIN_QUERY_LENGTH = 2;
const emptyCity: AddressCityOption[] = [];
const emptyStreet: AddressStreetOption[] = [];

export function AddressSelector({
  value,
  onChange,
  streetRequired = true,
  previewLabel = "כתובת איסוף",
}: AddressSelectorProps) {
  const [citySearchText, setCitySearchText] = useState(value.cityNameHe);
  const [streetSearchText, setStreetSearchText] = useState(value.streetNameHe);
  const [debouncedCity, setDebouncedCity] = useState(value.cityNameHe);
  const [debouncedStreet, setDebouncedStreet] = useState(value.streetNameHe);
  const [cityOpen, setCityOpen] = useState(false);
  const [streetOpen, setStreetOpen] = useState(false);

  const cityBlurTimer = useRef<number | null>(null);
  const streetBlurTimer = useRef<number | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedCity(citySearchText), 250);
    return () => window.clearTimeout(timeout);
  }, [citySearchText]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedStreet(streetSearchText), 250);
    return () => window.clearTimeout(timeout);
  }, [streetSearchText]);

  useEffect(() => {
    setCitySearchText(value.cityNameHe);
    setDebouncedCity(value.cityNameHe);
  }, [value.cityId, value.cityNameHe]);

  useEffect(() => {
    setStreetSearchText(value.streetNameHe);
    setDebouncedStreet(value.streetNameHe);
  }, [value.streetId, value.streetNameHe]);

  const cityQueryActive = debouncedCity.trim().length >= MIN_QUERY_LENGTH;
  const streetQueryActive =
    Boolean(value.cityId) &&
    debouncedStreet.trim().length >= MIN_QUERY_LENGTH;

  const citiesQuery = useQuery({
    queryKey: ["address-cities", debouncedCity],
    queryFn: () => api.addressCities(debouncedCity, 20),
    enabled: cityQueryActive,
  });

  const streetsQuery = useQuery({
    queryKey: ["address-streets", value.cityId, debouncedStreet],
    queryFn: () =>
      api.addressStreets({
        cityId: value.cityId,
        q: debouncedStreet,
        limit: 20,
      }),
    enabled: streetQueryActive,
  });

  const preview = useMemo(() => {
    const parts: string[] = [];
    if (value.streetNameHe) parts.push(`רחוב ${value.streetNameHe}`);
    if (value.addressNumber.trim()) parts.push(value.addressNumber.trim());
    const streetPart = parts.join(" ");
    if (streetPart && value.cityNameHe) return `${streetPart}, ${value.cityNameHe}`;
    if (streetPart) return streetPart;
    if (value.cityNameHe) return value.cityNameHe;
    return "";
  }, [value.addressNumber, value.cityNameHe, value.streetNameHe]);

  const showCityDropdown =
    cityOpen && citySearchText.trim().length >= MIN_QUERY_LENGTH;
  const showStreetDropdown =
    streetOpen &&
    Boolean(value.cityId) &&
    streetSearchText.trim().length >= MIN_QUERY_LENGTH;

  const cityItems = citiesQuery.data ?? emptyCity;
  const streetItems = streetsQuery.data ?? emptyStreet;

  return (
    <div className="space-y-3 md:col-span-2" dir="rtl">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="relative space-y-1 text-sm">
          <span className="font-medium text-slate-700">עיר</span>
          <input
            type="text"
            className="form-input"
            dir="rtl"
            value={citySearchText}
            placeholder="התחילו להקליד שם של עיר"
            autoComplete="off"
            onFocus={() => {
              if (cityBlurTimer.current) {
                window.clearTimeout(cityBlurTimer.current);
                cityBlurTimer.current = null;
              }
              setCityOpen(true);
            }}
            onBlur={() => {
              cityBlurTimer.current = window.setTimeout(() => {
                setCityOpen(false);
              }, 120);
            }}
            onChange={(event) => {
              const next = event.target.value;
              setCitySearchText(next);
              setCityOpen(true);
              setStreetSearchText("");
              setDebouncedStreet("");
              onChange({
                cityId: "",
                cityNameHe: next,
                settlementCode: undefined,
                streetId: "",
                streetNameHe: "",
                addressNumber: value.addressNumber,
              });
              if (!next.trim()) setCityOpen(false);
            }}
          />
          {showCityDropdown ? (
            <SuggestionPopover
              loading={citiesQuery.isLoading}
              emptyMessage="לא נמצאו ערים שמתאימות לחיפוש"
              items={cityItems}
              renderItem={(city) => (
                <>
                  <span className="text-slate-900">{city.nameHe}</span>
                  <span className="text-xs text-slate-400">{city.settlementCode}</span>
                </>
              )}
              onSelect={(city) => {
                if (cityBlurTimer.current) {
                  window.clearTimeout(cityBlurTimer.current);
                  cityBlurTimer.current = null;
                }
                setCitySearchText(city.nameHe);
                setDebouncedCity(city.nameHe);
                setStreetSearchText("");
                setDebouncedStreet("");
                setCityOpen(false);
                onChange({
                  cityId: city.id,
                  cityNameHe: city.nameHe,
                  settlementCode: city.settlementCode,
                  streetId: "",
                  streetNameHe: "",
                  addressNumber: value.addressNumber,
                });
              }}
            />
          ) : null}
        </label>

        <label className="relative space-y-1 text-sm">
          <span className="font-medium text-slate-700">רחוב</span>
          <input
            type="text"
            className="form-input"
            dir="rtl"
            value={streetSearchText}
            placeholder={value.cityId ? "התחילו להקליד שם של רחוב" : "יש לבחור עיר תחילה"}
            disabled={!value.cityId}
            autoComplete="off"
            onFocus={() => {
              if (streetBlurTimer.current) {
                window.clearTimeout(streetBlurTimer.current);
                streetBlurTimer.current = null;
              }
              setStreetOpen(true);
            }}
            onBlur={() => {
              streetBlurTimer.current = window.setTimeout(() => {
                setStreetOpen(false);
              }, 120);
            }}
            onChange={(event) => {
              const next = event.target.value;
              setStreetSearchText(next);
              setStreetOpen(true);
              onChange({
                ...value,
                streetId: "",
                streetNameHe: next,
              });
              if (!next.trim()) setStreetOpen(false);
            }}
          />
          {showStreetDropdown ? (
            <SuggestionPopover
              loading={streetsQuery.isLoading}
              emptyMessage="לא נמצאו רחובות שמתאימים לחיפוש"
              items={streetItems}
              renderItem={(street) => (
                <>
                  <span className="text-slate-900">{street.nameHe}</span>
                  <span className="text-xs text-slate-400">{street.streetCode}</span>
                </>
              )}
              onSelect={(street) => {
                if (streetBlurTimer.current) {
                  window.clearTimeout(streetBlurTimer.current);
                  streetBlurTimer.current = null;
                }
                setStreetSearchText(street.nameHe);
                setDebouncedStreet(street.nameHe);
                setStreetOpen(false);
                onChange({
                  ...value,
                  streetId: street.id,
                  streetNameHe: street.nameHe,
                });
              }}
            />
          ) : null}
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">מספר בית</span>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            dir="rtl"
            value={value.addressNumber}
            onChange={(event) => {
              const nextValue = event.target.value.replace(/[^\d]/g, "");
              onChange({
                ...value,
                addressNumber: nextValue,
              });
            }}
          />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium text-slate-700">{previewLabel}</span>
        <input
          readOnly
          className="form-input bg-slate-50"
          dir="rtl"
          value={preview}
          placeholder="הכתובת המלאה תופיע כאן אחרי בחירה"
        />
      </label>

      {streetRequired && !value.streetId && value.cityId ? (
        <div className="text-xs text-slate-500">יש לבחור רחוב מתוך הצעות ההשלמה האוטומטית.</div>
      ) : null}
    </div>
  );
}

function SuggestionPopover<T extends { id: string }>({
  items,
  loading,
  emptyMessage,
  renderItem,
  onSelect,
}: {
  items: T[];
  loading: boolean;
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
}) {
  return (
    <div
      className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
      dir="rtl"
      onMouseDown={(event) => event.preventDefault()}
    >
      {loading ? (
        <div className="px-4 py-3 text-sm text-slate-500">טוענים...</div>
      ) : items.length === 0 ? (
        <div className="px-4 py-3 text-sm text-slate-500">{emptyMessage}</div>
      ) : (
        items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-2 text-right text-sm last:border-b-0 hover:bg-cyan-50"
            onClick={() => onSelect(item)}
          >
            {renderItem(item)}
          </button>
        ))
      )}
    </div>
  );
}
