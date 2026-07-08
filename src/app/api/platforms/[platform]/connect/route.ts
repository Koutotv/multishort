import { NextRequest, NextResponse } from "next/server";
import type { PlatformId } from "@/types";
import { buildAuthorizationUrl } from "@/lib/platforms/oauth";
import { getProviderConfig } from "@/lib/platforms/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: rawPlatform } = await params;
  const platform = rawPlatform as PlatformId;
  const userId = request.nextUrl.searchParams.get("userId") ?? "demo-user";
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? "/platforms";
  const provider = getProviderConfig(platform);

  const authUrl = buildAuthorizationUrl(platform, userId, returnTo);
  if (!authUrl) {
    const error = encodeURIComponent(
      `${provider.displayName} n'est pas encore configuré côté serveur.`
    );
    return NextResponse.redirect(new URL(`${returnTo}?platformError=${error}`, request.url));
  }

  return NextResponse.redirect(authUrl);
}
