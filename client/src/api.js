const BASE = import.meta.env.VITE_API_URL || "/api";
export async function api(path, options = {}) {
  const token = sessionStorage.getItem("esgrow-token");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const json = await res
    .json()
    .catch(() => ({ message: "The server returned an unexpected response." }));
  if (!res.ok)
    throw new Error(json.message || "Something went wrong. Please try again.");
  return json.data;
}
export const post = (path, data) =>
  api(path, { method: "POST", body: JSON.stringify(data) });
