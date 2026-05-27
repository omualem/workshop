import { CreateCategoryDto } from "../categories/dto/create-category.dto";
import { UpdateCategoryDto } from "../categories/dto/update-category.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { AdminService } from "./admin.service";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    auditLogs(): import(".prisma/client").Prisma.PrismaPromise<({
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
        before: import("@prisma/client/runtime/library").JsonValue | null;
        after: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
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
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: import(".prisma/client").$Enums.VerificationLevel;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            isFeatured: boolean;
            pickupAreaGeo: import("@prisma/client/runtime/library").JsonValue | null;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
            userId: string;
        })[];
    }>;
    categories(includeArchived?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    createCategory(dto: CreateCategoryDto, user?: {
        sub: string;
    }): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateCategory(id: string, dto: UpdateCategoryDto, user?: {
        sub: string;
    }): Promise<{
        parent: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nameHe: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
            parentId: string | null;
            slug: string;
            nameEn: string;
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
            attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
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
        attributesSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    deleteCategory(id: string, user?: {
        sub: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            status: import(".prisma/client").$Enums.CategoryStatus;
        };
    }>;
    users(includeDeleted?: string): Promise<{
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
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        lenderProfile: {
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: string;
        } | null;
    }[]>;
    createUser(dto: UpdateAdminUserDto, user?: {
        sub: string;
    }): Promise<{
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
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        lenderProfile: {
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: string;
        } | null;
    }>;
    updateUser(id: string, dto: UpdateAdminUserDto, user?: {
        sub: string;
    }): Promise<{
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
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        lenderProfile: {
            displayName: string;
            bio: string | null;
            averageRating: import("@prisma/client/runtime/library").Decimal;
            completedTransactionsCount: number;
            reliabilityScoreCached: import("@prisma/client/runtime/library").Decimal;
            cancellationRate: import("@prisma/client/runtime/library").Decimal;
            lateReturnRate: import("@prisma/client/runtime/library").Decimal;
            complaintRate: import("@prisma/client/runtime/library").Decimal;
            responseTimeScore: import("@prisma/client/runtime/library").Decimal;
            verificationLevel: string;
        } | null;
    }>;
    deleteUser(id: string, user?: {
        sub: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
        };
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
            itemPrice: import("@prisma/client/runtime/library").Decimal;
            depositAmount: import("@prisma/client/runtime/library").Decimal;
            pickupMethod: import(".prisma/client").$Enums.PickupMethod;
            pickupWindow: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        renterId: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        totalDeposit: import("@prisma/client/runtime/library").Decimal;
        logisticsScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
        reliabilityScoreSnapshot: import("@prisma/client/runtime/library").Decimal;
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
        tags: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
}
