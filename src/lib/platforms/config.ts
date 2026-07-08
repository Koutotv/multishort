import type { PlatformId } from "@/types";

export interface ProviderConfig {
  id: PlatformId;
  displayName: string;
  authUrl?: string;
  tokenUrl?: string;
  scopes: string[];
  clientId?: string;
  clientSecret?: string;
  supportsPublishing: boolean;
  supportsAnalytics: boolean;
}

const APP_URL =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export function getAppUrl() {
  return APP_URL.replace(/\/$/, "");
}

export function getCallbackUrl(platform: PlatformId) {
  return `${getAppUrl()}/api/platforms/${platform}/callback`;
}

export const providerConfigs: Record<PlatformId, ProviderConfig> = {
  youtube: {
    id: "youtube",
    displayName: "YouTube Shorts",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
    ],
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    supportsPublishing: true,
    supportsAnalytics: true,
  },
  tiktok: {
    id: "tiktok",
    displayName: "TikTok",
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    scopes: ["user.info.basic", "video.publish", "video.list"],
    clientId: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    supportsPublishing: true,
    supportsAnalytics: true,
  },
  instagram: {
    id: "instagram",
    displayName: "Instagram Reels",
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    scopes: [
      "instagram_basic",
      "instagram_content_publish",
      "instagram_manage_insights",
      "pages_show_list",
    ],
    clientId: process.env.META_CLIENT_ID,
    clientSecret: process.env.META_CLIENT_SECRET,
    supportsPublishing: true,
    supportsAnalytics: true,
  },
  facebook: {
    id: "facebook",
    displayName: "Facebook",
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    scopes: ["pages_show_list", "pages_read_engagement", "pages_manage_posts"],
    clientId: process.env.META_CLIENT_ID,
    clientSecret: process.env.META_CLIENT_SECRET,
    supportsPublishing: true,
    supportsAnalytics: true,
  },
  spotify: {
    id: "spotify",
    displayName: "Spotify",
    scopes: [],
    supportsPublishing: false,
    supportsAnalytics: false,
  },
  twitter: {
    id: "twitter",
    displayName: "X / Twitter",
    scopes: [],
    supportsPublishing: false,
    supportsAnalytics: false,
  },
};

export function getProviderConfig(platform: PlatformId) {
  return providerConfigs[platform];
}

export function isProviderConfigured(platform: PlatformId) {
  const provider = getProviderConfig(platform);
  if (!provider.authUrl || !provider.tokenUrl) return false;
  return Boolean(provider.clientId && provider.clientSecret);
}
