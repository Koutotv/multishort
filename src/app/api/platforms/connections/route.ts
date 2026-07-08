import { NextRequest, NextResponse } from "next/server";
import type { Platform, PlatformId } from "@/types";
import { DEFAULT_PLATFORMS } from "@/data/mock";
import { getProviderConfig, isProviderConfigured } from "@/lib/platforms/config";
import { listConnections } from "@/lib/platforms/store";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? "demo-user";
  const connections = await listConnections(userId);

  const platforms: Platform[] = DEFAULT_PLATFORMS.map((platform) => {
    const match = connections.find((item) => item.platform === platform.id);
    const configured = isProviderConfigured(platform.id);
    const provider = getProviderConfig(platform.id as PlatformId);

    return {
      ...platform,
      connected: match?.status === "connected",
      username: match?.username ?? platform.username,
      platformAccountId: match?.platformAccountId,
      status:
        match?.status ??
        (provider.supportsPublishing || provider.supportsAnalytics
          ? configured
            ? "disconnected"
            : "setup_required"
          : "setup_required"),
      lastError: match?.lastError,
      connectedAt: match?.connectedAt,
    };
  });

  return NextResponse.json({ platforms });
}
