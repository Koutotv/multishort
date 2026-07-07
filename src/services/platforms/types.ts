import type { PlatformId } from "@/types";

export interface PlatformConnector {
  id: PlatformId;
  connect(): Promise<{ success: boolean; username?: string; error?: string }>;
  disconnect(): Promise<{ success: boolean; error?: string }>;
  publishVideo(params: PublishParams): Promise<PublishResult>;
  getAnalytics(videoId: string): Promise<PlatformAnalyticsResult | null>;
}

export interface PublishParams {
  videoId: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
}

export interface PublishResult {
  success: boolean;
  publishedUrl?: string;
  error?: string;
}

export interface PlatformAnalyticsResult {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}
