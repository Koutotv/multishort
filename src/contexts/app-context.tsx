"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_PLATFORMS, MOCK_VIDEOS } from "@/data/mock";
import type {
  Platform,
  PlatformAnalytics,
  PlatformId,
  PublishVideoInput,
  UserProfile,
  Video,
} from "@/types";

const DEMO_USER: UserProfile = {
  id: "demo-user",
  email: "demo@multishort.app",
  fullName: "Créateur Demo",
};

interface AppContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithProvider: (
    provider: "google" | "discord"
  ) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
  platforms: Platform[];
  connectPlatform: (id: PlatformId) => Promise<void>;
  disconnectPlatform: (id: PlatformId) => Promise<void>;
  refreshPlatformConnections: () => Promise<void>;
  videos: Video[];
  publishVideo: (input: PublishVideoInput) => Promise<void>;
  syncVideoAnalytics: (videoId: string) => Promise<void>;
  getVideo: (id: string) => Video | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "multishort-app-state";

interface StoredState {
  user: UserProfile | null;
  platforms: Platform[];
  videos: Video[];
}

function loadState(): StoredState {
  if (typeof window === "undefined") {
    return { user: null, platforms: DEFAULT_PLATFORMS, videos: MOCK_VIDEOS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    // ignore
  }
  return { user: null, platforms: DEFAULT_PLATFORMS, videos: MOCK_VIDEOS };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>(DEFAULT_PLATFORMS);
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [hydrated, setHydrated] = useState(false);
  const publishingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const state = loadState();
    setUser(state.user);
    setPlatforms(state.platforms);
    setVideos(state.videos);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, platforms, videos })
    );
  }, [user, platforms, videos, hydrated]);

  const refreshPlatformConnections = useCallback(async () => {
    if (!user) return;
    const response = await fetch(
      `/api/platforms/connections?userId=${encodeURIComponent(user.id)}`,
      { cache: "no-store" }
    );
    if (!response.ok) return;
    const data = (await response.json()) as { platforms: Platform[] };
    setPlatforms(data.platforms);
  }, [user]);

  useEffect(() => {
    if (!hydrated || !user) return;
    void refreshPlatformConnections();
  }, [hydrated, user, refreshPlatformConnections]);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (!email.includes("@")) {
      return { error: "Email invalide" };
    }
    setUser({
      id: "user-1",
      email,
      fullName: email.split("@")[0],
    });
    return {};
  }, []);

  const signInWithProvider = useCallback(
    async (provider: "google" | "discord") => {
      await new Promise((r) => setTimeout(r, 700));
      setUser({
        id: `user-${provider}`,
        email: `creator@${provider}.demo`,
        fullName: provider === "google" ? "Creator Google" : "Creator Discord",
      });
      return {};
    },
    []
  );

  const register = useCallback(
    async (email: string, _password: string, fullName: string) => {
      await new Promise((r) => setTimeout(r, 600));
      if (!email.includes("@")) {
        return { error: "Email invalide" };
      }
      setUser({ id: "user-1", email, fullName });
      return {};
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const connectPlatform = useCallback(
    async (id: PlatformId) => {
      const userId = user?.id ?? DEMO_USER.id;
      window.location.href = `/api/platforms/${id}/connect?userId=${encodeURIComponent(userId)}&returnTo=${encodeURIComponent("/platforms")}`;
    },
    [user]
  );

  const disconnectPlatform = useCallback(
    async (id: PlatformId) => {
      const userId = user?.id ?? DEMO_USER.id;
      const response = await fetch(`/api/platforms/${id}/disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        await refreshPlatformConnections();
      }
    },
    [refreshPlatformConnections, user]
  );

  const runPublication = useCallback(
    async (video: Video) => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id ? { ...v, status: "pending" as const } : v
        )
      );

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? DEMO_USER.id,
          videoId: video.id,
          title: video.title,
          description: video.description,
          tags: video.tags,
          platforms: video.platforms,
          videoUrl: video.thumbnail,
        }),
      });

      if (!response.ok) return;
      const data = (await response.json()) as {
        analytics: PlatformAnalytics[];
        status: Video["status"];
      };

      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id
            ? {
                ...v,
                analytics: data.analytics,
                status: data.status,
                publishedAt: new Date().toISOString(),
                scheduledAt: undefined,
              }
            : v
        )
      );
    },
    [user]
  );

  const publishVideo = useCallback(
    async (input: PublishVideoInput) => {
      const id = crypto.randomUUID();
      const thumbnail =
        input.thumbnail ??
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=600&fit=crop";

      const analytics: PlatformAnalytics[] = input.platforms.map(
        (platformId) => ({
          platformId,
          status: "pending" as const,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          engagementRate: 0,
        })
      );

      const isScheduled =
        input.scheduledAt && new Date(input.scheduledAt) > new Date();

      const newVideo: Video = {
        id,
        title: input.title,
        description: input.description,
        tags: input.tags,
        thumbnail,
        videoUrl: thumbnail,
        publishedAt: isScheduled
          ? input.scheduledAt!
          : new Date().toISOString(),
        scheduledAt: isScheduled ? input.scheduledAt : undefined,
        status: isScheduled ? "scheduled" : "pending",
        platforms: input.platforms,
        analytics,
      };

      setVideos((prev) => [newVideo, ...prev]);

      if (!isScheduled) {
        await runPublication(newVideo);
      }
    },
    [runPublication]
  );

  const syncVideoAnalytics = useCallback(async (videoId: string) => {
    const response = await fetch("/api/analytics/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as {
      snapshots: Array<{
        platform: PlatformId;
        views: number;
        likes: number;
        comments: number;
        shares: number;
        engagementRate: number;
        publishedUrl?: string;
        status: "pending" | "published" | "error";
      }>;
    };

    setVideos((prev) =>
      prev.map((video) =>
        video.id !== videoId
          ? video
          : {
              ...video,
              analytics: video.analytics.map((entry) => {
                const snapshot = data.snapshots.find(
                  (item) => item.platform === entry.platformId
                );
                if (!snapshot) return entry;
                return {
                  ...entry,
                  status: snapshot.status,
                  views: snapshot.views,
                  likes: snapshot.likes,
                  comments: snapshot.comments,
                  shares: snapshot.shares,
                  engagementRate: snapshot.engagementRate,
                  publishedUrl: snapshot.publishedUrl,
                };
              }),
            }
      )
    );
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const checkScheduled = () => {
      videos.forEach((video) => {
        if (
          video.status === "scheduled" &&
          video.scheduledAt &&
          new Date(video.scheduledAt) <= new Date() &&
          !publishingRef.current.has(video.id)
        ) {
          publishingRef.current.add(video.id);
          runPublication(video).finally(() => {
            publishingRef.current.delete(video.id);
          });
        }
      });
    };

    checkScheduled();
    const interval = setInterval(checkScheduled, 15000);
    return () => clearInterval(interval);
  }, [hydrated, videos, runPublication]);

  const getVideo = useCallback(
    (id: string) => videos.find((v) => v.id === id),
    [videos]
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDemoMode: true,
        login,
        signInWithProvider,
        register,
        logout,
        platforms,
        connectPlatform,
        disconnectPlatform,
        refreshPlatformConnections,
        videos,
        publishVideo,
        syncVideoAnalytics,
        getVideo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { DEMO_USER };
