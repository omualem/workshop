-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "settlementCode" INTEGER NOT NULL,
    "nameHe" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Street" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "streetCode" INTEGER NOT NULL,
    "nameHe" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Street_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "condition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "basePriceDaily" DECIMAL NOT NULL,
    "depositAmount" DECIMAL NOT NULL,
    "qualityScoreCached" DECIMAL NOT NULL DEFAULT 0,
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
INSERT INTO "new_Listing" (
    "id",
    "lenderId",
    "categoryId",
    "titleHe",
    "titleEn",
    "descriptionHe",
    "descriptionEn",
    "suitableFor",
    "mainUses",
    "condition",
    "status",
    "basePriceDaily",
    "depositAmount",
    "qualityScoreCached",
    "pickupLat",
    "pickupLng",
    "pickupAddressText",
    "city",
    "pickupInstructions",
    "deliverySupported",
    "includedItems",
    "cancellationPolicy",
    "returnTerms",
    "requiresOperator",
    "setupRequired",
    "inventoryCount",
    "minRentalDays",
    "maxRentalDays",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "lenderId",
    "categoryId",
    "titleHe",
    "titleEn",
    "descriptionHe",
    "descriptionEn",
    "suitableFor",
    "mainUses",
    "condition",
    "status",
    "basePriceDaily",
    "depositAmount",
    "qualityScoreCached",
    "pickupLat",
    "pickupLng",
    "pickupAddressText",
    "city",
    "pickupInstructions",
    "deliverySupported",
    "includedItems",
    "cancellationPolicy",
    "returnTerms",
    "requiresOperator",
    "setupRequired",
    "inventoryCount",
    "minRentalDays",
    "maxRentalDays",
    "createdAt",
    "updatedAt"
FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_categoryId_status_idx" ON "Listing"("categoryId", "status");
CREATE INDEX "Listing_lenderId_status_idx" ON "Listing"("lenderId", "status");
CREATE INDEX "Listing_cityId_idx" ON "Listing"("cityId");
CREATE INDEX "Listing_streetId_idx" ON "Listing"("streetId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "City_settlementCode_key" ON "City"("settlementCode");

-- CreateIndex
CREATE INDEX "City_nameHe_idx" ON "City"("nameHe");

-- CreateIndex
CREATE UNIQUE INDEX "Street_cityId_streetCode_key" ON "Street"("cityId", "streetCode");

-- CreateIndex
CREATE UNIQUE INDEX "Street_cityId_nameHe_key" ON "Street"("cityId", "nameHe");

-- CreateIndex
CREATE INDEX "Street_cityId_nameHe_idx" ON "Street"("cityId", "nameHe");
