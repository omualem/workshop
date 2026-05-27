import { CandidateFilterService } from "./candidate-filter.service";
import { ListingRatingService } from "./listing-rating.service";
import { MetricNormalizationService } from "./metric-normalization.service";
import type { OptimizerRequest, SlotInput } from "./bundle-optimizer.types";

type ListingRow = {
  id: string;
  status: string;
  categoryId: string;
  lenderId: string;
  titleHe: string;
  titleEn: string;
  pickupLat: number;
  pickupLng: number;
  inventoryCount: number;
  basePriceDaily: number;
  lender: any;
};

const lenderRow = {
  averageRating: 4.5,
  completedTransactionsCount: 50,
  cancellationRate: 0.02,
  lateReturnRate: 0.01,
  complaintRate: 0.0,
  verificationLevel: "VERIFIED",
  responseTimeScore: 8,
};

function listing(partial: Partial<ListingRow>): ListingRow {
  return {
    id: "L1",
    status: "ACTIVE",
    categoryId: "cat-1",
    lenderId: "lender-1",
    titleHe: "מוצר",
    titleEn: "Product",
    pickupLat: 32.0853,
    pickupLng: 34.7818,
    inventoryCount: 1,
    basePriceDaily: 100,
    lender: lenderRow,
    ...partial,
  };
}

function makeService(
  listings: ListingRow[],
  isAvailable: (listingId: string, quantity: number, inventoryCount: number) => boolean = () => true,
  reviews: Array<{ listingId: string; reviewerId: string; rating: number }> = [],
) {
  const byId = new Map(listings.map((l) => [l.id, l]));
  const prisma: any = {
    listing: {
      findMany: jest.fn(async ({ where }: any) => {
        return listings.filter((l) => {
          if (where.status && l.status !== where.status) return false;
          if (where.categoryId && l.categoryId !== where.categoryId) return false;
          if (where.NOT?.id && l.id === where.NOT.id) return false;
          return true;
        });
      }),
      findUnique: jest.fn(async ({ where }: any) => byId.get(where.id) ?? null),
    },
    listingAvailabilityBlock: {
      findMany: jest.fn(async () => []),
    },
    review: {
      findMany: jest.fn(async ({ where }: any) => {
        const ids: string[] = where?.listingId?.in ?? [];
        return reviews.filter((r) => ids.includes(r.listingId));
      }),
    },
  };
  const availability: any = {
    isListingAvailable: jest.fn(
      async (listingId: string, quantity: number, _start: Date, _end: Date, inventoryCount: number) =>
        isAvailable(listingId, quantity, inventoryCount),
    ),
  };
  // PricingService.computeListingPrice — mock returns daily * days * qty.
  const pricing: any = {
    computeListingPrice: jest.fn((l: ListingRow, start: Date, end: Date, qty: number) => {
      const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
      return { total: l.basePriceDaily * days * qty };
    }),
  };
  const reliability: any = {
    compute: jest.fn(() => 8),
  };
  const normalization = new MetricNormalizationService();

  return new CandidateFilterService(
    prisma,
    availability,
    pricing,
    reliability,
    normalization,
    new ListingRatingService(),
  );
}

const baseRequest = (slots: SlotInput[]): OptimizerRequest => ({
  slots,
  dateRange: { startDate: "2026-06-01", endDate: "2026-06-03" },
  userLocation: { lat: 32.0853, lng: 34.7818 },
  budget: 5000,
  preferences: {
    weights: { price: 0.25, distance: 0.25, reliability: 0.25, availability: 0.25 },
    lambdaVariance: 0.35,
    alphaBottleneck: 0.25,
    betaPickup: 0.4,
    gammaMaxDistance: 0.15,
    alphaDistanceMix: 0.6,
    topKPerSlot: 30,
    beamWidth: 50,
  },
});

describe("CandidateFilterService", () => {
  describe("category mode", () => {
    it("returns ACTIVE listings under the chosen category", async () => {
      const svc = makeService([
        listing({ id: "A", categoryId: "cat-1" }),
        listing({ id: "B", categoryId: "cat-1" }),
        listing({ id: "C", categoryId: "cat-2" }),
      ]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      const ids = candidatesBySlot["s1"].map((c) => c.listingId).sort();
      expect(ids).toEqual(["A", "B"]);
    });

    it("excludes inactive, blocked, and archived listings", async () => {
      const svc = makeService([
        listing({ id: "active", status: "ACTIVE", categoryId: "cat-1" }),
        listing({ id: "draft", status: "DRAFT", categoryId: "cat-1" }),
        listing({ id: "blocked", status: "BLOCKED", categoryId: "cat-1" }),
        listing({ id: "archived", status: "ARCHIVED", categoryId: "cat-1" }),
      ]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      expect(candidatesBySlot["s1"].map((c) => c.listingId)).toEqual(["active"]);
    });

    it("filters by minPrice constraint", async () => {
      const svc = makeService([
        listing({ id: "cheap", basePriceDaily: 50 }),
        listing({ id: "ok", basePriceDaily: 200 }),
      ]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "category",
            categoryId: "cat-1",
            quantity: 1,
            constraints: { minPrice: 300 },
          },
        ]),
      );
      expect(candidatesBySlot["s1"].map((c) => c.listingId)).toEqual(["ok"]);
    });

    it("filters by maxPrice constraint", async () => {
      const svc = makeService([
        listing({ id: "cheap", basePriceDaily: 50 }),
        listing({ id: "pricey", basePriceDaily: 500 }),
      ]);
      // 2 days × price; maxPrice 200 keeps only "cheap" (100) and rejects "pricey" (1000).
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "category",
            categoryId: "cat-1",
            quantity: 1,
            constraints: { maxPrice: 200 },
          },
        ]),
      );
      expect(candidatesBySlot["s1"].map((c) => c.listingId)).toEqual(["cheap"]);
    });

    it("filters by maxDistanceKm constraint", async () => {
      const svc = makeService([
        listing({ id: "near", pickupLat: 32.0853, pickupLng: 34.7818 }),
        // ~100km away
        listing({ id: "far", pickupLat: 33.0, pickupLng: 35.5 }),
      ]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "category",
            categoryId: "cat-1",
            quantity: 1,
            constraints: { maxDistanceKm: 10 },
          },
        ]),
      );
      expect(candidatesBySlot["s1"].map((c) => c.listingId)).toEqual(["near"]);
    });

    it("returns empty pool when category has no active listings", async () => {
      const svc = makeService([listing({ id: "A", categoryId: "cat-2" })]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      expect(candidatesBySlot["s1"]).toEqual([]);
    });
  });

  describe("specificListing mode", () => {
    it("with allowAlternatives=false returns ONLY the chosen listing", async () => {
      const svc = makeService([
        listing({ id: "chosen", categoryId: "cat-1" }),
        listing({ id: "sibling", categoryId: "cat-1" }),
      ]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "specificListing",
            specificListingId: "chosen",
            quantity: 1,
            constraints: { allowAlternatives: false },
          },
        ]),
      );
      expect(candidatesBySlot["s1"].map((c) => c.listingId)).toEqual(["chosen"]);
    });

    it("with allowAlternatives=true expands the pool with same-category siblings", async () => {
      const svc = makeService([
        listing({ id: "chosen", categoryId: "cat-1" }),
        listing({ id: "sibling-1", categoryId: "cat-1" }),
        listing({ id: "sibling-2", categoryId: "cat-1" }),
        listing({ id: "other-cat", categoryId: "cat-2" }),
      ]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "specificListing",
            specificListingId: "chosen",
            quantity: 1,
            constraints: { allowAlternatives: true },
          },
        ]),
      );
      const ids = candidatesBySlot["s1"].map((c) => c.listingId).sort();
      expect(ids).toEqual(["chosen", "sibling-1", "sibling-2"]);
      expect(new Set(ids).size).toBe(ids.length);
      // Chosen listing must receive the soft preference bonus → highest preliminaryScore
      const chosen = candidatesBySlot["s1"].find((c) => c.listingId === "chosen")!;
      const sibling = candidatesBySlot["s1"].find((c) => c.listingId === "sibling-1")!;
      expect(chosen.preliminaryScore).toBeGreaterThan(sibling.preliminaryScore);
    });

    it("with allowAlternatives=false yields empty pool when chosen listing missing", async () => {
      const svc = makeService([listing({ id: "other" })]);
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "specificListing",
            specificListingId: "ghost",
            quantity: 1,
            constraints: { allowAlternatives: false },
          },
        ]),
      );
      expect(candidatesBySlot["s1"]).toEqual([]);
    });

    it("with allowAlternatives=false yields empty pool when chosen listing is invalid or unavailable", async () => {
      const inactiveSvc = makeService([listing({ id: "chosen", status: "BLOCKED" })]);
      const inactive = await inactiveSvc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "specificListing",
            specificListingId: "chosen",
            quantity: 1,
            constraints: { allowAlternatives: false },
          },
        ]),
      );
      expect(inactive.candidatesBySlot["s1"]).toEqual([]);

      const unavailableSvc = makeService([listing({ id: "chosen" })], () => false);
      const unavailable = await unavailableSvc.buildCandidatesPerSlot(
        baseRequest([
          {
            slotKey: "s1",
            mode: "specificListing",
            specificListingId: "chosen",
            quantity: 1,
            constraints: { allowAlternatives: false },
          },
        ]),
      );
      expect(unavailable.candidatesBySlot["s1"]).toEqual([]);
    });
  });

  describe("zero-candidates surfaces the failing slot", () => {
    it("findEmptySlot returns the slot whose pool is empty", async () => {
      const svc = makeService([listing({ id: "A", categoryId: "cat-1" })]);
      const req = baseRequest([
        { slotKey: "good", mode: "category", categoryId: "cat-1", quantity: 1 },
        { slotKey: "bad", mode: "category", categoryId: "missing-cat", quantity: 1 },
      ]);
      const { candidatesBySlot, expandedSlots } = await svc.buildCandidatesPerSlot(req);
      const empty = svc.findEmptySlot(expandedSlots, candidatesBySlot);
      expect(empty?.slotKey).toBe("bad");
    });
  });

  describe("quantity expansion (MVP)", () => {
    it("expands a quantity=3 slot into three internal slots, each with the same pool", async () => {
      const svc = makeService([
        listing({ id: "A", categoryId: "cat-1" }),
        listing({ id: "B", categoryId: "cat-1" }),
      ]);
      const { candidatesBySlot, expandedSlots } = await svc.buildCandidatesPerSlot(
        baseRequest([
          { slotKey: "chairs", mode: "category", categoryId: "cat-1", quantity: 3 },
        ]),
      );
      expect(expandedSlots.map((s) => s.slotKey)).toEqual([
        "chairs::1",
        "chairs::2",
        "chairs::3",
      ]);
      for (const key of ["chairs::1", "chairs::2", "chairs::3"]) {
        expect(candidatesBySlot[key].map((c) => c.listingId).sort()).toEqual(["A", "B"]);
      }
    });

    it("uses stable internal keys and carries inventoryCount into candidates", async () => {
      const svc = makeService([
        listing({ id: "A", categoryId: "cat-1", inventoryCount: 2 }),
      ]);
      const { candidatesBySlot, expandedSlots } = await svc.buildCandidatesPerSlot(
        baseRequest([
          { slotKey: "camera", mode: "category", categoryId: "cat-1", quantity: 2 },
        ]),
      );
      expect(expandedSlots.map((s) => s.slotKey)).toEqual(["camera::1", "camera::2"]);
      expect(candidatesBySlot["camera::1"][0].inventoryCount).toBe(2);
      expect(candidatesBySlot["camera::2"][0].inventoryCount).toBe(2);
    });
  });

  describe("item-level rating signal", () => {
    it("falls back to lender reliability when the listing has zero reviews", async () => {
      const svc = makeService(
        [listing({ id: "L1", categoryId: "cat-1" })],
        () => true,
        [],
      );
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      const c = candidatesBySlot["s1"][0];
      expect(c.reliabilityBreakdown.insufficientRatingInfo).toBe(true);
      expect(c.reliabilityBreakdown.itemRatingScore).toBeNull();
      expect(c.reliabilityBreakdown.itemDistinctRatingCount).toBe(0);
      // Final reliability equals the (mocked) lender reliability of 8 — no
      // item rating folded in.
      expect(c.reliability).toBe(8);
      expect(c.reliabilityBreakdown.finalReliabilityScore).toBe(8);
    });

    it("counts DISTINCT reviewers, not raw review rows", async () => {
      const svc = makeService(
        [listing({ id: "L1", categoryId: "cat-1" })],
        () => true,
        [
          { listingId: "L1", reviewerId: "userA", rating: 5 },
          { listingId: "L1", reviewerId: "userA", rating: 4 },
          { listingId: "L1", reviewerId: "userA", rating: 5 },
        ],
      );
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      const c = candidatesBySlot["s1"][0];
      expect(c.reliabilityBreakdown.itemDistinctRatingCount).toBe(1);
    });

    it("a rating of 5 with one rater receives lower reliability than rating 4.5 with many raters (similar lender reliability)", async () => {
      const svc = makeService(
        [
          listing({ id: "Lfew", categoryId: "cat-1" }),
          listing({ id: "Lmany", categoryId: "cat-1" }),
        ],
        () => true,
        [
          { listingId: "Lfew", reviewerId: "u1", rating: 5 },
          ...Array.from({ length: 30 }, (_, i) => ({
            listingId: "Lmany",
            reviewerId: `u${i + 100}`,
            rating: 4.5,
          })),
        ],
      );
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      const few = candidatesBySlot["s1"].find((c) => c.listingId === "Lfew")!;
      const many = candidatesBySlot["s1"].find((c) => c.listingId === "Lmany")!;
      expect(many.reliability).toBeGreaterThan(few.reliability);
    });

    it("listing 4.5 with 500 distinct raters beats listing 5.0 with 1 rater (same lender reliability)", async () => {
      const manyReviews = Array.from({ length: 500 }, (_, i) => ({
        listingId: "Lmany",
        reviewerId: `u${i}`,
        rating: 4.5,
      }));
      const svc = makeService(
        [
          listing({ id: "Lfew", categoryId: "cat-1" }),
          listing({ id: "Lmany", categoryId: "cat-1" }),
        ],
        () => true,
        [
          { listingId: "Lfew", reviewerId: "solo", rating: 5 },
          ...manyReviews,
        ],
      );
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      const few = candidatesBySlot["s1"].find((c) => c.listingId === "Lfew")!;
      const many = candidatesBySlot["s1"].find((c) => c.listingId === "Lmany")!;
      // Lender reliability is identical (mocked to 8 in this spec), so any
      // difference comes solely from the item-rating-confidence signal.
      expect(few.reliabilityBreakdown.lenderReliability).toBe(
        many.reliabilityBreakdown.lenderReliability,
      );
      expect(many.reliability).toBeGreaterThan(few.reliability);
      // The mixed score must also propagate into the normalized metric used
      // for ranking and pruning, not just the breakdown.
      expect(many.m_reliability).toBeGreaterThan(few.m_reliability);
      expect(many.preliminaryScore).toBeGreaterThan(few.preliminaryScore);
    });

    it("surfaces all rating breakdown fields on the candidate", async () => {
      const svc = makeService(
        [listing({ id: "L1", categoryId: "cat-1" })],
        () => true,
        [
          { listingId: "L1", reviewerId: "u1", rating: 5 },
          { listingId: "L1", reviewerId: "u2", rating: 4 },
        ],
      );
      const { candidatesBySlot } = await svc.buildCandidatesPerSlot(
        baseRequest([{ slotKey: "s1", mode: "category", categoryId: "cat-1", quantity: 1 }]),
      );
      const c = candidatesBySlot["s1"][0];
      const b = c.reliabilityBreakdown;
      expect(b).toEqual(
        expect.objectContaining({
          lenderReliability: expect.any(Number),
          itemAverageRating: expect.any(Number),
          itemDistinctRatingCount: 2,
          itemRatingConfidence: expect.any(Number),
          adjustedItemRating: expect.any(Number),
          itemRatingScore: expect.any(Number),
          insufficientRatingInfo: false,
          finalReliabilityScore: expect.any(Number),
        }),
      );
      expect(b.itemRatingConfidence).toBeCloseTo(2 / 30);
    });
  });
});
