import type { BundleSearchInput } from "@rental/types";
import type { LoginInput, RegisterInput } from "@rental/types";
import {
  demoBundleResults,
  demoCategories,
  demoListing,
  demoListings,
} from "./demo-data";

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const API_URL =
  typeof window === "undefined"
    ? configuredApiUrl.replace("localhost", "127.0.0.1")
    : configuredApiUrl;

async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  fallback?: T,
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`API request failed for ${path}`);
  }
}

export type ListingsQuery = Record<string, string | undefined>;

export type PaginatedListings = {
  items: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AddressCityOption = {
  id: string;
  settlementCode: number;
  nameHe: string;
};

export type AddressStreetOption = {
  id: string;
  streetCode: number;
  nameHe: string;
};

const demoListingsFallback = (query?: ListingsQuery): PaginatedListings => {
  const page = Math.max(1, parseInt(query?.page ?? "1", 10));
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(query?.pageSize ?? "12", 10)),
  );
  const start = (page - 1) * pageSize;
  return {
    items: demoListings.slice(start, start + pageSize),
    total: demoListings.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(demoListings.length / pageSize)),
  };
};

export const api = {
  login: (input: LoginInput) =>
    fetchJson("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  register: (input: RegisterInput) =>
    fetchJson("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  categories: () => fetchJson("/categories", undefined, demoCategories),
  listing: (id: string) => fetchJson(`/listings/${id}`, undefined, demoListing),
  listingAvailability: (id: string, startDate: string, endDate: string) =>
    fetchJson<{ available: boolean; reason: string | null }>(
      `/listings/${id}/availability?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
    ),
  listings: (query?: ListingsQuery): Promise<PaginatedListings> => {
    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") params.set(key, value);
      }
    }
    const qs = params.toString();
    return fetchJson<PaginatedListings>(
      `/listings${qs ? `?${qs}` : ""}`,
      undefined,
      demoListingsFallback(query),
    );
  },
  bundleResults: (id: string) =>
    fetchJson(`/bundle-search/${id}/results`, undefined, demoBundleResults),
  adminOverview: () => fetchJson("/admin/overview"),
  adminUsers: () => fetchJson<any[]>("/admin/users"),
  adminModeration: () => fetchJson<any[]>("/admin/moderation"),
  adminBookings: () => fetchJson<any[]>("/admin/bookings"),
  adminDisputes: () => fetchJson<any[]>("/admin/disputes"),
  adminReviews: () => fetchJson<any[]>("/admin/reviews"),
  adminAuditLogs: () => fetchJson<any[]>("/admin/audit-logs"),
  adminRankingConfig: () => fetchJson<any[]>("/admin/ranking-config"),
  adminCatalogOptions: () =>
    fetchJson<{ categories: any[]; lenders: any[] }>("/admin/catalog/options"),
  adminCategories: () => fetchJson<any[]>("/categories/admin/manage"),
  createAdminCategory: (input: Record<string, unknown>) =>
    fetchJson<any>("/categories/admin/manage", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateAdminCategory: (id: string, input: Record<string, unknown>) =>
    fetchJson<any>(`/categories/admin/manage/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  adminListings: (query?: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value) {
          params.set(key, value);
        }
      }
    }
    return fetchJson<any[]>(
      `/admin/listings${params.toString() ? `?${params.toString()}` : ""}`,
    );
  },
  createAdminListing: (input: Record<string, unknown>) =>
    fetchJson<any>("/admin/listings", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateAdminListing: (id: string, input: Record<string, unknown>) =>
    fetchJson<any>(`/admin/listings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteAdminListing: (id: string) =>
    fetchJson<{ success: boolean; data: { id: string } }>(
      `/admin/listings/${id}`,
      {
        method: "DELETE",
      },
    ),
  createBundleSearch: (input: BundleSearchInput) =>
    fetchJson(
      "/bundle-search",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      demoBundleResults,
    ),
  optimizeBundle: (input: unknown) =>
    fetchJson<any>(
      "/bundle-optimizer/search",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    ),
  addressCities: (q = "", limit = 20) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("limit", String(limit));
    return fetchJson<{ success: boolean; data: AddressCityOption[] }>(
      `/addresses/cities?${params.toString()}`,
    ).then((response) => response.data);
  },
  addressStreets: ({
    cityId,
    settlementCode,
    q = "",
    limit = 20,
  }: {
    cityId?: string;
    settlementCode?: number;
    q?: string;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (cityId) params.set("cityId", cityId);
    if (settlementCode !== undefined) {
      params.set("settlementCode", String(settlementCode));
    }
    if (q) params.set("q", q);
    params.set("limit", String(limit));
    return fetchJson<{ success: boolean; data: AddressStreetOption[] }>(
      `/addresses/streets?${params.toString()}`,
    ).then((response) => response.data);
  },
  geocodeAddress: (input: {
    cityId: string;
    streetId: string;
    addressNumber: number;
  }) =>
    fetchJson<{
      success: boolean;
      data: {
        addressText: string;
        lat: number;
        lng: number;
        provider: string;
        cached: boolean;
      };
    }>("/addresses/geocode", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  // Autocomplete for the "specific listing" slot mode in the bundle builder.
  // No demo fallback — when the DB is empty, the UI shows a Hebrew empty state.
  searchListings: (q: string, limit = 10) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("limit", String(limit));
    return fetchJson<
      Array<{
        id: string;
        titleHe: string;
        titleEn: string;
        categoryId: string;
        category: { id: string; nameHe: string } | null;
        basePriceDaily: number | string;
        condition: string;
        city: string | null;
        lenderName: string | null;
        thumbnail: string | null;
      }>
    >(`/listings/search?${params.toString()}`, undefined, []);
  },
};
