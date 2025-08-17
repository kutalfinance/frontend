import ky from "ky";
import { toast } from "sonner";

import { API_URL } from "./config";

export const api = ky.extend({
  credentials: "include",
  prefixUrl: `${API_URL}/api/v1`,
  timeout: 30000,
  hooks: {
    beforeError: [
      (error) => {
        if (error.name === "TimeoutError") {
          toast.error("Request timeout. Please try again later.");
        }

        return error;
      },
    ],
  },
});
