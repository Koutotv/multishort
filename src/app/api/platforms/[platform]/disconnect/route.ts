import { NextRequest, NextResponse } from "next/server";
import type { PlatformId } from "@/types";
import { disconnectConnection } from "@/lib/platforms/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: rawPlatform } = await params;
  const platform = rawPlatform as PlatformId;
  const body = (await request.json().catch(() => ({}))) as { userId?: string };
  const userId = body.userId ?? "demo-user";
  const connection = await disconnectConnection(userId, platform);

  return NextResponse.json({ success: true, connection });
}
