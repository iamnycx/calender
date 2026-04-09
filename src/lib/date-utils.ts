import type { TextNoteRecord } from "~/lib/notes-store";

export function formatRelativeUpdatedMeta(record: TextNoteRecord) {
  const diffMs = Date.now() - record.updatedAt;

  if (diffMs < 60 * 1000) {
    return "just now";
  }

  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 60) {
    return `${minutes}min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}hr ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
