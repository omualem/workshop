export type MapPreviewInput = {
  pickupPoints: Array<{ lat: number; lng: number; label: string }>;
  renterLocation?: { lat: number; lng: number; label: string };
};

export interface MapProviderAdapter {
  getStaticPreview(input: MapPreviewInput): Promise<{ imageUrl?: string; provider: string }>;
}

export class HaversineFallbackMapProvider implements MapProviderAdapter {
  async getStaticPreview() {
    return {
      provider: "fallback",
    };
  }
}

export const defaultMapProvider = new HaversineFallbackMapProvider();
