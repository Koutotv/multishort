import type { PlatformId } from "@/types";
import type {
  PlatformAnalyticsResult,
  PlatformConnector,
  PublishParams,
  PublishResult,
} from "./types";

const MOCK_URLS: Record<PlatformId, string> = {
  youtube: "https://youtube.com/shorts/",
  tiktok: "https://tiktok.com/@creator/video/",
  instagram: "https://instagram.com/reel/",
  spotify: "https://open.spotify.com/episode/",
  facebook: "https://facebook.com/reel/",
  twitter: "https://x.com/creator/status/",
};

function randomAnalytics(): PlatformAnalyticsResult {
  const views = Math.floor(Math.random() * 50000) + 1000;
  const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
  const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
  const shares = Math.floor(likes * (Math.random() * 0.2 + 0.05));
  const engagementRate = ((likes + comments + shares) / views) * 100;

  return { views, likes, comments, shares, engagementRate };
}

export function createMockConnector(platformId: PlatformId): PlatformConnector {
  return {
    id: platformId,

    async connect() {
      await delay(800);
      return {
        success: true,
        username: `@creator_${platformId.slice(0, 2)}`,
      };
    },

    async disconnect() {
      await delay(500);
      return { success: true };
    },

    async publishVideo(params: PublishParams): Promise<PublishResult> {
      await delay(1500);
      const shouldFail = Math.random() < 0.05;
      if (shouldFail) {
        return { success: false, error: "Erreur API simulée — réessayez plus tard" };
      }
      return {
        success: true,
        publishedUrl: `${MOCK_URLS[platformId]}${params.videoId}`,
      };
    },

    async getAnalytics() {
      await delay(600);
      return randomAnalytics();
    },
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
