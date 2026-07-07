"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Video } from "@/types";
import { BarChart3, CalendarClock } from "lucide-react";

export function VideoCard({ video }: { video: Video }) {
  const isScheduled = video.status === "scheduled";

  return (
    <Card hover className="overflow-hidden p-0">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-40">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900 line-clamp-2">
                {video.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {isScheduled && video.scheduledAt ? (
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Planifiée le {formatDateTime(video.scheduledAt)}
                  </span>
                ) : (
                  formatDate(video.publishedAt)
                )}
              </p>
            </div>
            <StatusBadge status={video.status} />
          </div>

          <div className="mt-4 flex items-center gap-2">
            {video.platforms.map((p) => (
              <div
                key={p}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
              >
                <PlatformIcon platform={p} size="sm" />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Link href={`/videos/${video.id}`}>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4" />
                Voir analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
