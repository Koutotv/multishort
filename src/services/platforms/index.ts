import type { PlatformConnector } from "./types";
import { createMockConnector } from "./mock-connector";

const connectors: Record<string, PlatformConnector> = {
  youtube: createMockConnector("youtube"),
  tiktok: createMockConnector("tiktok"),
  instagram: createMockConnector("instagram"),
  spotify: createMockConnector("spotify"),
  facebook: createMockConnector("facebook"),
  twitter: createMockConnector("twitter"),
};

export function getPlatformConnector(platformId: string): PlatformConnector | null {
  return connectors[platformId] ?? null;
}

export function getAllConnectors(): PlatformConnector[] {
  return Object.values(connectors);
}
