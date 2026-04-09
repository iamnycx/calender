"use client";

import { useEffect, useMemo } from "react";
import CalendarFooterStatus from "./calendar-footer-status";
import Month from "./month";
import NotesLegacy from "./notes-legacy";
import Bindings from "./bindings";
import HeroImage from "./hero-image";
import { useCalendarStore } from "~/lib/calendar-store";
import {
  type NoteTarget,
  toDateKey,
  type TextNoteRecord,
  useNotesStore,
} from "~/lib/notes-store";

function toMonthKeyFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatRelativeUpdatedMeta(record: TextNoteRecord) {
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

interface CalendarProps {
  onOpenNoteTarget?: (target: NoteTarget | null) => void;
}

export default function Calendar({ onOpenNoteTarget }: CalendarProps) {
  const hydrateNotes = useNotesStore((state) => state.hydrateNotes);
  const dayNotes = useNotesStore((state) => state.dayNotes);
  const monthNotes = useNotesStore((state) => state.monthNotes);
  const currentMonth = useCalendarStore((state) => state.currentMonth);

  useEffect(() => {
    hydrateNotes();
  }, [hydrateNotes]);

  const todayKey = toDateKey(new Date());
  const monthKey = useMemo(
    () => toMonthKeyFromDate(currentMonth),
    [currentMonth],
  );

  const todaysRecord = dayNotes[todayKey] ?? null;
  const monthRecord = monthNotes[monthKey] ?? null;
  const activeRecord = todaysRecord ?? monthRecord;

  const noteTitle = todaysRecord
    ? "Today Note"
    : monthRecord
      ? "Month Note"
      : "Notes";
  const noteMetadata = todaysRecord
    ? formatRelativeUpdatedMeta(todaysRecord)
    : monthRecord
      ? formatRelativeUpdatedMeta(monthRecord)
      : undefined;

  const handleOpenMonthNote = () => {
    if (!onOpenNoteTarget) return;

    onOpenNoteTarget({ kind: "month", monthKey });
  };

  return (
    <div className="bg-muted relative h-140 w-96 font-mono shadow-2xl">
      <Bindings />
      <HeroImage />
      <div className="absolute inset-x-0 bottom-0">
        <div className="flex justify-between">
          <div className="relative w-2/3">
            <NotesLegacy
              text={activeRecord?.text ?? ""}
              title={noteTitle}
              metadata={noteMetadata}
              onClick={handleOpenMonthNote}
            />
          </div>
          <Month onOpenNoteTarget={onOpenNoteTarget} />
        </div>
        <CalendarFooterStatus />
      </div>
    </div>
  );
}
