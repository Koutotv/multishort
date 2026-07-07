"use client";

import Link from "next/link";
import { useApp } from "@/contexts/app-context";
import { VideoCard } from "@/components/videos/video-card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function VideosPage() {
  const { videos } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes vidéos</h1>
          <p className="mt-1 text-slate-500">
            {videos.length} vidéo{videos.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link href="/publish">
          <Button>
            <Upload className="h-4 w-4" />
            Nouvelle vidéo
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16">
          <p className="text-slate-500">Aucune vidéo pour le moment</p>
          <Link href="/publish" className="mt-4">
            <Button variant="outline">Publier votre première vidéo</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
