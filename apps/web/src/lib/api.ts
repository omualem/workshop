import type { BundleSearchInput } from "@rental/types";
import type { LoginInput, RegisterInput } from "@rental/types";
import {
  demoAdminCatalogOptions,
  demoAdminCategories,
  demoAdminListings,
  demoBundleResults,
  demoCategories,
  demoListing,
  demoListings,
  demoOverview,
} from "./demo-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchJson<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
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

const demoListingsFallback = (query?: ListingsQuery): PaginatedListings => {
  const page = Math.max(1, parseInt(query?.page ?? "1", 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(query?.pageSize ?? "12", 10)));
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
  bundleResults: (id: string) => fetchJson(`/bundle-search/${id}/results`, undefined, demoBundleResults),
  adminOverview: () => fetchJson("/admin/overview", undefined, demoOverview),
  adminCatalogOptions: () => fetchJson("/admin/catalog/options", undefined, demoAdminCatalogOptions),
  adminCategories: () => fetchJson("/categories/admin/manage", undefined, demoAdminCategories),
  createAdminCategory: (input: Record<string, unknown>) =>
    fetchJson(
      "/categories/admin/manage",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      {
        id: `demo-category-${Date.now()}`,
        ...input,
        _count: { listings: 0 },
      },
    ),
  updateAdminCategory: (id: string, input: Record<string, unknown>) =>
    fetchJson(
      `/categories/admin/manage/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
      {
        id,
        ...input,
      },
    ),
  adminListings: (query?: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value) {
          params.set(key, value);
        }
      }
    }
    return fetchJson(`/admin/listings${params.toString() ? `?${params.toString()}` : ""}`, undefined, demoAdminListings);
  },
  createAdminListing: (input: Record<string, unknown>) =>
    fetchJson(
      "/admin/listings",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      {
        id: `demo-listing-${Date.now()}`,
        ...input,
      },
    ),
  updateAdminListing: (id: string, input: Record<string, unknown>) =>
    fetchJson(
      `/admin/listings/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
      {
        id,
        ...input,
      },
    ),
  createBundleSearch: (input: BundleSearchInput) =>
    fetchJson("/bundle-search", {
      method: "POST",
      body: JSON.stringify(input),
    }, demoBundleResults),
};
