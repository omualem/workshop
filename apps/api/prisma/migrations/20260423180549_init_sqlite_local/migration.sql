-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'RENTER',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "locale" TEXT NOT NULL DEFAULT 'he',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RenterProfile" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "defaultLocationLat" DECIMAL,
    "defaultLocationLng" DECIMAL,
    "defaultAddressText" TEXT,
    "preferences" JSONB,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    CONSTRAINT "RenterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LenderProfile" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "averageRating" DECIMAL NOT NULL DEFAULT 0,
    "completedTransactionsCount" INTEGER NOT NULL DEFAULT 0,
    "cancellationRate" DECIMAL NOT NULL DEFAULT 0,
    "lateReturnRate" DECIMAL NOT NULL DEFAULT 0,
    "complaintRate" DECIMAL NOT NULL DEFAULT 0,
    "verificationLevel" TEXT NOT NULL DEFAULT 'BASIC',
    "responseTimeScore" DECIMAL NOT NULL DEFAULT 5,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "pickupAreaGeo" JSONB,
    "reliabilityScoreCached" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LenderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT,
    "slug" TEXT NOT NULL,
    "nameHe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "attributesSchema" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lenderId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titleHe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionHe" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "basePriceDaily" DECIMAL NOT NULL,
    "depositAmount" DECIMAL NOT NULL,
    "qualityScoreCached" DECIMAL NOT NULL DEFAULT 0,
    "pickupLat" DECIMAL NOT NULL,
    "pickupLng" DECIMAL NOT NULL,
    "pickupAddressText" TEXT NOT NULL,
    "deliverySupported" BOOLEAN NOT NULL DEFAULT false,
    "inventoryCount" INTEGER NOT NULL DEFAULT 1,
    "minRentalDays" INTEGER NOT NULL DEFAULT 1,
    "maxRentalDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "LenderProfile" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListingMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "altText" TEXT NOT NULL,
    CONSTRAINT "ListingMedia_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListingAttributeValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "attributeKey" TEXT NOT NULL,
    "attributeValue" JSONB NOT NULL,
    CONSTRAINT "ListingAttributeValue_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListingAvailabilityBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "reason" TEXT,
    CONSTRAINT "ListingAvailabilityBlock_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "minDays" INTEGER,
    "maxDays" INTEGER,
    "percentDiscount" DECIMAL,
    "fixedOverride" DECIMAL,
    "weekendAdjustment" DECIMAL,
    "seasonalAdjustment" DECIMAL,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "metadata" JSONB,
    CONSTRAINT "PricingRule_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "renterId" TEXT NOT NULL,
    "bundleCandidateId" TEXT,
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
    CONSTRAINT "Booking_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_bundleCandidateId_fkey" FOREIGN KEY ("bundleCandidateId") REFERENCES "BundleCandidate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookingItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "itemPrice" DECIMAL NOT NULL,
    "depositAmount" DECIMAL NOT NULL,
    "pickupMethod" TEXT NOT NULL,
    "pickupWindow" JSONB,
    CONSTRAINT "BookingItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookingItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingItem_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "LenderProfile" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeUserId" TEXT NOT NULL,
    "listingId" TEXT,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "tags" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_revieweeUserId_fkey" FOREIGN KEY ("revieweeUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BundleSearchRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "renterId" TEXT,
    "searchSessionId" TEXT NOT NULL,
    "dateRangeStart" DATETIME NOT NULL,
    "dateRangeEnd" DATETIME NOT NULL,
    "requestedItems" JSONB NOT NULL,
    "renterLocationLat" DECIMAL NOT NULL,
    "renterLocationLng" DECIMAL NOT NULL,
    "renterAddressText" TEXT NOT NULL,
    "weightPreferences" JSONB NOT NULL,
    "resultsSnapshot" JSONB,
    "debugSnapshot" JSONB,
    "maxBudget" DECIMAL,
    "maxPickupPoints" INTEGER,
    "sameLenderPreferred" BOOLEAN NOT NULL DEFAULT false,
    "deliveryPreferred" BOOLEAN NOT NULL DEFAULT false,
    "exactDatesOnly" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BundleSearchRequest_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "RenterProfile" ("userId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BundleCandidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "searchRequestId" TEXT NOT NULL,
    "scoreTotal" DECIMAL NOT NULL,
    "priceScore" DECIMAL NOT NULL,
    "reliabilityScore" DECIMAL NOT NULL,
    "logisticsScore" DECIMAL NOT NULL,
    "availabilityScore" DECIMAL NOT NULL,
    "productQualityScore" DECIMAL NOT NULL,
    "stabilityScore" DECIMAL NOT NULL,
    "explanation" JSONB NOT NULL,
    "debugData" JSONB,
    "totalPrice" DECIMAL NOT NULL,
    "totalDistanceKm" DECIMAL NOT NULL,
    "pickupPointsCount" INTEGER NOT NULL,
    "lendersCount" INTEGER NOT NULL,
    "exactAvailabilityFit" BOOLEAN NOT NULL DEFAULT true,
    "rankIndex" INTEGER NOT NULL,
    "label" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BundleCandidate_searchRequestId_fkey" FOREIGN KEY ("searchRequestId") REFERENCES "BundleSearchRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BundleCandidateItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bundleCandidateId" TEXT NOT NULL,
    "requestedSlotKey" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "contributionScores" JSONB NOT NULL,
    CONSTRAINT "BundleCandidateItem_bundleCandidateId_fkey" FOREIGN KEY ("bundleCandidateId") REFERENCES "BundleCandidate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BundleCandidateItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BundleCandidateItem_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "LenderProfile" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "renterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "searchPayload" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedSearch_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "renterId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "openedByUserId" TEXT NOT NULL,
    "assignedAdminId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "reason" TEXT NOT NULL,
    "resolutionNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dispute_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Dispute_openedByUserId_fkey" FOREIGN KEY ("openedByUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Dispute_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'IN_APP',
    "type" TEXT NOT NULL,
    "titleHe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "bodyHe" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "payload" JSONB,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RankingConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "presetKey" TEXT NOT NULL,
    "displayNameHe" TEXT NOT NULL,
    "weights" JSONB NOT NULL,
    "lowScoreThreshold" DECIMAL NOT NULL DEFAULT 5.2,
    "stdDevAlpha" DECIMAL NOT NULL DEFAULT 0.35,
    "lowScoreBeta" DECIMAL NOT NULL DEFAULT 0.60,
    "bottleneckGamma" DECIMAL NOT NULL DEFAULT 0.28,
    "updatedByUserId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RankingConfig_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeliveryWindow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lenderId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "zoneName" TEXT NOT NULL,
    "feeBase" DECIMAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "DeliveryWindow_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "LenderProfile" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentIntentPlaceholder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerReference" TEXT,
    "status" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ILS',
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "RefreshSession_userId_idx" ON "RefreshSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Listing_categoryId_status_idx" ON "Listing"("categoryId", "status");

-- CreateIndex
CREATE INDEX "Listing_lenderId_status_idx" ON "Listing"("lenderId", "status");

-- CreateIndex
CREATE INDEX "ListingMedia_listingId_sortOrder_idx" ON "ListingMedia"("listingId", "sortOrder");

-- CreateIndex
CREATE INDEX "ListingAttributeValue_listingId_idx" ON "ListingAttributeValue"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingAttributeValue_listingId_attributeKey_key" ON "ListingAttributeValue"("listingId", "attributeKey");

-- CreateIndex
CREATE INDEX "ListingAvailabilityBlock_listingId_startDate_endDate_idx" ON "ListingAvailabilityBlock"("listingId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "PricingRule_listingId_idx" ON "PricingRule"("listingId");

-- CreateIndex
CREATE INDEX "Booking_renterId_status_idx" ON "Booking"("renterId", "status");

-- CreateIndex
CREATE INDEX "Booking_startDate_endDate_idx" ON "Booking"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "BookingItem_bookingId_idx" ON "BookingItem"("bookingId");

-- CreateIndex
CREATE INDEX "BookingItem_listingId_idx" ON "BookingItem"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_revieweeUserId_idx" ON "Review"("revieweeUserId");

-- CreateIndex
CREATE INDEX "Review_listingId_idx" ON "Review"("listingId");

-- CreateIndex
CREATE INDEX "BundleSearchRequest_renterId_createdAt_idx" ON "BundleSearchRequest"("renterId", "createdAt");

-- CreateIndex
CREATE INDEX "BundleCandidate_searchRequestId_rankIndex_idx" ON "BundleCandidate"("searchRequestId", "rankIndex");

-- CreateIndex
CREATE INDEX "BundleCandidateItem_bundleCandidateId_idx" ON "BundleCandidateItem"("bundleCandidateId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "SavedSearch_renterId_createdAt_idx" ON "SavedSearch"("renterId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_renterId_listingId_key" ON "Favorite"("renterId", "listingId");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RankingConfig_presetKey_key" ON "RankingConfig"("presetKey");

-- CreateIndex
CREATE INDEX "DeliveryWindow_lenderId_dayOfWeek_idx" ON "DeliveryWindow"("lenderId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntentPlaceholder_bookingId_key" ON "PaymentIntentPlaceholder"("bookingId");
