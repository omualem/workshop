"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const address_import_utils_1 = require("../src/modules/addresses/address-import.utils");
async function main() {
    const prisma = new client_1.PrismaClient();
    try {
        const summary = await (0, address_import_utils_1.importAddressReferenceData)(prisma);
        if (!summary.detectedPath) {
            console.error("מאגר הכתובות לא נמצא בשורש הפרויקט.");
            console.error("יש למקם קובץ CSV עם עמודות: סמל_ישוב, שם_ישוב, סמל_רחוב, שם_רחוב");
            process.exitCode = 1;
            return;
        }
        console.log(`Detected address source: ${summary.detectedPath}`);
        console.log(`Cities inserted: ${summary.citiesInserted}`);
        console.log(`Cities updated: ${summary.citiesUpdated}`);
        console.log(`Streets inserted: ${summary.streetsInserted}`);
        console.log(`Streets updated: ${summary.streetsUpdated}`);
        console.log(`Skipped invalid rows: ${summary.skippedRows}`);
    }
    finally {
        await prisma.$disconnect();
    }
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=import-addresses.js.map