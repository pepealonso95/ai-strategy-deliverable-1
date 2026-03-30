export function parseJsonl<T>(contents: string): T[] {
  return contents
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

export function stringifyJsonl(items: unknown[]) {
  return items.map((item) => JSON.stringify(item)).join("\n");
}
