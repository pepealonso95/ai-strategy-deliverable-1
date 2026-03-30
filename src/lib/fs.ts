import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function ensureDir(relativePath: string) {
  await mkdir(path.join(process.cwd(), relativePath), { recursive: true });
}

export async function writeText(relativePath: string, contents: string) {
  const fullPath = path.join(process.cwd(), relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, contents, "utf8");
}

export async function readText(relativePath: string) {
  return readFile(path.join(process.cwd(), relativePath), "utf8");
}
