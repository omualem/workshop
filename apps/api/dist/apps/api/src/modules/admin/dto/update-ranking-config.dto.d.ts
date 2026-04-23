declare class WeightDto {
    price: number;
    reliability: number;
    logistics: number;
    availability: number;
    quality: number;
}
export declare class UpdateRankingConfigDto {
    presetKey: string;
    displayNameHe: string;
    weights: WeightDto;
}
export {};
