import type { FetchProvider, ParseMode, SourceDefinition, SourceSnapshot } from "@/src/lib/types";

export type SourceBundle = {
  source: SourceDefinition;
  snapshot: SourceSnapshot;
  previousSnapshot: SourceSnapshot | null;
  changed: boolean;
  collectionMode: "live" | "fixture" | "fallback";
  fetchProvider: FetchProvider;
  parseMode: ParseMode;
  fallbackReason: string | null;
  payload: {
    summary: string;
    urls: string[];
    extracted_items: Array<Record<string, unknown>>;
  };
};
