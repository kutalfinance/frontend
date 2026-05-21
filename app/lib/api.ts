import ky from "ky";
import { toast } from "sonner";

import { authToken } from "./auth-token";
import { API_URL } from "./config";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
const RETRYABLE_STATUS_CODES = [503, 504];

export const api = ky.extend({
  prefixUrl: `${API_URL}/api/v1`,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 1000 * 60,
  retry: {
    limit: 2,
    methods: SAFE_METHODS,
    statusCodes: RETRYABLE_STATUS_CODES,
    backoffLimit: 3000,
  },
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
