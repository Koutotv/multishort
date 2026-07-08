import { createClient } from "@/lib/supabase/server";
import type {
  ConnectionStatus,
  PlatformConnectionRecord,
  PlatformId,
  VideoPublicationRecord,
} from "@/types";

type SnapshotRecord = {
  publicationId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  syncedAt: string;
};

const memoryStore = globalThis as typeof globalThis & {
  __multishortConnections?: PlatformConnectionRecord[];
  __multishortPublications?: VideoPublicationRecord[];
  __multishortSnapshots?: SnapshotRecord[];
};

function getMemoryConnections() {
  if (!memoryStore.__multishortConnections) {
    memoryStore.__multishortConnections = [];
  }
  return memoryStore.__multishortConnections;
}

function getMemoryPublications() {
  if (!memoryStore.__multishortPublications) {
    memoryStore.__multishortPublications = [];
  }
  return memoryStore.__multishortPublications;
}

function getMemorySnapshots() {
  if (!memoryStore.__multishortSnapshots) {
    memoryStore.__multishortSnapshots = [];
  }
  return memoryStore.__multishortSnapshots;
}

export async function listConnections(userId: string): Promise<PlatformConnectionRecord[]> {
  const supabase = await createClient();
  if (!supabase) {
    return getMemoryConnections().filter((item) => item.userId === userId);
  }

  const { data } = await supabase
    .from("platform_connections")
    .select("*")
    .eq("user_id", userId);

  return (data ?? []).map(mapConnectionRow);
}

export async function upsertConnection(
  record: Omit<PlatformConnectionRecord, "id">
): Promise<PlatformConnectionRecord> {
  const supabase = await createClient();
  if (!supabase) {
    const connections = getMemoryConnections();
    const existingIndex = connections.findIndex(
      (item) => item.userId === record.userId && item.platform === record.platform
    );
    const next: PlatformConnectionRecord = {
      id: existingIndex >= 0 ? connections[existingIndex].id : crypto.randomUUID(),
      ...record,
    };
    if (existingIndex >= 0) {
      connections[existingIndex] = next;
    } else {
      connections.push(next);
    }
    return next;
  }

  const payload = {
    user_id: record.userId,
    platform: record.platform,
    platform_account_id: record.platformAccountId,
    username: record.username,
    status: record.status,
    scopes: record.scopes ?? [],
    token_expires_at: record.expiresAt ?? null,
    last_error: record.lastError ?? null,
    connected_at: record.connectedAt ?? null,
    metadata: {},
  };

  const { data, error } = await supabase
    .from("platform_connections")
    .upsert(payload, { onConflict: "user_id,platform" })
    .select()
    .single();

  if (error) throw error;
  return mapConnectionRow(data);
}

export async function disconnectConnection(userId: string, platform: PlatformId) {
  return upsertConnection({
    userId,
    platform,
    status: "disconnected",
    username: undefined,
    platformAccountId: undefined,
    lastError: undefined,
    connectedAt: undefined,
    expiresAt: undefined,
    scopes: [],
  });
}

export async function recordPublication(
  publication: Omit<VideoPublicationRecord, "id"> & { userId: string }
): Promise<VideoPublicationRecord> {
  const supabase = await createClient();
  if (!supabase) {
    const next = { id: crypto.randomUUID(), ...publication };
    getMemoryPublications().push(next);
    return next;
  }

  const { data, error } = await supabase
    .from("video_publications")
    .insert({
      video_id: publication.videoId,
      user_id: publication.userId,
      platform: publication.platform,
      remote_post_id: publication.remotePostId ?? null,
      published_url: publication.publishedUrl ?? null,
      status: publication.status,
      published_at: publication.publishedAt ?? null,
      last_error: publication.lastError ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapPublicationRow(data);
}

export async function listPublications(videoId: string): Promise<VideoPublicationRecord[]> {
  const supabase = await createClient();
  if (!supabase) {
    return getMemoryPublications().filter((item) => item.videoId === videoId);
  }

  const { data } = await supabase
    .from("video_publications")
    .select("*")
    .eq("video_id", videoId);

  return (data ?? []).map(mapPublicationRow);
}

export async function storeSnapshot(snapshot: SnapshotRecord) {
  const supabase = await createClient();
  if (!supabase) {
    getMemorySnapshots().push(snapshot);
    return;
  }

  await supabase.from("platform_metrics_snapshots").insert({
    publication_id: snapshot.publicationId,
    views: snapshot.views,
    likes: snapshot.likes,
    comments: snapshot.comments,
    shares: snapshot.shares,
    engagement_rate: snapshot.engagementRate,
    synced_at: snapshot.syncedAt,
  });
}

function mapConnectionRow(row: Record<string, unknown>): PlatformConnectionRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id ?? row.userId),
    platform: row.platform as PlatformId,
    platformAccountId: (row.platform_account_id ?? row.platformAccountId) as string | undefined,
    username: row.username as string | undefined,
    status: ((row.status as string | undefined) ?? "disconnected") as ConnectionStatus,
    scopes: (row.scopes as string[] | undefined) ?? [],
    connectedAt: (row.connected_at ?? row.connectedAt) as string | undefined,
    expiresAt: (row.token_expires_at ?? row.expiresAt) as string | undefined,
    lastError: (row.last_error ?? row.lastError) as string | undefined,
  };
}

function mapPublicationRow(row: Record<string, unknown>): VideoPublicationRecord {
  return {
    id: String(row.id),
    videoId: String(row.video_id ?? row.videoId),
    platform: row.platform as PlatformId,
    remotePostId: (row.remote_post_id ?? row.remotePostId) as string | undefined,
    publishedUrl: (row.published_url ?? row.publishedUrl) as string | undefined,
    status: row.status as "pending" | "published" | "error",
    publishedAt: (row.published_at ?? row.publishedAt) as string | undefined,
    lastError: (row.last_error ?? row.lastError) as string | undefined,
  };
}
