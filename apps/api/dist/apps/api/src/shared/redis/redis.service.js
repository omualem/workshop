"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = class RedisService {
    client;
    memoryFallback = new Map();
    connectPromise = null;
    constructor(configService) {
        const url = configService.get("REDIS_URL");
        this.client = url ? new ioredis_1.default(url, { lazyConnect: true, maxRetriesPerRequest: 1 }) : null;
    }
    async ensureConnected() {
        if (!this.client) {
            return false;
        }
        if (this.client.status === "ready") {
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
        return this.client.status === "ready";
    }
    async get(key) {
        if (!(await this.ensureConnected())) {
            return this.memoryFallback.get(key) ?? null;
        }
        try {
            return await this.client.get(key);
        }
        catch {
            return this.memoryFallback.get(key) ?? null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!(await this.ensureConnected())) {
            this.memoryFallback.set(key, value);
            return;
        }
        try {
            if (ttlSeconds) {
                await this.client.set(key, value, "EX", ttlSeconds);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch {
            this.memoryFallback.set(key, value);
        }
    }
    async ping() {
        if (!(await this.ensureConnected())) {
            return "memory-fallback";
        }
        try {
            return await this.client.ping();
        }
        catch {
            return "unavailable";
        }
    }
    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map