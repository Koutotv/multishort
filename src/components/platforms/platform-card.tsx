"use client";

import { useState } from "react";
import { useApp } from "@/contexts/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { PLATFORM_META } from "@/data/mock";
import type { PlatformId } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

export function PlatformCard({ platformId }: { platformId: PlatformId }) {
  const { platforms, connectPlatform, disconnectPlatform } = useApp();
  const platform = platforms.find((p) => p.id === platformId)!;
  const meta = PLATFORM_META[platformId];
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (platform.connected) {
        await disconnectPlatform(platformId);
      } else {
        await connectPlatform(platformId);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
        >
          <PlatformIcon platform={platformId} size="lg" />
        </div>
        <div className="flex items-center gap-1.5">
          {platform.connected ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Circle className="h-4 w-4 text-slate-300" />
          )}
          <span
            className={`text-xs font-medium ${
              platform.connected ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {platform.connected ? "Connecté" : "Non connecté"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-semibold text-slate-900">{meta.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
        {platform.username && (
          <p className="mt-2 text-sm font-medium text-violet-600">
            {platform.username}
          </p>
        )}
      </div>

      <Button
        variant={platform.connected ? "outline" : "primary"}
        className="mt-6 w-full"
        onClick={handleToggle}
        loading={loading}
      >
        {platform.connected ? "Déconnecter" : "Connecter"}
      </Button>
    </Card>
  );
}
