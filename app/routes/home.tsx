import { href, redirect } from "react-router";

import { queryClient } from "@/components/query-provider";

import { checkQueryOptions } from "@/hooks/auth/admin";
import { loggedInUserQueryOptions } from "@/hooks/auth/common";
import { UserRoles } from "@/lib/types";

import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [];
}

export async function clientLoader() {
  const check = await queryClient.ensureQueryData(checkQueryOptions);
  if (!check?.data) {
    return redirect(href("/initialize"));
  }

  const response = await queryClient.ensureQueryData(loggedInUserQueryOptions);
  if (response?.data.role === UserRoles.ADMIN) {
    return redirect(href("/admin"));
  }

  return redirect(href("/agent"));
}

export default function Home() {
  return null;
}
