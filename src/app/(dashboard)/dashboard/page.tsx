"use client";

import Link from "next/link";
import { useApp } from "@/contexts/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/videos/video-card";
import { formatNumber } from "@/lib/utils";
import {
  Upload,
  Link2,
  Video,
  Eye,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user, platforms, videos } = useApp();

  const connectedCount = platforms.filter((p) => p.connected).length;
  const publishedVideos = videos.filter((v) => v.status === "published").length;
  const totalViews = videos.reduce(
    (acc, v) =>
      acc + v.analytics.reduce((a, an) => a + an.views, 0),
    0
  );
  const avgEngagement =
    videos.length > 0
      ? videos.reduce(
          (acc, v) =>
            acc +
            v.analytics.reduce((a, an) => a + an.engagementRate, 0) /
              Math.max(v.analytics.length, 1),
          0
        ) / videos.length
      : 0;

  const stats = [
    {
      label: "Plateformes connectées",
      value: `${connectedCount}/${platforms.length}`,
      icon: Link2,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "Vidéos publiées",
      value: publishedVideos.toString(),
      icon: Video,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Vues totales",
      value: formatNumber(totalViews),
      icon: Eye,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Engagement moyen",
      value: `${avgEngagement.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Bonjour, {user?.fullName} 👋
        </h1>
        <p className="mt-1 text-slate-500">
          Voici un aperçu de votre activité MultiShort
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-violet-600 to-indigo-600 border-0 text-white">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Prêt à publier ?</h2>
            <p className="mt-1 text-violet-200">
              Uploadez une vidéo et publiez-la sur toutes vos plateformes
            </p>
          </div>
          <Link href="/publish">
            <Button
              variant="secondary"
              className="bg-white text-violet-700 hover:bg-violet-50"
            >
              <Upload className="h-4 w-4" />
              Publier une vidéo
            </Button>
          </Link>
        </div>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Vidéos récentes
          </h2>
          <Link href="/videos">
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {videos.slice(0, 3).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
