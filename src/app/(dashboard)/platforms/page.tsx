"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlatformCard } from "@/components/platforms/platform-card";
import { useApp } from "@/contexts/app-context";
import type { PlatformId } from "@/types";

const platformIds: PlatformId[] = [
  "youtube",
  "tiktok",
  "instagram",
  "spotify",
  "facebook",
  "twitter",
];

export default function PlatformsPage() {
  const { refreshPlatformConnections } = useApp();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  useEffect(() => {
    void refreshPlatformConnections();
  }, [refreshPlatformConnections]);

  useEffect(() => {
    const success = searchParams.get("platformSuccess");
    const error = searchParams.get("platformError");
    if (success) {
      setMessage(success);
      setMessageTone("success");
    } else if (error) {
      setMessage(error);
      setMessageTone("error");
    } else {
      setMessage(null);
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mes plateformes</h1>
        <p className="mt-1 text-slate-500">
          Connectez vos comptes pour publier automatiquement sur chaque
          plateforme
        </p>
      </div>

      {message && (
        <div
          className={`rounded-2xl px-5 py-4 text-sm ${
            messageTone === "success"
              ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
        <p className="text-sm font-medium text-violet-900">
          Prochaine etape : liez vos reseaux pour commencer a publier partout.
        </p>
        <p className="mt-1 text-sm text-violet-700">
          Commencez par YouTube, TikTok, Instagram et Facebook, puis ajoutez les
          autres plateformes quand vous voulez.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platformIds.map((id) => (
          <PlatformCard key={id} platformId={id} />
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
        <p className="text-sm text-slate-500">
          Les cartes utilisent maintenant un vrai flow OAuth côté serveur quand
          les clés développeur sont configurées. Sans configuration complète,
          elles affichent un statut de setup requis.
        </p>
      </div>
    </div>
  );
}
