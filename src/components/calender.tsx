"use client";

import { useEffect, useMemo } from "react";
import { motion as m } from "motion/react";

import Bindings from "./bindings";
import CalendarFooterStatus from "./calendar-footer-status";
import HeroImage from "./hero-image";
import Month from "./month";
import NotesLegacy from "./notes-legacy";
import { useCalendarStore } from "~/lib/calendar-store";
import { formatRelativeUpdatedMeta } from "~/lib/date-utils";
import {
  type NoteTarget,
  isSameNoteTarget,
  toDateKey,
  toMonthKey,
  useNotesStore,
} from "~/lib/notes-store";

interface CalendarProps {
  activeTarget?: NoteTarget | null;
  onOpenNoteTarget?: (target: NoteTarget | null) => void;
}

export default function Calendar({
  activeTarget = null,
  onOpenNoteTarget,
}: CalendarProps) {
  const hydrateNotes = useNotesStore((state) => state.hydrateNotes);
  const dayNotes = useNotesStore((state) => state.dayNotes);
  const monthNotes = useNotesStore((state) => state.monthNotes);
  const currentMonth = useCalendarStore((state) => state.currentMonth);

  useEffect(() => {
    hydrateNotes();
  }, [hydrateNotes]);

  const todayKey = toDateKey(new Date());
  const monthKey = useMemo(() => toMonthKey(currentMonth), [currentMonth]);

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

    const nextTarget: NoteTarget = { kind: "month", monthKey };
    onOpenNoteTarget(
      isSameNoteTarget(activeTarget, nextTarget) ? null : nextTarget,
    );
  };

  return (
    <m.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-muted relative h-140 w-88 font-mono shadow-2xl md:h-88 md:w-140"
    >
      <Bindings />
      <HeroImage />
      <div className="absolute inset-x-0 bottom-0 md:left-[38%] md:w-[62%]">
        <div className="flex justify-between">
          <div className="relative w-[70%] md:w-[72%]">
            <NotesLegacy
              text={activeRecord?.text ?? ""}
              title={noteTitle}
              metadata={noteMetadata}
              onClick={handleOpenMonthNote}
            />
          </div>
          <Month
            activeTarget={activeTarget}
            onOpenNoteTarget={onOpenNoteTarget}
          />
        </div>
        <CalendarFooterStatus />
      </div>
    </m.div>
  );
}
