import { useEffect, useRef } from "react";

import { type MutatorDefs, Replicache, type ReplicacheOptions } from "replicache";

export function useReplicache<MD extends MutatorDefs>(options: ReplicacheOptions<MD>) {
  const ref = useRef<Replicache | null>(null);

  useEffect(() => {
    if (ref.current) return;

    ref.current = new Replicache(options);

    return () => {
      if (ref.current) {
        ref.current.close();
        ref.current = null;
      }
    };
  }, []);

  return ref.current;
}
