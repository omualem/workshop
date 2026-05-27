import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CategoriesService } from "../categories/categories.service";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
export declare class AdminService {
    private readonly prisma;
    private readonly auditService;
    private readonly categoriesService;
    constructor(prisma: PrismaService, auditService: AuditService, categoriesService: CategoriesService);
    auditLogs(): Prisma.PrismaPromise<({
        actor: {
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            fullName: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        action: string;
        entityType: string;
        entityId: string;
        before: Prisma.JsonValue | null;
        after: Prisma.JsonValue | null;
        metadata: Prisma.JsonValue | null;
        actorUserId: string | null;
    })[]>;
    overview(): Promise<{
        users: number;
        lenders: number;
        renters: number;
        listings: number;
        disputes: number;
    }>;
    catalogOptions(): Promise<{
        categories: {
            id: string;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
        }[];
        lenders: ({
            user: {
                id: string;
                fullName: string;
                email: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            bio: string | null;
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: Prisma.Decimal;
            isFeatured: boolean;
            pickupAreaGeo: Prisma.JsonValue | null;
            reliabilityScoreCached: Prisma.Decimal;
            userId: string;
        })[];
    }>;
    users(includeDeleted?: boolean): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        locale: string;
        createdAt: Date;
        type: string;
        hasRenterProfile: boolean;
        hasLenderProfile: boolean;
        lenderDisplayName: string | null;
        renterProfile: {
            defaultAddressText: string | null;
            verificationStatus: string;
            preferences: Prisma.JsonValue | null;
        } | null;
        lenderProfile: {
            displayName: string;
            bio: string | null;
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            reliabilityScoreCached: Prisma.Decimal;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            responseTimeScore: Prisma.Decimal;
            verificationLevel: string;
        } | null;
    }[]>;
    createUser(dto: UpdateAdminUserDto, actorUserId?: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        locale: string;
        createdAt: Date;
        type: string;
        hasRenterProfile: boolean;
        hasLenderProfile: boolean;
        lenderDisplayName: string | null;
        renterProfile: {
            defaultAddressText: string | null;
            verificationStatus: string;
            preferences: Prisma.JsonValue | null;
        } | null;
        lenderProfile: {
            displayName: string;
            bio: string | null;
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            reliabilityScoreCached: Prisma.Decimal;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            responseTimeScore: Prisma.Decimal;
            verificationLevel: string;
        } | null;
    }>;
    updateUser(id: string, dto: UpdateAdminUserDto, actorUserId?: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        locale: string;
        createdAt: Date;
        type: string;
        hasRenterProfile: boolean;
        hasLenderProfile: boolean;
        lenderDisplayName: string | null;
        renterProfile: {
            defaultAddressText: string | null;
            verificationStatus: string;
            preferences: Prisma.JsonValue | null;
        } | null;
        lenderProfile: {
            displayName: string;
            bio: string | null;
            averageRating: Prisma.Decimal;
            completedTransactionsCount: number;
            reliabilityScoreCached: Prisma.Decimal;
            cancellationRate: Prisma.Decimal;
            lateReturnRate: Prisma.Decimal;
            complaintRate: Prisma.Decimal;
            responseTimeScore: Prisma.Decimal;
            verificationLevel: string;
        } | null;
    }>;
    deleteUser(id: string, actorUserId?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    moderationQueue(): Promise<{
        category: {
            id: string;
            nameHe: string;
            slug: string;
        };
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ListingStatus;
        lender: {
            displayName: string;
            userId: string;
        };
        titleHe: string;
    }[]>;
    bookings(): Promise<({
        renter: {
            id: string;
            fullName: string;
            email: string;
        };
        items: ({
            listing: {
                id: string;
                titleHe: string;
            };
            lender: {
                displayName: string;
                userId: string;
            };
        } & {
            id: string;
            bookingId: string;
            listingId: string;
            lenderId: string;
            quantity: number;
            itemPrice: Prisma.Decimal;
            depositAmount: Prisma.Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: Prisma.JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        renterId: string;
        startDate: Date;
        endDate: Date;
        totalPrice: Prisma.Decimal;
        totalDeposit: Prisma.Decimal;
        logisticsScoreSnapshot: Prisma.Decimal;
        reliabilityScoreSnapshot: Prisma.Decimal;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentReference: string | null;
    })[]>;
    disputes(): Promise<({
        booking: {
            id: string;
            status: import(".prisma/client").$Enums.BookingStatus;
        };
        openedBy: {
            id: string;
            fullName: string;
            email: string;
        };
        assignedAdmin: {
            id: string;
            fullName: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DisputeStatus;
        bookingId: string;
        reason: string;
        openedByUserId: string;
        assignedAdminId: string | null;
        resolutionNote: string | null;
    })[]>;
    reviews(): Promise<({
        listing: {
            id: string;
            titleHe: string;
        } | null;
        reviewer: {
            id: string;
            fullName: string;
            email: string;
        };
        reviewee: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        bookingId: string;
        listingId: string | null;
        reviewerId: string;
        revieweeUserId: string;
        rating: number;
        text: string;
        tags: Prisma.JsonValue | null;
    })[]>;
    adminCategories(includeArchived?: boolean): Prisma.PrismaPromise<({
        _count: {
            listings: number;
        };
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    })[]>;
    adminCreateCategory(dto: Parameters<CategoriesService["create"]>[0], actorUserId?: string): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    adminUpdateCategory(id: string, dto: Parameters<CategoriesService["update"]>[1], actorUserId?: string): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nameHe: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        parentId: string | null;
        slug: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    adminDeleteCategory(id: string, actorUserId?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
    }>;
    private toAdminUser;
}
