import { PrismaService } from "../../prisma/prisma.service";
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    me(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        titleHe: string;
        titleEn: string;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        bodyHe: string;
        bodyEn: string;
        readAt: Date | null;
    }[]>;
}
