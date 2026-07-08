import { NextRequest, NextResponse } from "next/server";
import type { PlatformId } from "@/types";
import { listConnections } from "@/lib/platforms/store";
import { isProviderConfigured } from "@/lib/platforms/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: rawPlatform } = await params;
  const platform = rawPlatform as PlatformId;
  const userId = request.nextUrl.searchParams.get("userId") ?? "demo-user";
  const connection = (await listConnections(userId)).find(
    (item) => item.platform === platform
  );

  return NextResponse.json({
    configured: isProviderConfigured(platform),
    connection: connection ?? null,
  });
}
