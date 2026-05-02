-- CreateTable
CREATE TABLE "AddressGeocodeCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityId" TEXT NOT NULL,
    "streetId" TEXT NOT NULL,
    "addressNumber" INTEGER NOT NULL,
    "addressText" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "provider" TEXT NOT NULL,
    "rawResponse" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "AddressGeocodeCache_cityId_idx" ON "AddressGeocodeCache"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "AddressGeocodeCache_cityId_streetId_addressNumber_key" ON "AddressGeocodeCache"("cityId", "streetId", "addressNumber");
