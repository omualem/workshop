"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
const FIXTURE = {
    categories: [
        { id: "demo-cat-camera", slug: "demo-camera", nameHe: "מצלמות", nameEn: "Cameras" },
        { id: "demo-cat-tripod", slug: "demo-tripod", nameHe: "חצובות", nameEn: "Tripods" },
        { id: "demo-cat-lighting", slug: "demo-lighting", nameHe: "תאורה", nameEn: "Lighting" },
    ],
    lenders: [
        {
            userId: "demo-lender-1",
            email: "demo-lender-1@rentmatch.local",
            displayName: "אולפן דניאל",
            lat: 32.0853,
            lng: 34.7818,
            averageRating: 4.6,
            completedTransactionsCount: 80,
        },
        {
            userId: "demo-lender-2",
            email: "demo-lender-2@rentmatch.local",
            displayName: "סטודיו רבקה",
            lat: 32.1093,
            lng: 34.8555,
            averageRating: 4.2,
            completedTransactionsCount: 30,
        },
    ],
    listings: [
        { id: "demo-l-cam-1", categoryId: "demo-cat-camera", lenderId: "demo-lender-1", titleHe: "Sony A7 IV", price: 320 },
        { id: "demo-l-cam-2", categoryId: "demo-cat-camera", lenderId: "demo-lender-2", titleHe: "Canon R6", price: 280 },
        { id: "demo-l-tri-1", categoryId: "demo-cat-tripod", lenderId: "demo-lender-1", titleHe: "Manfrotto 055", price: 90 },
        { id: "demo-l-tri-2", categoryId: "demo-cat-tripod", lenderId: "demo-lender-2", titleHe: "Sirui T-2204", price: 70 },
        { id: "demo-l-lig-1", categoryId: "demo-cat-lighting", lenderId: "demo-lender-1", titleHe: "Aputure 300x", price: 220 },
        { id: "demo-l-lig-2", categoryId: "demo-cat-lighting", lenderId: "demo-lender-2", titleHe: "Godox SL150", price: 150 },
    ],
};
async function main() {
    const passwordHash = await argon2.hash("Password123!");
    for (const cat of FIXTURE.categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: {},
            create: {
                id: cat.id,
                slug: cat.slug,
                nameHe: cat.nameHe,
                nameEn: cat.nameEn,
            },
        });
    }
    for (const lender of FIXTURE.lenders) {
        await prisma.user.upsert({
            where: { id: lender.userId },
            update: {},
            create: {
                id: lender.userId,
                role: client_1.UserRole.LENDER,
                fullName: lender.displayName,
                email: lender.email,
                phone: "0500000000",
                passwordHash,
            },
        });
        await prisma.lenderProfile.upsert({
            where: { userId: lender.userId },
            update: {
                averageRating: lender.averageRating,
                completedTransactionsCount: lender.completedTransactionsCount,
            },
            create: {
                userId: lender.userId,
                displayName: lender.displayName,
                averageRating: lender.averageRating,
                completedTransactionsCount: lender.completedTransactionsCount,
                verificationLevel: "VERIFIED",
                responseTimeScore: 8,
            },
        });
    }
    for (const l of FIXTURE.listings) {
        const lender = FIXTURE.lenders.find((x) => x.userId === l.lenderId);
        await prisma.listing.upsert({
            where: { id: l.id },
            update: { status: client_1.ListingStatus.ACTIVE, basePriceDaily: l.price },
            create: {
                id: l.id,
                lenderId: l.lenderId,
                categoryId: l.categoryId,
                titleHe: l.titleHe,
                titleEn: l.titleHe,
                descriptionHe: "פריט להשכרה לאלגוריתם הדגמה",
                descriptionEn: "Demo rental item",
                status: client_1.ListingStatus.ACTIVE,
                basePriceDaily: l.price,
                depositAmount: l.price,
                pickupLat: lender.lat,
                pickupLng: lender.lng,
                pickupAddressText: "תל אביב",
                inventoryCount: 1,
            },
        });
    }
    console.log(`Seeded optimizer demo: ${FIXTURE.categories.length} categories, ${FIXTURE.lenders.length} lenders, ${FIXTURE.listings.length} listings.`);
    console.log("Use these category IDs for bundle-optimizer requests:");
    for (const c of FIXTURE.categories)
        console.log(`  ${c.slug.padEnd(15)} → ${c.id}`);
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-optimizer-demo.js.map