const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

async function request(path) {
  const response = await fetch(`${API_BASE}/${path.replace(/^\//, "")}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  return response.json();
}

export async function getList(path) {
  const payload = await request(path);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export async function getProfile() {
  return request("profile/");
}

export { API_BASE };
