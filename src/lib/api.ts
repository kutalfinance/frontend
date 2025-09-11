import ky from "ky";
import { toast } from "sonner";

import { API_URL } from "./config";
import { authToken } from "./auth-token";

export const api = ky.extend({
  prefixUrl: `${API_URL}/api/v1`,
  timeout: 1000 * 60,
  hooks: {
    beforeRequest: [
      (request) => {
        const authHeader = authToken.getAuthHeader();
        if (authHeader) {
          request.headers.set("Authorization", authHeader);
        }
      },
    ],
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
