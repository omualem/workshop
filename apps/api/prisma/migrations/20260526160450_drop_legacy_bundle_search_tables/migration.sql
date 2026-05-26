/*
  Warnings:

  - You are about to drop the `BundleCandidate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BundleCandidateItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BundleSearchRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RankingConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `bundleCandidateId` on the `Booking` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BundleCandidate_searchRequestId_rankIndex_idx";

-- DropIndex
DROP INDEX "BundleCandidateItem_bundleCandidateId_idx";

-- DropIndex
DROP INDEX "BundleSearchRequest_renterId_createdAt_idx";

-- DropIndex
DROP INDEX "RankingConfig_presetKey_key";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN "manualPriorityBoost" DECIMAL;
ALTER TABLE "Listing" ADD COLUMN "popularityScore" DECIMAL;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BundleCandidate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BundleCandidateItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BundleSearchRequest";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RankingConfig";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "renterId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "totalDeposit" DECIMAL NOT NULL,
    "logisticsScoreSnapshot" DECIMAL NOT NULL DEFAULT 0,
    "reliabilityScoreSnapshot" DECIMAL NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentReference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "endDate", "id", "logisticsScoreSnapshot", "paymentReference", "paymentStatus", "reliabilityScoreSnapshot", "renterId", "startDate", "status", "totalDeposit", "totalPrice", "updatedAt") SELECT "createdAt", "endDate", "id", "logisticsScoreSnapshot", "paymentReference", "paymentStatus", "reliabilityScoreSnapshot", "renterId", "startDate", "status", "totalDeposit", "totalPrice", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_renterId_status_idx" ON "Booking"("renterId", "status");
CREATE INDEX "Booking_startDate_endDate_idx" ON "Booking"("startDate", "endDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
