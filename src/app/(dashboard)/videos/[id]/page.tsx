"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/contexts/app-context";
import { AnalyticsCard } from "@/components/videos/analytics-card";
import { StatusBadge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime, formatNumber } from "@/lib/utils";
import { ArrowLeft, Eye, Heart, TrendingUp, CalendarClock } from "lucide-react";

export default function VideoAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getVideo } = useApp();
  const video = getVideo(id);

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-500">Vidéo introuvable</p>
        <Link href="/videos" className="mt-4">
          <Button variant="outline">Retour aux vidéos</Button>
        </Link>
      </div>
    );
  }

  const totalViews = video.analytics.reduce((a, an) => a + an.views, 0);
  const totalLikes = video.analytics.reduce((a, an) => a + an.likes, 0);
  const avgEngagement =
    video.analytics.length > 0
      ? video.analytics.reduce((a, an) => a + an.engagementRate, 0) /
        video.analytics.length
      : 0;

  return (
    <div className="space-y-8">
      <Link href="/videos">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" />
          Retour aux vidéos
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="relative aspect-[9/16] max-h-[500px] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900">{video.title}</h1>
              <StatusBadge status={video.status} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {video.status === "scheduled" && video.scheduledAt ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Planifiée le {formatDateTime(video.scheduledAt)}
                </span>
              ) : (
                <>Publié le {formatDate(video.publishedAt)}</>
              )}
            </p>
          </div>

          <p className="text-slate-600">{video.description}</p>

          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {video.platforms.map((p) => (
              <div
                key={p}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
              >
                <PlatformIcon platform={p} size="sm" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <SummaryStat icon={Eye} label="Vues totales" value={formatNumber(totalViews)} />
            <SummaryStat icon={Heart} label="Likes totaux" value={formatNumber(totalLikes)} />
            <SummaryStat
              icon={TrendingUp}
              label="Engagement moy."
              value={`${avgEngagement.toFixed(1)}%`}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Analytics par plateforme
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {video.analytics.map((a) => (
            <AnalyticsCard key={a.platformId} analytics={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
