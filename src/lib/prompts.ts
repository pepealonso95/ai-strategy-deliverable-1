import { readFile } from "node:fs/promises";
import path from "node:path";

const cache = new Map<string, string>();

export async function loadPrompt(name: string) {
  const cached = cache.get(name);
  if (cached) {
    return cached;
  }

  const fullPath = path.join(process.cwd(), "src", "prompts", `${name}.md`);
  const contents = await readFile(fullPath, "utf8");
  cache.set(name, contents);
  return contents;
}
