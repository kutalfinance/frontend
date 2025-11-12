import { queryOptions } from "@tanstack/react-query";
import z from "zod";

import { api } from "@/lib/api";
import type { APIResponse, AuditLog } from "@/lib/types";

export const validateAuditSearch = z
  .object({
    q: z.string(),
    loggedBefore: z.string(), // date-time
    loggedAfter: z.string(), // date-time
    sortBy: z.string(),
    sortDirection: z.enum(["asc", "desc"]),
    authorId: z.string(),
    authorName: z.string(),
    action: z.string(),
    entityType: z.string(),
    entityId: z.string(),
    description: z.string(),
    ipAddress: z.string(),
  })
  .partial();

export type AuditSearchParams = z.infer<typeof validateAuditSearch>;

export const listAuditlogsOptions = ({ searchParams }: { searchParams?: AuditSearchParams }) =>
  queryOptions({
    queryKey: ["audit", searchParams],
    queryFn: () => api.get("audit", { searchParams }).json<APIResponse<AuditLog[]>>(),
  });
