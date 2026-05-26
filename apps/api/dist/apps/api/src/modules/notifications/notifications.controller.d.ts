import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    me(user: {
        sub: string;
    }): import(".prisma/client").Prisma.PrismaPromise<{
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        titleHe: string;
        titleEn: string;
        createdAt: Date;
        userId: string;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        bodyHe: string;
        bodyEn: string;
        readAt: Date | null;
    }[]>;
}
