"use client";

import { PlatformCard } from "@/components/platforms/platform-card";
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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mes plateformes</h1>
        <p className="mt-1 text-slate-500">
          Connectez vos comptes pour publier automatiquement sur chaque
          plateforme
        </p>
      </div>

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
          Les connexions utilisent des API simulées pour le MVP. La structure
          est prête pour intégrer les vraies API OAuth de chaque plateforme.
        </p>
      </div>
    </div>
  );
}
