import type { BasePreferenceProfile, OptimizerRequest, PreferenceSliders, ResolvedOptimizerPreferences } from "./bundle-optimizer.types";
export declare const PREFERENCE_SLIDER_TEMPLATES: Record<BasePreferenceProfile, PreferenceSliders>;
export declare class PreferenceMappingService {
    resolvePreferences(input: Pick<OptimizerRequest, "preferenceProfile" | "basePreferenceProfile" | "preferenceSliders">): ResolvedOptimizerPreferences;
    private resolveProfile;
}
