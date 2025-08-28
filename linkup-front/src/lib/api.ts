import { API_URL } from "../config";
import useAuthStore from "../store/useAuthStore";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit & { skipAuth?: boolean }
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${input}`;

  const headers = new Headers(init?.headers);
  if (!init?.skipAuth) {
    const token = useAuthStore.getState().user?.token;
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    let message = "";
    try {
      const contentType = res.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const errJson = await res.json().catch(() => null);
        if (errJson?.message) {
          message = errJson.message;
        } else if (errJson) {
          message = JSON.stringify(errJson);
        }
      }
      if (!message) {
        message = await res.text().catch(() => "");
      }
    } catch {
      // Silently handle parsing errors
    }
    if (!message) {
      message = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(message);
  }

  const data = await res.json();
  return { success: true, data };
}

export function get<T>(
  url: string,
  options?: RequestInit & { skipAuth?: boolean }
) {
  return fetcher<T>(url, { ...options, method: "GET" });
}

export function post<T>(
  url: string,
  body: unknown,
  options?: RequestInit & { skipAuth?: boolean }
) {
  const headers = {
    "Content-Type": "application/json",
    ...(options && options.headers ? options.headers : {}),
  };
  return fetcher<T>(url, {
    ...options,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}
