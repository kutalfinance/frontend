import { href, redirect } from "react-router";

import { queryClient } from "@/components/query-provider";

import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { UserRoles } from "@/lib/types";

import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [];
}

export async function clientLoader() {
  const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
  if (response?.data.role === UserRoles.ADMIN) {
    return redirect(href("/admin/users"));
  }

  return redirect(href("/agent"));
}

export default function Home() {
  return null;
}
