"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAddressSourceFile = findAddressSourceFile;
exports.parseAddressSourceFile = parseAddressSourceFile;
exports.importAddressReferenceData = importAddressReferenceData;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const address_normalization_1 = require("./address-normalization");
const HEADER_CITY_CODE = "סמל_ישוב";
const HEADER_CITY_NAME = "שם_ישוב";
const HEADER_STREET_CODE = "סמל_רחוב";
const HEADER_STREET_NAME = "שם_רחוב";
function findAddressSourceFile(projectRoot = resolveProjectRoot()) {
    const preferred = node_path_1.default.join(projectRoot, "ערים ורחובות.csv");
    if ((0, node_fs_1.existsSync)(preferred)) {
        return preferred;
    }
    const candidates = (0, node_fs_1.readdirSync)(projectRoot)
        .filter((fileName) => fileName.toLowerCase().endsWith(".csv"))
        .map((fileName) => node_path_1.default.join(projectRoot, fileName));
    return candidates.find((filePath) => {
        const firstLine = readAddressFileText(filePath).split(/\r?\n/, 1)[0] ?? "";
        return (firstLine.includes(HEADER_CITY_CODE) &&
            firstLine.includes(HEADER_CITY_NAME) &&
            firstLine.includes(HEADER_STREET_CODE) &&
            firstLine.includes(HEADER_STREET_NAME));
    });
}
function parseAddressSourceFile(filePath) {
    const raw = readAddressFileText(filePath);
    const [headerLine = "", ...lines] = raw.split(/\r?\n/);
    const headers = splitCsvLine(headerLine).map((value) => (0, address_normalization_1.normalizeHebrewAddressText)(value));
    const cityCodeIndex = headers.indexOf(HEADER_CITY_CODE);
    const cityNameIndex = headers.indexOf(HEADER_CITY_NAME);
    const streetCodeIndex = headers.indexOf(HEADER_STREET_CODE);
    const streetNameIndex = headers.indexOf(HEADER_STREET_NAME);
    if (cityCodeIndex === -1 ||
        cityNameIndex === -1 ||
        streetCodeIndex === -1 ||
        streetNameIndex === -1) {
        throw new Error("קובץ הכתובות אינו כולל את עמודות היישוב/רחוב הנדרשות.");
    }
    const rows = [];
    let skippedRows = 0;
    for (const line of lines) {
        if (!line.trim())
            continue;
        const values = splitCsvLine(line);
        const settlementCode = (0, address_normalization_1.normalizeNumericCode)(values[cityCodeIndex] ?? "");
        const streetCode = (0, address_normalization_1.normalizeNumericCode)(values[streetCodeIndex] ?? "");
        const cityNameHe = (0, address_normalization_1.normalizeHebrewAddressText)(values[cityNameIndex] ?? "");
        const streetNameHe = (0, address_normalization_1.normalizeHebrewAddressText)(values[streetNameIndex] ?? "");
        if (settlementCode === null ||
            streetCode === null ||
            !cityNameHe ||
            !streetNameHe) {
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
async function importAddressReferenceData(prisma, projectRoot = resolveProjectRoot()) {
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
    const cityMap = new Map();
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
    const existingCityByCode = new Map(existingCities.map((city) => [city.settlementCode, city]));
    let citiesInserted = 0;
    let citiesUpdated = 0;
    let streetsInserted = 0;
    let streetsUpdated = 0;
    for (const cityEntry of [...cityMap.values()].sort((left, right) => left.settlementCode - right.settlementCode)) {
        const currentCity = existingCityByCode.get(cityEntry.settlementCode);
        const cityId = currentCity?.id ?? (0, node_crypto_1.randomUUID)();
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
        }
        else if ((0, address_normalization_1.normalizeAddressSearchTerm)(currentCity.nameHe) !== (0, address_normalization_1.normalizeAddressSearchTerm)(cityEntry.nameHe)) {
            citiesUpdated += 1;
        }
        const existingStreets = await prisma.street.findMany({
            where: { cityId },
            select: { id: true, streetCode: true, nameHe: true },
        });
        const existingStreetByCode = new Map(existingStreets.map((street) => [street.streetCode, street]));
        for (const [streetCode, streetNameHe] of [...cityEntry.streets.entries()].sort(([left], [right]) => left - right)) {
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
                    id: currentStreet?.id ?? (0, node_crypto_1.randomUUID)(),
                    cityId,
                    streetCode,
                    nameHe: streetNameHe,
                },
            });
            if (!currentStreet) {
                streetsInserted += 1;
            }
            else if ((0, address_normalization_1.normalizeAddressSearchTerm)(currentStreet.nameHe) !==
                (0, address_normalization_1.normalizeAddressSearchTerm)(streetNameHe)) {
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
function splitCsvLine(line) {
    const cells = [];
    let current = "";
    let insideQuotes = false;
    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];
        if (character === '"') {
            if (insideQuotes && line[index + 1] === '"') {
                current += '"';
                index += 1;
            }
            else {
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
function readAddressFileText(filePath) {
    const buffer = (0, node_fs_1.readFileSync)(filePath);
    const utf8 = buffer.toString("utf8");
    if (utf8.includes(HEADER_CITY_CODE)) {
        return utf8;
    }
    return decodeWindows1255(buffer);
}
function decodeWindows1255(buffer) {
    let text = "";
    for (const byte of buffer) {
        if (byte >= 0xe0 && byte <= 0xfa) {
            text += String.fromCharCode(0x05d0 + byte - 0xe0);
        }
        else {
            text += String.fromCharCode(byte);
        }
    }
    return text;
}
function resolveProjectRoot() {
    const candidates = [
        process.cwd(),
        node_path_1.default.resolve(process.cwd(), "../.."),
        node_path_1.default.resolve(__dirname, "../../../.."),
        node_path_1.default.resolve(__dirname, "../../../../../.."),
    ];
    return (candidates.find((candidate) => (0, node_fs_1.existsSync)(node_path_1.default.join(candidate, "ערים ורחובות.csv"))) ?? node_path_1.default.resolve(process.cwd(), "../.."));
}
//# sourceMappingURL=address-import.utils.js.map