import { StrictMode, startTransition } from "react";
import { HydratedRouter } from "react-router/dom";

import { hydrateRoot } from "react-dom/client";

// Leftovers from the removed offline mode: the persisted query cache (could be
// several MB of transactions parsed on every load) and the offline write queue.
try {
  localStorage.removeItem("kss-rq-cache");
  indexedDB?.deleteDatabase("kss-offline");
} catch {}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
