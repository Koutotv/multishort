export type PlatformId =
  | "youtube"
  | "tiktok"
  | "instagram"
  | "spotify"
  | "facebook"
  | "twitter";

export type PublicationStatus = "pending" | "published" | "error";

export type VideoStatus =
  | "pending"
  | "published"
  | "error"
  | "partial"
  | "scheduled";

export interface Platform {
  id: PlatformId;
  name: string;
  color: string;
  connected: boolean;
  username?: string;
}

export interface PlatformAnalytics {
  platformId: PlatformId;
  status: PublicationStatus;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  publishedUrl?: string;
  errorMessage?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  videoUrl: string;
  publishedAt: string;
  scheduledAt?: string;
  status: VideoStatus;
  platforms: PlatformId[];
  analytics: PlatformAnalytics[];
}

export interface PublishVideoInput {
  title: string;
  description: string;
  tags: string[];
  platforms: PlatformId[];
  videoFile?: File;
  thumbnail?: string;
  scheduledAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}
