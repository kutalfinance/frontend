import { Loader } from "./loader";

export function HydrateFallback() {
  return (
    <div className="flex h-dvh w-screen items-center justify-center">
      <Loader />
    </div>
  );
}
