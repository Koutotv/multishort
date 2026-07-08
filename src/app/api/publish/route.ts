import { NextRequest, NextResponse } from "next/server";
import { publishToPlatform } from "@/lib/platforms/providers";
import { recordPublication } from "@/lib/platforms/store";
import type { PlatformAnalytics, PlatformId, PublishVideoInput } from "@/types";

type PublishPayload = PublishVideoInput & {
  userId?: string;
  videoId: string;
  videoUrl: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PublishPayload;
  const userId = body.userId ?? "demo-user";

  const analytics: PlatformAnalytics[] = [];

  for (const platform of body.platforms) {
    const result = await publishToPlatform(platform, {
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      videoId: body.videoId,
    });

    const publication = await recordPublication({
      userId,
      videoId: body.videoId,
      platform,
      remotePostId: result.success ? `${platform}-${body.videoId}` : undefined,
      publishedUrl: result.publishedUrl,
      status: result.success ? "published" : "error",
      publishedAt: result.success ? new Date().toISOString() : undefined,
      lastError: result.error,
    });

    analytics.push({
      platformId: platform as PlatformId,
      status: publication.status,
      views: result.success ? Math.floor(Math.random() * 50000) + 1000 : 0,
      likes: result.success ? Math.floor(Math.random() * 3000) + 50 : 0,
      comments: result.success ? Math.floor(Math.random() * 400) + 10 : 0,
      shares: result.success ? Math.floor(Math.random() * 700) + 10 : 0,
      engagementRate: result.success ? Number((Math.random() * 12 + 4).toFixed(1)) : 0,
      publishedUrl: publication.publishedUrl,
      errorMessage: publication.lastError,
    });
  }

  const hasError = analytics.some((item) => item.status === "error");
  const allPublished = analytics.every((item) => item.status === "published");

  return NextResponse.json({
    success: true,
    userId,
    analytics,
    status: hasError ? (allPublished ? "partial" : "error") : "published",
  });
}
