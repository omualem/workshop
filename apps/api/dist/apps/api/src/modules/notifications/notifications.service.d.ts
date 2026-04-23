import { PrismaService } from "../../prisma/prisma.service";
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    me(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        userId: string;
        titleHe: string;
        titleEn: string;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        bodyHe: string;
        bodyEn: string;
        readAt: Date | null;
    }[]>;
}
