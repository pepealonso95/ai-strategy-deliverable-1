import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().min(1).optional());

const EnvSchema = z.object({
  OPENAI_API_KEY: optionalString,
  OPENAI_MODEL: z.string().default("gpt-5.4-nano"),
  OPENAI_EVAL_GRADER_MODEL: z.string().default("gpt-5.4-nano"),
  CRON_SECRET: optionalString,
  BLOB_READ_WRITE_TOKEN: optionalString,
  POSTGRES_URL: optionalString,
  GITHUB_TOKEN: optionalString,
  FIRECRAWL_API_KEY: optionalString,
  PIPELINE_USE_FIXTURES: z
    .enum(["0", "1"])
    .optional()
    .transform((value) => value === "1"),
  REPORT_TIMEZONE: z.string().default("UTC"),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | null = null;
let envLoaded = false;

function loadDotEnvLocal() {
  if (envLoaded) {
    return;
  }

  envLoaded = true;
  const envPath = path.join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  const contents = readFileSync(envPath, "utf8");
  for (const rawLine of contents.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const normalizedValue =
      rawValue.startsWith('"') && rawValue.endsWith('"')
        ? rawValue.slice(1, -1)
        : rawValue.startsWith("'") && rawValue.endsWith("'")
          ? rawValue.slice(1, -1)
          : rawValue;

    if (!(key in process.env)) {
      process.env[key] = normalizedValue;
    }
  }
}

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  loadDotEnvLocal();
  cachedEnv = EnvSchema.parse(process.env);
  return cachedEnv;
}

export function hasOpenAIKey() {
  return Boolean(getEnv().OPENAI_API_KEY);
}

export function usingFixtureMode() {
  const env = getEnv();
  return env.PIPELINE_USE_FIXTURES || !env.OPENAI_API_KEY;
}
