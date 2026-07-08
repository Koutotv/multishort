import { NextRequest, NextResponse } from "next/server";
import { fetchPlatformAnalytics } from "@/lib/platforms/providers";
import { listPublications, storeSnapshot } from "@/lib/platforms/store";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { videoId?: string };
  if (!body.videoId) {
    return NextResponse.json({ error: "videoId manquant" }, { status: 400 });
  }

  const publications = await listPublications(body.videoId);
  const snapshots = [];

  for (const publication of publications) {
    const metrics = await fetchPlatformAnalytics(publication.platform, publication.id);
    const snapshot = {
      publicationId: publication.id,
      views: metrics.views,
      likes: metrics.likes,
      comments: metrics.comments,
      shares: metrics.shares,
      engagementRate: metrics.engagementRate,
      syncedAt: new Date().toISOString(),
    };
    await storeSnapshot(snapshot);
    snapshots.push({
      platform: publication.platform,
      publishedUrl: publication.publishedUrl,
      status: publication.status,
      ...snapshot,
    });
  }

  return NextResponse.json({ success: true, snapshots });
}
