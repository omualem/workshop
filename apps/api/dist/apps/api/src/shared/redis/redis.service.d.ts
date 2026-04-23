import { OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
export declare class RedisService implements OnModuleDestroy {
    private readonly client;
    private readonly memoryFallback;
    private connectPromise;
    constructor(configService: ConfigService);
    private ensureConnected;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    ping(): Promise<"memory-fallback" | "PONG" | "unavailable">;
    onModuleDestroy(): Promise<void>;
}
