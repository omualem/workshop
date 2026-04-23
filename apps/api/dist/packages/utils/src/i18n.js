"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dirForLocale = exports.isRtlLocale = void 0;
const isRtlLocale = (locale) => locale === "he";
exports.isRtlLocale = isRtlLocale;
const dirForLocale = (locale) => ((0, exports.isRtlLocale)(locale) ? "rtl" : "ltr");
exports.dirForLocale = dirForLocale;
//# sourceMappingURL=i18n.js.map