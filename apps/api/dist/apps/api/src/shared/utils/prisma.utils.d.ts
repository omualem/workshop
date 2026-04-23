import { Decimal } from "@prisma/client/runtime/library";
export declare const decimalToNumber: (value: Decimal | number | string | null | undefined) => number | null;
export declare const normalizeDecimalObject: <T extends Record<string, any>>(input: T) => T;
