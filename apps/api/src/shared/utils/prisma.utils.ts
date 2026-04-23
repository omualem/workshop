import { Decimal } from "@prisma/client/runtime/library";

export const decimalToNumber = (value: Decimal | number | string | null | undefined) => {
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

export const normalizeDecimalObject = <T extends Record<string, any>>(input: T): T => {
  const clone: Record<string, any> = Array.isArray(input) ? [...input] : { ...input };

  for (const [key, value] of Object.entries(clone)) {
    if (value instanceof Decimal) {
      clone[key] = value.toNumber();
    } else if (Array.isArray(value)) {
      clone[key] = value.map((item) =>
        item && typeof item === "object" ? normalizeDecimalObject(item) : item,
      );
    } else if (value && typeof value === "object") {
      clone[key] = normalizeDecimalObject(value);
    }
  }

  return clone as T;
};
