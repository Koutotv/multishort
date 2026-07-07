"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { PLATFORM_META } from "@/data/mock";
import { formatEngagement, formatNumber } from "@/lib/utils";
import type { PlatformAnalytics } from "@/types";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

export function AnalyticsCard({ analytics }: { analytics: PlatformAnalytics }) {
  const meta = PLATFORM_META[analytics.platformId];
  const maxViews = 150000;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
          >
            <PlatformIcon platform={analytics.platformId} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{meta.name}</h4>
            <StatusBadge status={analytics.status} />
          </div>
        </div>
        {analytics.publishedUrl && (
          <a
            href={analytics.publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700"
          >
            Voir <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {analytics.status === "error" && analytics.errorMessage && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {analytics.errorMessage}
        </p>
      )}

      {analytics.status === "published" && (
        <>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Vues</span>
              <span>{formatNumber(analytics.views)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((analytics.views / maxViews) * 100, 100)}%`,
                  backgroundColor: meta.color,
                }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric icon={Eye} label="Vues" value={formatNumber(analytics.views)} />
            <Metric icon={Heart} label="Likes" value={formatNumber(analytics.likes)} />
            <Metric
              icon={MessageCircle}
              label="Commentaires"
              value={formatNumber(analytics.comments)}
            />
            <Metric
              icon={Share2}
              label="Partages"
              value={formatNumber(analytics.shares)}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2">
            <TrendingUp className="h-4 w-4 text-violet-600" />
            <span className="text-sm text-slate-600">Engagement :</span>
            <span className="text-sm font-semibold text-violet-700">
              {formatEngagement(analytics.engagementRate)}
            </span>
          </div>
        </>
      )}

      {analytics.status === "pending" && (
        <p className="mt-4 text-sm text-slate-500">
          Publication en cours...
        </p>
      )}
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
