import { API_URL } from "../config";
import useAuthStore from "../store/useAuthStore";

const DEFAULT_TIMEOUT_MS = 10000; // 10초 기본 타임아웃

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit & { skipAuth?: boolean; timeoutMs?: number }
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${input}`;

  const headers = new Headers(init?.headers);
  if (!init?.skipAuth) {
    const token = useAuthStore.getState().user?.token;
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    init?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers, signal: controller.signal });
  } catch (err: unknown) {
    clearTimeout(timeout);
    const isAbortError = (e: unknown): e is { name: string } =>
      !!e &&
      typeof e === "object" &&
      "name" in e &&
      (e as { name: string }).name === "AbortError";
    if (isAbortError(err)) {
      throw new Error("요청 시간이 초과되었습니다.");
    }
    throw err instanceof Error
      ? err
      : new Error("네트워크 오류가 발생했습니다.");
  }
  clearTimeout(timeout);

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
      // ignore
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
  options?: RequestInit & { skipAuth?: boolean; timeoutMs?: number }
) {
  return fetcher<T>(url, { ...options, method: "GET" });
}

export function post<T>(
  url: string,
  body: unknown,
  options?: RequestInit & { skipAuth?: boolean; timeoutMs?: number }
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
