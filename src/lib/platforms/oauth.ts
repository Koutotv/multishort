import crypto from "node:crypto";
import type { PlatformId } from "@/types";
import { getCallbackUrl, getProviderConfig } from "./config";

export interface OAuthStatePayload {
  platform: PlatformId;
  userId: string;
  returnTo?: string;
}

export function createOAuthState(payload: OAuthStatePayload) {
  const raw = JSON.stringify({
    ...payload,
    nonce: crypto.randomUUID(),
    createdAt: Date.now(),
  });
  return Buffer.from(raw).toString("base64url");
}

export function parseOAuthState(state: string): OAuthStatePayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    return {
      platform: parsed.platform,
      userId: parsed.userId,
      returnTo: parsed.returnTo,
    } as OAuthStatePayload;
  } catch {
    return null;
  }
}

export function buildAuthorizationUrl(
  platform: PlatformId,
  userId: string,
  returnTo = "/platforms"
) {
  const provider = getProviderConfig(platform);
  if (!provider.authUrl || !provider.clientId) return null;

  const state = createOAuthState({ platform, userId, returnTo });
  const callbackUrl = getCallbackUrl(platform);
  const params = new URLSearchParams();

  if (platform === "youtube") {
    params.set("client_id", provider.clientId);
    params.set("redirect_uri", callbackUrl);
    params.set("response_type", "code");
    params.set("access_type", "offline");
    params.set("prompt", "consent");
    params.set("scope", provider.scopes.join(" "));
    params.set("state", state);
  } else if (platform === "tiktok") {
    params.set("client_key", provider.clientId);
    params.set("redirect_uri", callbackUrl);
    params.set("response_type", "code");
    params.set("scope", provider.scopes.join(","));
    params.set("state", state);
  } else if (platform === "instagram" || platform === "facebook") {
    params.set("client_id", provider.clientId);
    params.set("redirect_uri", callbackUrl);
    params.set("response_type", "code");
    params.set("scope", provider.scopes.join(","));
    params.set("state", state);
  }

  return `${provider.authUrl}?${params.toString()}`;
}
