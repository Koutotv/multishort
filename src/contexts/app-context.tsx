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
import { getPlatformConnector } from "@/services/platforms";
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
  videos: Video[];
  publishVideo: (input: PublishVideoInput) => Promise<void>;
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

  const connectPlatform = useCallback(async (id: PlatformId) => {
    const connector = getPlatformConnector(id);
    if (!connector) return;

    const result = await connector.connect();
    if (result.success) {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, connected: true, username: result.username }
            : p
        )
      );
    }
  }, []);

  const disconnectPlatform = useCallback(async (id: PlatformId) => {
    const connector = getPlatformConnector(id);
    if (!connector) return;

    const result = await connector.disconnect();
    if (result.success) {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, connected: false, username: undefined }
            : p
        )
      );
    }
  }, []);

  const runPublication = useCallback(async (video: Video) => {
    const thumbnail = video.thumbnail;

    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id ? { ...v, status: "pending" as const } : v
      )
    );

    for (const platformId of video.platforms) {
      const connector = getPlatformConnector(platformId);
      if (!connector) continue;

      const result = await connector.publishVideo({
        videoId: video.id,
        title: video.title,
        description: video.description,
        tags: video.tags,
        videoUrl: thumbnail,
      });

      setVideos((prev) =>
        prev.map((v) => {
          if (v.id !== video.id) return v;
          const updatedAnalytics = v.analytics.map((a) => {
            if (a.platformId !== platformId) return a;
            if (result.success) {
              const mockData = {
                views: Math.floor(Math.random() * 30000) + 500,
                likes: Math.floor(Math.random() * 3000) + 50,
                comments: Math.floor(Math.random() * 300) + 10,
                shares: Math.floor(Math.random() * 500) + 5,
              };
              const engagementRate =
                ((mockData.likes + mockData.comments + mockData.shares) /
                  mockData.views) *
                100;
              return {
                ...a,
                status: "published" as const,
                ...mockData,
                engagementRate,
                publishedUrl: result.publishedUrl,
              };
            }
            return {
              ...a,
              status: "error" as const,
              errorMessage: result.error,
            };
          });

          const hasError = updatedAnalytics.some((a) => a.status === "error");
          const allPublished = updatedAnalytics.every(
            (a) => a.status === "published"
          );

          return {
            ...v,
            analytics: updatedAnalytics,
            status: hasError
              ? allPublished
                ? ("partial" as const)
                : ("error" as const)
              : ("published" as const),
            publishedAt: new Date().toISOString(),
            scheduledAt: undefined,
          };
        })
      );
    }
  }, []);

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
        videos,
        publishVideo,
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
