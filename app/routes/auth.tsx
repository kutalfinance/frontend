import { type MetaFunction, Outlet } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "Sign In" }];
};

export default function AuthLayout() {
  return (
    <div className="mx-auto grid min-h-[90dvh] w-full max-w-md place-items-center">
      <div className="bg-card w-full space-y-8 rounded-md pt-20 pb-24 sm:px-10">
        <Outlet />
      </div>
    </div>
  );
}
