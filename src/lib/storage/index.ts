import { getEnv } from "@/src/lib/env";
import { FileStore } from "@/src/lib/storage/file-store";
import { PostgresStore } from "@/src/lib/storage/postgres-store";
import type { ArtifactStore, DataStore } from "@/src/lib/storage/types";

export function createStores(): {
  dataStore: DataStore;
  artifactStore: ArtifactStore;
} {
  const env = getEnv();

  if (env.POSTGRES_URL && env.BLOB_READ_WRITE_TOKEN) {
    const store = new PostgresStore();
    return {
      dataStore: store,
      artifactStore: store,
    };
  }

  const store = new FileStore();
  return {
    dataStore: store,
    artifactStore: store,
  };
}
