import { PrismaClient } from "@prisma/client";
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
export declare function findAddressSourceFile(projectRoot?: string): string | undefined;
export declare function parseAddressSourceFile(filePath: string): ParsedAddressSource;
export declare function importAddressReferenceData(prisma: PrismaClient, projectRoot?: string): Promise<AddressImportSummary>;
