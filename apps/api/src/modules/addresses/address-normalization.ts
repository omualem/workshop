export function normalizeHebrewAddressText(value: string) {
  return value.replace(/\uFEFF/g, "").replace(/\s+/g, " ").trim();
}

export function normalizeAddressSearchTerm(value: string) {
  return normalizeHebrewAddressText(value);
}

export function normalizeNumericCode(value: string | number) {
  const numeric = Number(String(value).trim());
  return Number.isInteger(numeric) && numeric >= 0 ? numeric : null;
}
