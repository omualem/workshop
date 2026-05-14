"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHebrewAddressText = normalizeHebrewAddressText;
exports.normalizeAddressSearchTerm = normalizeAddressSearchTerm;
exports.normalizeNumericCode = normalizeNumericCode;
function normalizeHebrewAddressText(value) {
    return value.replace(/\uFEFF/g, "").replace(/\s+/g, " ").trim();
}
function normalizeAddressSearchTerm(value) {
    return normalizeHebrewAddressText(value);
}
function normalizeNumericCode(value) {
    const numeric = Number(String(value).trim());
    return Number.isInteger(numeric) && numeric >= 0 ? numeric : null;
}
//# sourceMappingURL=address-normalization.js.map