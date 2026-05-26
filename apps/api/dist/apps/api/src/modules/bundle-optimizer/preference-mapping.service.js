"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceMappingService = exports.PREFERENCE_SLIDER_TEMPLATES = void 0;
const common_1 = require("@nestjs/common");
exports.PREFERENCE_SLIDER_TEMPLATES = {
    balanced: {
        price: 7,
        distance: 7,
        reliability: 7,
        availability: 7,
        pickupSimplicity: 7,
    },
    cheapest: {
        price: 10,
        distance: 6,
        reliability: 5,
        availability: 7,
        pickupSimplicity: 5,
    },
    closest: {
        price: 5,
        distance: 10,
        reliability: 6,
        availability: 7,
        pickupSimplicity: 8,
    },
    minimalEffort: {
        price: 5,
        distance: 8,
        reliability: 7,
        availability: 8,
        pickupSimplicity: 10,
    },
    professional: {
        price: 4,
        distance: 5,
        reliability: 10,
        availability: 9,
        pickupSimplicity: 7,
    },
};
const ALGORITHM_DEFAULTS = {
    lambdaVariance: 0.35,
    alphaBottleneck: 0.25,
    betaPickup: 0.4,
    gammaMaxDistance: 0.15,
    alphaDistanceMix: 0.6,
    topKPerSlot: 30,
    beamWidth: 50,
};
let PreferenceMappingService = class PreferenceMappingService {
    resolvePreferences(input) {
        const requestedProfile = input.preferenceProfile ?? "balanced";
        const baseProfile = input.basePreferenceProfile;
        const profile = this.resolveProfile(requestedProfile, input.preferenceSliders);
        const templateProfile = profile === "custom" ? baseProfile ?? "balanced" : profile;
        const sliders = input.preferenceSliders ??
            exports.PREFERENCE_SLIDER_TEMPLATES[templateProfile] ??
            exports.PREFERENCE_SLIDER_TEMPLATES.balanced;
        const sumCore = sliders.price +
            sliders.distance +
            sliders.reliability +
            sliders.availability;
        const confidenceMean = (sliders.reliability + sliders.availability) / 2;
        return {
            profile,
            ...(profile === "custom" && baseProfile ? { baseProfile } : {}),
            sliders,
            weights: {
                price: sliders.price / sumCore,
                distance: sliders.distance / sumCore,
                reliability: sliders.reliability / sumCore,
                availability: sliders.availability / sumCore,
            },
            penaltyWeights: {
                pickup: clamp(sliders.pickupSimplicity / 7),
                lowScore: {
                    price: clamp(sliders.price / 7),
                    distance: clamp(sliders.distance / 7),
                    reliability: clamp(sliders.reliability / 7),
                    availability: clamp(sliders.availability / 7),
                },
                maxDistance: clamp(sliders.distance / 7),
                variance: clamp(1 +
                    Math.max(0, Math.min(sliders.reliability, sliders.availability) - 7) *
                        0.05),
                bottleneck: clamp(1 + (confidenceMean - 7) * 0.05),
            },
            ...ALGORITHM_DEFAULTS,
        };
    }
    resolveProfile(requestedProfile, sliders) {
        if (requestedProfile === "custom")
            return "custom";
        if (sliders !== undefined)
            return requestedProfile;
        return requestedProfile;
    }
};
exports.PreferenceMappingService = PreferenceMappingService;
exports.PreferenceMappingService = PreferenceMappingService = __decorate([
    (0, common_1.Injectable)()
], PreferenceMappingService);
function clamp(value) {
    return Math.max(0.5, Math.min(1.75, value));
}
//# sourceMappingURL=preference-mapping.service.js.map