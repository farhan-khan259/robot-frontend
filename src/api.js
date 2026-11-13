const base = import.meta.env.VITE_API_URL || "/api";
export async function api(
  path,
  { body, method = "GET", headers = {}, ...rest } = {},
) {
  const token = sessionStorage.getItem("rn_token");
  const response = await fetch(`${base}${path}`, {
    ...rest,
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (response.status === 401 && !path.startsWith("/auth/"))
      window.dispatchEvent(new Event("rn-session-expired"));
    throw new Error(data.message || "Request failed. Please try again.");
  }
  return response.json();
}
export async function proof(id) {
  const response = await fetch(`${base}/deposits/${id}/proof`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("rn_token")}` },
  });
  if (!response.ok) throw new Error("Unable to open payment proof");
  return URL.createObjectURL(await response.blob());
}
export const currency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  })
    .format((value || 0) / 100)
    .replace("PKR", "Rs");
export const date = (value) =>
  value
    ? new Date(value).toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Karachi",
      })
    : "—";

export async function downloadCsv(path, filename) {
  const response = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("rn_token")}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Unable to export the ledger");
  }
  const url = URL.createObjectURL(await response.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
