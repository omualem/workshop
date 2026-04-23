import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis | null;
  private readonly memoryFallback = new Map<string, string>();
  private connectPromise: Promise<void> | null = null;

  constructor(configService: ConfigService) {
    const url = configService.get<string>("REDIS_URL");
    this.client = url ? new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 }) : null;
  }

  private async ensureConnected() {
    if (!this.client) {
      return false;
    }

    if ((this.client.status as string) === "ready") {
      return true;
    }

    if (!this.connectPromise) {
      this.connectPromise = this.client
        .connect()
        .catch(() => undefined)
        .finally(() => {
          this.connectPromise = null;
        });
    }

    await this.connectPromise;
    return (this.client.status as string) === "ready";
  }

  async get(key: string) {
    if (!(await this.ensureConnected())) {
      return this.memoryFallback.get(key) ?? null;
    }

    try {
      return await this.client!.get(key);
    } catch {
      return this.memoryFallback.get(key) ?? null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (!(await this.ensureConnected())) {
      this.memoryFallback.set(key, value);
      return;
    }

    try {
      if (ttlSeconds) {
        await this.client!.set(key, value, "EX", ttlSeconds);
      } else {
        await this.client!.set(key, value);
      }
    } catch {
      this.memoryFallback.set(key, value);
    }
  }

  async ping() {
    if (!(await this.ensureConnected())) {
      return "memory-fallback";
    }

    try {
      return await this.client!.ping();
    } catch {
      return "unavailable";
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }
}
