import { randomUUID } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import {
  normalizeAddressSearchTerm,
  normalizeHebrewAddressText,
  normalizeNumericCode,
} from "./address-normalization";

export type ImportedAddressRow = {
  settlementCode: number;
  cityNameHe: string;
  streetCode: number;
  streetNameHe: string;
};

export type ParsedAddressSource = {
  detectedPath: string;
  rows: ImportedAddressRow[];
  skippedRows: number;
};

export type AddressImportSummary = {
  detectedPath: string | null;
  citiesInserted: number;
  citiesUpdated: number;
  streetsInserted: number;
  streetsUpdated: number;
  skippedRows: number;
};

const HEADER_CITY_CODE = "סמל_ישוב";
const HEADER_CITY_NAME = "שם_ישוב";
const HEADER_STREET_CODE = "סמל_רחוב";
const HEADER_STREET_NAME = "שם_רחוב";

export function findAddressSourceFile(projectRoot = resolveProjectRoot()) {
  const preferred = path.join(projectRoot, "ערים ורחובות.csv");
  if (existsSync(preferred)) {
    return preferred;
  }

  const candidates = readdirSync(projectRoot)
    .filter((fileName) => fileName.toLowerCase().endsWith(".csv"))
    .map((fileName) => path.join(projectRoot, fileName));

  return candidates.find((filePath) => {
    const firstLine = readFileSync(filePath, "utf8").split(/\r?\n/, 1)[0] ?? "";
    return (
      firstLine.includes(HEADER_CITY_CODE) &&
      firstLine.includes(HEADER_CITY_NAME) &&
      firstLine.includes(HEADER_STREET_CODE) &&
      firstLine.includes(HEADER_STREET_NAME)
    );
  });
}

export function parseAddressSourceFile(filePath: string): ParsedAddressSource {
  const raw = readFileSync(filePath, "utf8");
  const [headerLine = "", ...lines] = raw.split(/\r?\n/);
  const headers = splitCsvLine(headerLine).map((value) =>
    normalizeHebrewAddressText(value),
  );

  const cityCodeIndex = headers.indexOf(HEADER_CITY_CODE);
  const cityNameIndex = headers.indexOf(HEADER_CITY_NAME);
  const streetCodeIndex = headers.indexOf(HEADER_STREET_CODE);
  const streetNameIndex = headers.indexOf(HEADER_STREET_NAME);

  if (
    cityCodeIndex === -1 ||
    cityNameIndex === -1 ||
    streetCodeIndex === -1 ||
    streetNameIndex === -1
  ) {
    throw new Error("קובץ הכתובות אינו כולל את עמודות היישוב/רחוב הנדרשות.");
  }

  const rows: ImportedAddressRow[] = [];
  let skippedRows = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    const values = splitCsvLine(line);
    const settlementCode = normalizeNumericCode(values[cityCodeIndex] ?? "");
    const streetCode = normalizeNumericCode(values[streetCodeIndex] ?? "");
    const cityNameHe = normalizeHebrewAddressText(values[cityNameIndex] ?? "");
    const streetNameHe = normalizeHebrewAddressText(values[streetNameIndex] ?? "");

    if (
      settlementCode === null ||
      streetCode === null ||
      !cityNameHe ||
      !streetNameHe
    ) {
      skippedRows += 1;
      continue;
    }

    rows.push({
      settlementCode,
      cityNameHe,
      streetCode,
      streetNameHe,
    });
  }

  return {
    detectedPath: filePath,
    rows,
    skippedRows,
  };
}

export async function importAddressReferenceData(
  prisma: PrismaClient,
  projectRoot = resolveProjectRoot(),
): Promise<AddressImportSummary> {
  const detectedPath = findAddressSourceFile(projectRoot);
  if (!detectedPath) {
    return {
      detectedPath: null,
      citiesInserted: 0,
      citiesUpdated: 0,
      streetsInserted: 0,
      streetsUpdated: 0,
      skippedRows: 0,
    };
  }

  const parsed = parseAddressSourceFile(detectedPath);
  const cityMap = new Map<
    number,
    { settlementCode: number; nameHe: string; streets: Map<number, string> }
  >();

  for (const row of parsed.rows) {
    const existingCity = cityMap.get(row.settlementCode);
    if (existingCity) {
      existingCity.nameHe = row.cityNameHe;
      existingCity.streets.set(row.streetCode, row.streetNameHe);
      continue;
    }

    cityMap.set(row.settlementCode, {
      settlementCode: row.settlementCode,
      nameHe: row.cityNameHe,
      streets: new Map([[row.streetCode, row.streetNameHe]]),
    });
  }

  const existingCities = await prisma.city.findMany({
    select: { id: true, settlementCode: true, nameHe: true },
  });
  const existingCityByCode = new Map(
    existingCities.map((city) => [city.settlementCode, city]),
  );

  let citiesInserted = 0;
  let citiesUpdated = 0;
  let streetsInserted = 0;
  let streetsUpdated = 0;

  for (const cityEntry of [...cityMap.values()].sort(
    (left, right) => left.settlementCode - right.settlementCode,
  )) {
    const currentCity = existingCityByCode.get(cityEntry.settlementCode);
    const cityId = currentCity?.id ?? randomUUID();

    await prisma.city.upsert({
      where: { settlementCode: cityEntry.settlementCode },
      update: { nameHe: cityEntry.nameHe },
      create: {
        id: cityId,
        settlementCode: cityEntry.settlementCode,
        nameHe: cityEntry.nameHe,
      },
    });

    if (!currentCity) {
      citiesInserted += 1;
    } else if (normalizeAddressSearchTerm(currentCity.nameHe) !== normalizeAddressSearchTerm(cityEntry.nameHe)) {
      citiesUpdated += 1;
    }

    const existingStreets = await prisma.street.findMany({
      where: { cityId },
      select: { id: true, streetCode: true, nameHe: true },
    });
    const existingStreetByCode = new Map(
      existingStreets.map((street) => [street.streetCode, street]),
    );

    for (const [streetCode, streetNameHe] of [...cityEntry.streets.entries()].sort(
      ([left], [right]) => left - right,
    )) {
      const currentStreet = existingStreetByCode.get(streetCode);
      await prisma.street.upsert({
        where: {
          cityId_streetCode: {
            cityId,
            streetCode,
          },
        },
        update: { nameHe: streetNameHe },
        create: {
          id: currentStreet?.id ?? randomUUID(),
          cityId,
          streetCode,
          nameHe: streetNameHe,
        },
      });

      if (!currentStreet) {
        streetsInserted += 1;
      } else if (
        normalizeAddressSearchTerm(currentStreet.nameHe) !==
        normalizeAddressSearchTerm(streetNameHe)
      ) {
        streetsUpdated += 1;
      }
    }
  }

  return {
    detectedPath,
    citiesInserted,
    citiesUpdated,
    streetsInserted,
    streetsUpdated,
    skippedRows: parsed.skippedRows,
  };
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === "," && !insideQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  cells.push(current);
  return cells;
}

function resolveProjectRoot() {
  return path.resolve(__dirname, "../../../..");
}
