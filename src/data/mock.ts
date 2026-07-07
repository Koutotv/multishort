import type { Platform, PlatformId, Video } from "@/types";

export const PLATFORM_META: Record<
  PlatformId,
  { name: string; color: string; description: string }
> = {
  youtube: {
    name: "YouTube Shorts",
    color: "#FF0000",
    description: "Publiez vos shorts sur YouTube",
  },
  tiktok: {
    name: "TikTok",
    color: "#000000",
    description: "Partagez sur TikTok",
  },
  instagram: {
    name: "Instagram Reels",
    color: "#E4405F",
    description: "Publiez vos Reels",
  },
  spotify: {
    name: "Spotify",
    color: "#1DB954",
    description: "Clips podcast et audio",
  },
  facebook: {
    name: "Facebook",
    color: "#1877F2",
    description: "Reels et vidéos Facebook",
  },
  twitter: {
    name: "X / Twitter",
    color: "#000000",
    description: "Vidéos courtes sur X",
  },
};

export const DEFAULT_PLATFORMS: Platform[] = [
  {
    id: "youtube",
    name: PLATFORM_META.youtube.name,
    color: PLATFORM_META.youtube.color,
    connected: true,
    username: "@creator_yt",
  },
  {
    id: "tiktok",
    name: PLATFORM_META.tiktok.name,
    color: PLATFORM_META.tiktok.color,
    connected: true,
    username: "@creator_tt",
  },
  {
    id: "instagram",
    name: PLATFORM_META.instagram.name,
    color: PLATFORM_META.instagram.color,
    connected: false,
  },
  {
    id: "spotify",
    name: PLATFORM_META.spotify.name,
    color: PLATFORM_META.spotify.color,
    connected: false,
  },
  {
    id: "facebook",
    name: PLATFORM_META.facebook.name,
    color: PLATFORM_META.facebook.color,
    connected: true,
    username: "Creator Page",
  },
  {
    id: "twitter",
    name: PLATFORM_META.twitter.name,
    color: PLATFORM_META.twitter.color,
    connected: false,
  },
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "5 astuces pour créer du contenu viral",
    description:
      "Découvrez mes 5 meilleures astuces pour booster votre engagement sur les réseaux sociaux.",
    tags: ["#contentcreator", "#viral", "#tips"],
    thumbnail:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=600&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=1200&fit=crop",
    publishedAt: "2026-07-01T14:30:00Z",
    status: "published",
    platforms: ["youtube", "tiktok", "facebook"],
    analytics: [
      {
        platformId: "youtube",
        status: "published",
        views: 45200,
        likes: 3200,
        comments: 412,
        shares: 890,
        engagementRate: 9.8,
        publishedUrl: "https://youtube.com/shorts/abc123",
      },
      {
        platformId: "tiktok",
        status: "published",
        views: 128000,
        likes: 12400,
        comments: 892,
        shares: 3400,
        engagementRate: 13.2,
        publishedUrl: "https://tiktok.com/@creator/video/123",
      },
      {
        platformId: "facebook",
        status: "published",
        views: 18500,
        likes: 980,
        comments: 156,
        shares: 234,
        engagementRate: 7.4,
        publishedUrl: "https://facebook.com/reel/456",
      },
    ],
  },
  {
    id: "2",
    title: "Mon setup de créateur en 2026",
    description: "Tour complet de mon bureau et de mon équipement vidéo.",
    tags: ["#setup", "#creator", "#gear"],
    thumbnail:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=600&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=1200&fit=crop",
    publishedAt: "2026-06-28T10:00:00Z",
    status: "partial",
    platforms: ["youtube", "instagram"],
    analytics: [
      {
        platformId: "youtube",
        status: "published",
        views: 23100,
        likes: 1890,
        comments: 234,
        shares: 456,
        engagementRate: 11.2,
        publishedUrl: "https://youtube.com/shorts/def456",
      },
      {
        platformId: "instagram",
        status: "error",
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        engagementRate: 0,
        errorMessage: "Token expiré — reconnectez Instagram",
      },
    ],
  },
  {
    id: "3",
    title: "Behind the scenes — tournage",
    description: "Les coulisses de ma dernière vidéo.",
    tags: ["#bts", "#filming"],
    thumbnail:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=600&fit=crop",
    videoUrl:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=1200&fit=crop",
    publishedAt: "2026-07-05T16:45:00Z",
    status: "pending",
    platforms: ["tiktok", "twitter"],
    analytics: [
      {
        platformId: "tiktok",
        status: "pending",
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        engagementRate: 0,
      },
      {
        platformId: "twitter",
        status: "pending",
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        engagementRate: 0,
      },
    ],
  },
];
