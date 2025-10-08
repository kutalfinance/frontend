import ky from "ky";
import axios, { type AxiosInstance } from "axios";
import { toast } from "sonner";

import { authToken } from "./auth-token";
import { API_URL } from "./config";

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

type Config = {
  logger: (message: string) => void;
  apiConfig: { baseURL: string; timeout: number };
};

const createAxiosClient = ({ logger, apiConfig }: Config): AxiosInstance => {
  const client: AxiosInstance = axios.create(apiConfig);

  client.interceptors.request.use(async (config) => {
    // config.withCredentials = true;
    config.validateStatus = (status) => status < 400;

    const token = authToken.getAuthHeader();

    if (!!token) config.headers["Authorization"] = token;

    return config;
  });

  client.interceptors.response.use(
    async (response) => {
      if (typeof window === "undefined") return response;

      if (!response) {
        logger("An error occurred. Please try again later.");
        return response;
      }

      /* if (response.status === 401) {
        logger("Unauthoried. Please login to continue.")
        return response
      } */

      return response;
    },
    (error) => {
      if (
        axios.isCancel(error) ||
        (error.code === "ECONNABORTED" && error.message.includes("timeout"))
      ) {
        logger("Request timeout. Please try again later.");
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const axiosApi = createAxiosClient({
  logger: (message: string) => toast.error(message),
  apiConfig: { baseURL: `${API_URL}/api/v1`, timeout: 1000 * 60 },
});
