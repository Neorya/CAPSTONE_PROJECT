
// TODO is it correct to leave localhost here?
// TODO add file for environment variables
const API_BASE_URL = 'http://localhost:8000';

export async function getMatchSettings(filter: string) {
  // prepare value for the is_ready parameter of getMatchSettings
  let isReady;
  if (filter === "Ready") isReady = true;                        
  else if (filter === "Draft") isReady = false;
    const url = new URL("/api/match-settings", API_BASE_URL);
    if (isReady !== undefined) url.searchParams.set("is_ready", String(isReady));
    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  }