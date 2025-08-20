import { Outlet } from "react-router";

import { AppHeader } from "@/components/app-header";

export default function DashLayout() {
  return (
    <>
      <AppHeader />

      <div className="container py-5">
        <Outlet />
      </div>
    </>
  );
}
