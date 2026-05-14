-- Support Bundle Optimizer retrieval C_s(u) = Retrieve(s,u) with cheap indexed filters.
CREATE INDEX "LenderProfile_averageRating_idx" ON "LenderProfile"("averageRating");
CREATE INDEX "LenderProfile_completedTransactionsCount_idx" ON "LenderProfile"("completedTransactionsCount");

CREATE INDEX "Listing_categoryId_idx" ON "Listing"("categoryId");
CREATE INDEX "Listing_status_idx" ON "Listing"("status");
CREATE INDEX "Listing_basePriceDaily_idx" ON "Listing"("basePriceDaily");
CREATE INDEX "Listing_condition_idx" ON "Listing"("condition");
CREATE INDEX "Listing_lenderId_idx" ON "Listing"("lenderId");
CREATE INDEX "Listing_pickupLat_pickupLng_idx" ON "Listing"("pickupLat", "pickupLng");

CREATE INDEX "ListingAvailabilityBlock_listingId_idx" ON "ListingAvailabilityBlock"("listingId");
CREATE INDEX "ListingAvailabilityBlock_startDate_endDate_idx" ON "ListingAvailabilityBlock"("startDate", "endDate");
CREATE INDEX "ListingAvailabilityBlock_status_idx" ON "ListingAvailabilityBlock"("status");
