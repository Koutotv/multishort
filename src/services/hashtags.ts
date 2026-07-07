import type { PlatformId } from "@/types";

const STOP_WORDS = new Set([
  "avec", "dans", "pour", "plus", "tout", "tous", "toute", "cette", "celui",
  "celle", "comme", "mais", "sans", "sous", "vers", "chez", "entre", "après",
  "avant", "depuis", "alors", "aussi", "être", "avoir", "faire", "très",
  "the", "and", "for", "with", "your", "this", "that", "from", "are", "was",
]);

const PLATFORM_TAGS: Record<PlatformId, string[]> = {
  youtube: ["#shorts", "#youtubeshorts", "#subscribe"],
  tiktok: ["#fyp", "#foryou", "#tiktok"],
  instagram: ["#reels", "#reelsinstagram", "#explore"],
  spotify: ["#podcast", "#spotify", "#audio"],
  facebook: ["#facebookreels", "#reels"],
  twitter: ["#viral", "#video"],
};

const GENERIC_TAGS = [
  "#contentcreator",
  "#creator",
  "#viral",
  "#trending",
  "#socialmedia",
];

function extractKeywords(text: string): string[] {
  const words =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(/[a-z0-9]{4,}/g) ?? [];

  return [...new Set(words.filter((w) => !STOP_WORDS.has(w)))].slice(0, 6);
}

function normalizeTag(tag: string): string {
  const cleaned = tag.trim().replace(/^#+/, "").replace(/\s+/g, "");
  return cleaned ? `#${cleaned}` : "";
}

export async function generateHashtags(
  title: string,
  description: string,
  platforms: PlatformId[] = []
): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 900));

  const keywords = extractKeywords(`${title} ${description}`);
  const keywordTags = keywords.map((w) => `#${w}`);

  const platformTags = platforms.flatMap((p) => PLATFORM_TAGS[p]);

  const combined = [...keywordTags, ...platformTags, ...GENERIC_TAGS]
    .map(normalizeTag)
    .filter(Boolean);

  return [...new Set(combined)].slice(0, 12);
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((t) => normalizeTag(t))
    .filter(Boolean);
}

export function mergeTags(existing: string[], newTags: string[]): string[] {
  const normalized = [...existing, ...newTags].map(normalizeTag).filter(Boolean);
  return [...new Set(normalized)];
}
