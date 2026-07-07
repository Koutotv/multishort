"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { PLATFORM_META } from "@/data/mock";
import {
  generateHashtags,
  mergeTags,
  parseTagsInput,
} from "@/services/hashtags";
import { cn, toDatetimeLocalValue } from "@/lib/utils";
import type { PlatformId } from "@/types";
import {
  Upload,
  Check,
  Film,
  Sparkles,
  CalendarClock,
  Clock,
  X,
} from "lucide-react";

const SCHEDULE_PRESETS = [
  { label: "Dans 1 h", hours: 1 },
  { label: "Dans 3 h", hours: 3 },
  { label: "Demain 9 h", tomorrow9am: true },
  { label: "Dans 24 h", hours: 24 },
] as const;

export default function PublishPage() {
  const { platforms, publishVideo } = useApp();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingTags, setGeneratingTags] = useState(false);

  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const connectedPlatforms = platforms.filter((p) => p.connected);
  const currentTags = parseTagsInput(tags);

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleGenerateHashtags = async () => {
    if (!title.trim() && !description.trim()) return;
    setGeneratingTags(true);
    try {
      const suggestions = await generateHashtags(
        title,
        description,
        selectedPlatforms.length > 0 ? selectedPlatforms : undefined
      );
      setSuggestedTags(suggestions);
    } finally {
      setGeneratingTags(false);
    }
  };

  const addTag = (tag: string) => {
    const merged = mergeTags(currentTags, [tag]);
    setTags(merged.join(" "));
    setSuggestedTags((prev) => prev.filter((t) => t !== tag));
  };

  const removeTag = (tag: string) => {
    setTags(currentTags.filter((t) => t !== tag).join(" "));
  };

  const applyAllSuggestions = () => {
    const merged = mergeTags(currentTags, suggestedTags);
    setTags(merged.join(" "));
    setSuggestedTags([]);
  };

  const applyPreset = (preset: (typeof SCHEDULE_PRESETS)[number]) => {
    const date = new Date();
    if ("tomorrow9am" in preset && preset.tomorrow9am) {
      date.setDate(date.getDate() + 1);
      date.setHours(9, 0, 0, 0);
    } else if ("hours" in preset) {
      date.setHours(date.getHours() + preset.hours);
    }
    setScheduledAt(toDatetimeLocalValue(date));
    setScheduleEnabled(true);
  };

  const handlePublish = async () => {
    if (!title || selectedPlatforms.length === 0) return;

    if (scheduleEnabled) {
      if (!scheduledAt) return;
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate <= new Date()) return;
    }

    setLoading(true);
    await publishVideo({
      title,
      description,
      tags: parseTagsInput(tags),
      platforms: selectedPlatforms,
      thumbnail: videoPreview ?? undefined,
      scheduledAt: scheduleEnabled ? new Date(scheduledAt).toISOString() : undefined,
    });
    setLoading(false);
    router.push("/videos");
  };

  const scheduledDateInvalid =
    scheduleEnabled &&
    scheduledAt &&
    new Date(scheduledAt) <= new Date();

  const canSubmit =
    title &&
    selectedPlatforms.length > 0 &&
    (!scheduleEnabled || (scheduledAt && !scheduledDateInvalid));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publier une vidéo</h1>
        <p className="mt-1 text-slate-500">
          Uploadez, remplissez les infos, choisissez vos plateformes et publiez
        </p>
      </div>

      <Card>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors",
            dragOver
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
          )}
        >
          {videoPreview ? (
            <div className="flex flex-col items-center gap-3">
              <Film className="h-12 w-12 text-violet-600" />
              <p className="text-sm font-medium text-slate-700">
                Vidéo sélectionnée
              </p>
              <label className="cursor-pointer text-sm text-violet-600 hover:text-violet-700">
                Changer de vidéo
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                Glissez votre vidéo ici
              </p>
              <p className="mt-1 text-xs text-slate-400">
                ou cliquez pour parcourir
              </p>
              <label className="mt-4 cursor-pointer">
                <span className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                  Choisir un fichier
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
            </>
          )}
        </div>
      </Card>

      <Card className="space-y-5">
        <Input
          id="title"
          label="Titre"
          placeholder="Le titre de votre vidéo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          id="description"
          label="Description"
          placeholder="Décrivez votre vidéo..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-slate-700"
            >
              Tags / Hashtags
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateHashtags}
              loading={generatingTags}
              disabled={!title.trim() && !description.trim()}
            >
              <Sparkles className="h-4 w-4" />
              Générer automatiquement
            </Button>
          </div>

          <Input
            id="tags"
            placeholder="#creator #viral #tips"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {currentTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full p-0.5 hover:bg-violet-100"
                    aria-label={`Retirer ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {suggestedTags.length > 0 && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                  Suggestions générées
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={applyAllSuggestions}
                  className="text-violet-600"
                >
                  Tout ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!title.trim() && !description.trim() && (
            <p className="text-xs text-slate-400">
              Remplissez le titre ou la description pour générer des hashtags
            </p>
          )}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Planification automatique
              </h3>
              <p className="text-sm text-slate-500">
                Publiez maintenant ou programmez pour plus tard
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={scheduleEnabled}
            onClick={() => setScheduleEnabled(!scheduleEnabled)}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors",
              scheduleEnabled ? "bg-violet-600" : "bg-slate-300"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                scheduleEnabled ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {scheduleEnabled && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div>
              <label
                htmlFor="scheduledAt"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Date et heure de publication
              </label>
              <input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                min={toDatetimeLocalValue(new Date())}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              {scheduledDateInvalid && (
                <p className="mt-1.5 text-xs text-red-500">
                  Choisissez une date et heure dans le futur
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">
                Raccourcis
              </p>
              <div className="flex flex-wrap gap-2">
                {SCHEDULE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-slate-900">
          Plateformes de publication
        </h3>
        {connectedPlatforms.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucune plateforme connectée.{" "}
            <a href="/platforms" className="text-violet-600 hover:underline">
              Connectez vos comptes
            </a>
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {connectedPlatforms.map((platform) => {
              const selected = selectedPlatforms.includes(platform.id);
              const meta = PLATFORM_META[platform.id];
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    selected
                      ? "border-violet-300 bg-violet-50 ring-2 ring-violet-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      color: meta.color,
                    }}
                  >
                    <PlatformIcon platform={platform.id} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{meta.name}</p>
                    <p className="text-xs text-slate-500">{platform.username}</p>
                  </div>
                  {selected && (
                    <Check className="h-5 w-5 text-violet-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handlePublish}
        loading={loading}
        disabled={!canSubmit}
      >
        {scheduleEnabled ? (
          <>
            <CalendarClock className="h-5 w-5" />
            Planifier la publication
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            Publier partout
          </>
        )}
      </Button>
    </div>
  );
}
