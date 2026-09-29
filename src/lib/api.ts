import axios from "axios";
import { API_URL } from "./config";

// Axios instance used in place of CR_Client's relative `/api/...` calls.
// The auth provider sets the bearer token and the 401 handler.
export const api = axios.create({ baseURL: API_URL });

let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url !== "/api/mobile/login") {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export function errorMessage(error: any, fallback = "Something went wrong") {
  return error?.response?.data?.error || error?.message || fallback;
}
