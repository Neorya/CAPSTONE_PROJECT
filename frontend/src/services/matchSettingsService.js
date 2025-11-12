import { API_BASE_URL } from "./config";

export async function fetchMatchSettings(filter) {
  // prepare value for the is_ready parameter of getMatchSettings
  let isReady;
  if (filter === "Ready") isReady = true;
  else if (filter === "Draft") isReady = false;
  const url = new URL("/api/match-settings", API_BASE_URL);
  if (isReady !== undefined) url.searchParams.set("is_ready", String(isReady));
  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error(`Failed to fetch match settings: ${res.statusText}`);
  return res.json();
}
