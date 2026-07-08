import { NextRequest, NextResponse } from "next/server";
import type { PlatformId } from "@/types";
import { exchangeCodeForToken } from "@/lib/platforms/providers";
import { parseOAuthState } from "@/lib/platforms/oauth";
import { upsertConnection } from "@/lib/platforms/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: rawPlatform } = await params;
  const platform = rawPlatform as PlatformId;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const parsedState = state ? parseOAuthState(state) : null;
  const returnTo = parsedState?.returnTo ?? "/platforms";
  const userId = parsedState?.userId ?? "demo-user";

  if (!code) {
    return NextResponse.redirect(
      new URL(`${returnTo}?platformError=${encodeURIComponent("Code OAuth manquant.")}`, request.url)
    );
  }

  const tokenResult = await exchangeCodeForToken(platform, code);
  if (tokenResult.error) {
    await upsertConnection({
      userId,
      platform,
      status: "error",
      username: tokenResult.username,
      platformAccountId: tokenResult.platformAccountId,
      expiresAt: tokenResult.expiresAt,
      connectedAt: undefined,
      scopes: [],
      lastError: tokenResult.error,
    });
    return NextResponse.redirect(
      new URL(
        `${returnTo}?platformError=${encodeURIComponent(tokenResult.error)}`,
        request.url
      )
    );
  }

  await upsertConnection({
    userId,
    platform,
    status: "connected",
    username: tokenResult.username,
    platformAccountId: tokenResult.platformAccountId,
    expiresAt: tokenResult.expiresAt,
    connectedAt: new Date().toISOString(),
    scopes: [],
    lastError: undefined,
  });

  return NextResponse.redirect(
    new URL(
      `${returnTo}?platformSuccess=${encodeURIComponent(`${platform} connecté`)}`,
      request.url
    )
  );
}
