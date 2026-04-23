"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDecimalObject = exports.decimalToNumber = void 0;
const library_1 = require("@prisma/client/runtime/library");
const decimalToNumber = (value) => {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "string") {
        return Number(value);
    }
    return value.toNumber();
};
exports.decimalToNumber = decimalToNumber;
const normalizeDecimalObject = (input) => {
    const clone = Array.isArray(input) ? [...input] : { ...input };
    for (const [key, value] of Object.entries(clone)) {
        if (value instanceof library_1.Decimal) {
            clone[key] = value.toNumber();
        }
        else if (Array.isArray(value)) {
            clone[key] = value.map((item) => item && typeof item === "object" ? (0, exports.normalizeDecimalObject)(item) : item);
        }
        else if (value && typeof value === "object") {
            clone[key] = (0, exports.normalizeDecimalObject)(value);
        }
    }
    return clone;
};
exports.normalizeDecimalObject = normalizeDecimalObject;
//# sourceMappingURL=prisma.utils.js.map