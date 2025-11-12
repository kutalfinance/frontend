import { toast } from "sonner";

export function successToast(description: string) {
  toast.success("Success", { description });
}

export async function errorToast(err: any) {
  const errResponse = await err.response?.json();

  // TODO: Remove console log in production
  console.log("API Error:", errResponse);

  const title = "Error"; // errResponse?.title ?? "Error";
  const description = errResponse?.detail ?? "Something went wrong. Please try again";
  toast.error(title, { description });
}

/**
 * Centralized query keys factory for React Query
 * Provides consistent, type-safe query keys across the application
 */
export const queryKeys = {
  // Auth related queries
  auth: {
    check: () => ["auth", "check"] as const,
    user: () => ["auth", "user"] as const,
    me: () => ["auth", "me"] as const,
  },

  // Users queries
  users: {
    all: () => ["users"],
    filters: (filters?: Record<string, unknown>) => ["users", filters] as const,
    detail: (id: string) => ["users", id] as const,
    me: () => ["users", "me"] as const,
  },

  // Customers queries
  customers: {
    all: () => ["customers"],
    filters: (filters?: Record<string, unknown>) => ["customers", filters],
    detail: (id: string) => ["customers", id],
  },

  // Contributions queries
  contributions: {
    metrics: (searchParams?: Record<string, unknown>) =>
      ["contributions", "metrics", searchParams] as const,
    all: () => ["contributions"] as const,
    filters: (filters?: Record<string, unknown>) => ["contributions", filters] as const,
  },

  // Branches queries
  branches: {
    all: () => ["branches"],
    filters: (filters?: Record<string, unknown>) => ["branches", filters],
    detail: (id: string) => ["branches", id] as const,
    withCustomers: (id: string) => ["branches", id, "customers"] as const,
  },

  // Metrics queries
  metrics: {
    admin: () => ["metrics", "admin"] as const,
    agent: () => ["metrics", "agent"] as const,
  },

  // Generic utility for creating scoped keys
  scoped: (scope: string) => ({
    all: () => [scope] as const,
    detail: (id: string) => [scope, id] as const,
    filtered: (filters: Record<string, unknown>) => [scope, "filtered", filters] as const,
  }),
} as const;

// Type helpers for query key inference
export type QueryKeys = typeof queryKeys;
export type AuthQueryKeys = QueryKeys["auth"];
export type UsersQueryKeys = QueryKeys["users"];
export type CustomersQueryKeys = QueryKeys["customers"];
export type BranchesQueryKeys = QueryKeys["branches"];

// Helper function to get all query keys for a specific scope (useful for invalidation)
export const getQueryKeysForScope = (scope: keyof typeof queryKeys) => {
  return queryKeys[scope];
};

// Helper function to invalidate all queries for a specific entity
export const invalidationHelpers = {
  customers: {
    all: () => queryKeys.customers.all(),
    related: () => [queryKeys.customers.all(), queryKeys.branches.all()] as const,
  },
  users: {
    all: () => queryKeys.users.all(),
    related: () => [queryKeys.users.all(), queryKeys.auth.me()] as const,
  },
  branches: {
    all: () => queryKeys.branches.all(),
    related: () => [queryKeys.branches.all(), queryKeys.customers.all()] as const,
  },
  contributions: {
    all: () => queryKeys.contributions.all(),
    related: () => [queryKeys.contributions.all(), queryKeys.customers.all()] as const,
  },
};
