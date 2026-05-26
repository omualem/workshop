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
        metadata: Prisma.JsonValue | null;
        action: string;
        entityType: string;
        entityId: string;
        before: Prisma.JsonValue | null;
        after: Prisma.JsonValue | null;
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
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameHe: string;
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
            userId: string;
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
            slug: string;
            nameHe: string;
        };
        id: string;
        titleHe: string;
        status: import(".prisma/client").$Enums.ListingStatus;
        updatedAt: Date;
        lender: {
            userId: string;
            displayName: string;
        };
    }[]>;
    bookings(): Promise<({
        renter: {
            id: string;
            fullName: string;
            email: string;
        };
        items: ({
            lender: {
                userId: string;
                displayName: string;
            };
            listing: {
                id: string;
                titleHe: string;
            };
        } & {
            quantity: number;
            id: string;
            lenderId: string;
            depositAmount: Prisma.Decimal;
            listingId: string;
            bookingId: string;
            itemPrice: Prisma.Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: Prisma.JsonValue | null;
        })[];
    } & {
        startDate: Date;
        endDate: Date;
        id: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        renterId: string;
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
        status: import(".prisma/client").$Enums.DisputeStatus;
        createdAt: Date;
        updatedAt: Date;
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
        listingId: string | null;
        bookingId: string;
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
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    })[]>;
    adminCreateCategory(dto: Parameters<CategoriesService["create"]>[0], actorUserId?: string): Promise<{
        parent: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    adminUpdateCategory(id: string, dto: Parameters<CategoriesService["update"]>[1], actorUserId?: string): Promise<{
        parent: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        } | null;
        children: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            createdAt: Date;
            updatedAt: Date;
            parentId: string | null;
            slug: string;
            nameHe: string;
            nameEn: string;
            attributesSchema: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        slug: string;
        nameHe: string;
        nameEn: string;
        attributesSchema: Prisma.JsonValue | null;
    }>;
    adminDeleteCategory(id: string, actorUserId?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.CategoryStatus;
    }>;
    private toAdminUser;
}
