import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    me(user: {
        sub: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
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
