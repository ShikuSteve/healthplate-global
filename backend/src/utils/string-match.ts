import Fuse from "fuse.js";

export function pickBestMatchesFuse<T extends { label: string }>(
  items: T[],
  pattern: string,
  maxResults = 5,
  threshold = 0.3
): T[] {
  const fuse = new Fuse(items, {
    keys: ["label"],            // only match on the recipe label :contentReference[oaicite:4]{index=4}
    threshold:0.6,                // 0 = exact only; 1 = match anything :contentReference[oaicite:5]{index=5}
    includeScore: true,         // include score so results are sorted by best match :contentReference[oaicite:6]{index=6}
    ignoreLocation: true 

  });
  return fuse
    .search(pattern)            // perform the fuzzy search
    .slice(0, maxResults)       // take top N
    .map(res => res.item);      // extract the original items
}
