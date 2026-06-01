import { StrictMode, startTransition } from "react";
import { HydratedRouter } from "react-router/dom";

import { hydrateRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
