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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleOptimizerController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const zod_validation_pipe_1 = require("../../shared/pipes/zod-validation.pipe");
const bundle_optimizer_service_1 = require("./bundle-optimizer.service");
const bundle_optimizer_types_1 = require("./bundle-optimizer.types");
let BundleOptimizerController = class BundleOptimizerController {
    optimizer;
    constructor(optimizer) {
        this.optimizer = optimizer;
    }
    search(body) {
        return this.optimizer.optimize(body);
    }
};
exports.BundleOptimizerController = BundleOptimizerController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("search"),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(bundle_optimizer_types_1.optimizerRequestSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BundleOptimizerController.prototype, "search", null);
exports.BundleOptimizerController = BundleOptimizerController = __decorate([
    (0, common_1.Controller)("bundle-optimizer"),
    __metadata("design:paramtypes", [bundle_optimizer_service_1.BundleOptimizerService])
], BundleOptimizerController);
//# sourceMappingURL=bundle-optimizer.controller.js.map