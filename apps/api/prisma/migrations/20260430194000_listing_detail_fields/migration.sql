ALTER TABLE "Listing" ADD COLUMN "suitableFor" TEXT;
ALTER TABLE "Listing" ADD COLUMN "mainUses" TEXT;
ALTER TABLE "Listing" ADD COLUMN "city" TEXT;
ALTER TABLE "Listing" ADD COLUMN "pickupInstructions" TEXT;
ALTER TABLE "Listing" ADD COLUMN "includedItems" JSONB;
ALTER TABLE "Listing" ADD COLUMN "cancellationPolicy" TEXT;
ALTER TABLE "Listing" ADD COLUMN "returnTerms" TEXT;
ALTER TABLE "Listing" ADD COLUMN "requiresOperator" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Listing" ADD COLUMN "setupRequired" BOOLEAN NOT NULL DEFAULT false;
