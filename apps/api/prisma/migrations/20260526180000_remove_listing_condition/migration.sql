-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lenderId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "cityId" TEXT,
    "streetId" TEXT,
    "addressNumber" INTEGER,
    "titleHe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionHe" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "suitableFor" TEXT,
    "mainUses" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "basePriceDaily" DECIMAL NOT NULL,
    "depositAmount" DECIMAL NOT NULL,
    "qualityScoreCached" DECIMAL NOT NULL DEFAULT 0,
    "popularityScore" DECIMAL,
    "manualPriorityBoost" DECIMAL,
    "pickupLat" DECIMAL NOT NULL,
    "pickupLng" DECIMAL NOT NULL,
    "pickupAddressText" TEXT NOT NULL,
    "city" TEXT,
    "pickupInstructions" TEXT,
    "deliverySupported" BOOLEAN NOT NULL DEFAULT false,
    "includedItems" JSONB,
    "cancellationPolicy" TEXT,
    "returnTerms" TEXT,
    "requiresOperator" BOOLEAN NOT NULL DEFAULT false,
    "setupRequired" BOOLEAN NOT NULL DEFAULT false,
    "inventoryCount" INTEGER NOT NULL DEFAULT 1,
    "minRentalDays" INTEGER NOT NULL DEFAULT 1,
    "maxRentalDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "LenderProfile" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Listing_streetId_fkey" FOREIGN KEY ("streetId") REFERENCES "Street" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("addressNumber", "basePriceDaily", "cancellationPolicy", "categoryId", "city", "cityId", "createdAt", "deliverySupported", "depositAmount", "descriptionEn", "descriptionHe", "id", "includedItems", "inventoryCount", "lenderId", "mainUses", "manualPriorityBoost", "maxRentalDays", "minRentalDays", "pickupAddressText", "pickupInstructions", "pickupLat", "pickupLng", "popularityScore", "qualityScoreCached", "requiresOperator", "returnTerms", "setupRequired", "status", "streetId", "suitableFor", "titleEn", "titleHe", "updatedAt")
SELECT "addressNumber", "basePriceDaily", "cancellationPolicy", "categoryId", "city", "cityId", "createdAt", "deliverySupported", "depositAmount", "descriptionEn", "descriptionHe", "id", "includedItems", "inventoryCount", "lenderId", "mainUses", "manualPriorityBoost", "maxRentalDays", "minRentalDays", "pickupAddressText", "pickupInstructions", "pickupLat", "pickupLng", "popularityScore", "qualityScoreCached", "requiresOperator", "returnTerms", "setupRequired", "status", "streetId", "suitableFor", "titleEn", "titleHe", "updatedAt" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_categoryId_idx" ON "Listing"("categoryId");
CREATE INDEX "Listing_status_idx" ON "Listing"("status");
CREATE INDEX "Listing_basePriceDaily_idx" ON "Listing"("basePriceDaily");
CREATE INDEX "Listing_lenderId_idx" ON "Listing"("lenderId");
CREATE INDEX "Listing_pickupLat_pickupLng_idx" ON "Listing"("pickupLat", "pickupLng");
CREATE INDEX "Listing_categoryId_status_idx" ON "Listing"("categoryId", "status");
CREATE INDEX "Listing_lenderId_status_idx" ON "Listing"("lenderId", "status");
CREATE INDEX "Listing_cityId_idx" ON "Listing"("cityId");
CREATE INDEX "Listing_streetId_idx" ON "Listing"("streetId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
