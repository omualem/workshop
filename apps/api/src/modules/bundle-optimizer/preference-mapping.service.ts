import { Injectable } from "@nestjs/common";
import type {
  BasePreferenceProfile,
  OptimizerRequest,
  PreferenceProfile,
  PreferenceSliders,
  ResolvedOptimizerPreferences,
} from "./bundle-optimizer.types";

export const PREFERENCE_SLIDER_TEMPLATES: Record<
  BasePreferenceProfile,
  PreferenceSliders
> = {
  balanced: {
    price: 7,
    distance: 7,
    reliability: 7,
    condition: 7,
    availability: 7,
    pickupSimplicity: 7,
  },
  cheapest: {
    price: 10,
    distance: 6,
    reliability: 5,
    condition: 4,
    availability: 7,
    pickupSimplicity: 5,
  },
  closest: {
    price: 5,
    distance: 10,
    reliability: 6,
    condition: 5,
    availability: 7,
    pickupSimplicity: 8,
  },
  minimalEffort: {
    price: 5,
    distance: 8,
    reliability: 7,
    condition: 6,
    availability: 8,
    pickupSimplicity: 10,
  },
  professional: {
    price: 4,
    distance: 5,
    reliability: 10,
    condition: 10,
    availability: 9,
    pickupSimplicity: 7,
  },
  highQuality: {
    price: 5,
    distance: 5,
    reliability: 8,
    condition: 10,
    availability: 8,
    pickupSimplicity: 6,
  },
};

@Injectable()
export class PreferenceMappingService {
  resolvePreferences(input: Pick<
    OptimizerRequest,
    "preferenceProfile" | "basePreferenceProfile" | "preferenceSliders"
  >): ResolvedOptimizerPreferences {
    const requestedProfile = input.preferenceProfile ?? "balanced";
    const baseProfile = input.basePreferenceProfile;
    const profile = this.resolveProfile(requestedProfile, input.preferenceSliders);
    const templateProfile =
      profile === "custom" ? baseProfile ?? "balanced" : profile;
    const sliders =
      input.preferenceSliders ??
      PREFERENCE_SLIDER_TEMPLATES[templateProfile] ??
      PREFERENCE_SLIDER_TEMPLATES.balanced;

    const sumCore =
      sliders.price +
      sliders.distance +
      sliders.reliability +
      sliders.condition +
      sliders.availability;

    const qualityMean =
      (sliders.reliability + sliders.condition + sliders.availability) / 3;

    return {
      profile,
      ...(profile === "custom" && baseProfile ? { baseProfile } : {}),
      sliders,
      weights: {
        price: sliders.price / sumCore,
        distance: sliders.distance / sumCore,
        reliability: sliders.reliability / sumCore,
        condition: sliders.condition / sumCore,
        availability: sliders.availability / sumCore,
      },
      penaltyWeights: {
        pickup: clamp(sliders.pickupSimplicity / 7),
        lowScore: {
          price: clamp(sliders.price / 7),
          distance: clamp(sliders.distance / 7),
          reliability: clamp(sliders.reliability / 7),
          condition: clamp(sliders.condition / 7),
          availability: clamp(sliders.availability / 7),
        },
        maxDistance: clamp(sliders.distance / 7),
        variance: clamp(
          1 +
            Math.max(
              0,
              Math.min(
                sliders.reliability,
                sliders.condition,
                sliders.availability,
              ) - 7,
            ) *
              0.05,
        ),
        bottleneck: clamp(1 + (qualityMean - 7) * 0.05),
      },
    };
  }

  private resolveProfile(
    requestedProfile: PreferenceProfile,
    sliders?: PreferenceSliders,
  ): PreferenceProfile {
    if (requestedProfile === "custom") return "custom";
    if (sliders !== undefined) return requestedProfile;
    return requestedProfile;
  }
}

function clamp(value: number): number {
  return Math.max(0.5, Math.min(1.75, value));
}
