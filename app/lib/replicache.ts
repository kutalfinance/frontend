import { Replicache } from "replicache";

import { API_URL } from "./config";

export const rep = new Replicache({
  name: "customers",
  puller: async (req) => {
    console.log("puller", req);

    const res = await fetch(`${API_URL}/customer`);

    return {
      httpRequestInfo: {
        httpStatusCode: res.status,
        errorMessage: "",
      },
    };
  },
  pusher: async (req) => {
    console.log("pusher", req);

    const promises = req.mutations.map((m) =>
      fetch(`${API_URL}/sync/push`, {
        method: "POST",
        body: JSON.stringify(m),
        headers: { "Content-Type": "application/json" },
      })
    );
    const responses = await Promise.all(promises);
    return {
      httpRequestInfo: {
        httpStatusCode: responses[0].status,
        errorMessage: "",
      },
    };
  },

  mutators: {},
});
