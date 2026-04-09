"use client";

import { useMemo } from "react";
import { AnimatePresence, motion as m } from "motion/react";
import {
  areSameDay,
  getHoverRange,
  isDateInRange,
  useCalendarStore,
} from "~/lib/calendar-store";
import {
  getDateNoteIndicators,
  isSameNoteTarget,
  normalizeRangeKeys,
  type NoteTarget,
  toDateKey,
  useNotesStore,
} from "~/lib/notes-store";
import type { CalendarDay } from "./day-types";
import DayCell from "./day-cell";

interface DayGridProps {
  days: CalendarDay[];
  activeTarget?: NoteTarget | null;
  onOpenNoteTarget?: (target: NoteTarget | null) => void;
}

export default function DayGrid({
  days,
  activeTarget = null,
  onOpenNoteTarget,
}: DayGridProps) {
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const startDate = useCalendarStore((state) => state.startDate);
  const endDate = useCalendarStore((state) => state.endDate);
  const hoverDate = useCalendarStore((state) => state.hoverDate);
  const selectDate = useCalendarStore((state) => state.selectDate);
  const setHoverDate = useCalendarStore((state) => state.setHoverDate);
  const dayNotes = useNotesStore((state) => state.dayNotes);
  const rangeNotes = useNotesStore((state) => state.rangeNotes);

  const hoverRange = useMemo(
    () => getHoverRange(startDate, endDate, hoverDate),
    [startDate, endDate, hoverDate],
  );

  const handleDateClick = (date: Date) => {
    const dateKey = toDateKey(date);

    if (startDate !== null && endDate === null) {
      const startKey = toDateKey(startDate);

      if (startKey === dateKey) {
        selectDate(date);
        const nextTarget: NoteTarget = { kind: "day", dateKey };
        onOpenNoteTarget?.(
          isSameNoteTarget(activeTarget, nextTarget) ? null : nextTarget,
        );
        return;
      }

      const normalized = normalizeRangeKeys(startKey, dateKey);
      selectDate(date);
      const nextTarget: NoteTarget = {
        kind: "range",
        startKey: normalized.startKey,
        endKey: normalized.endKey,
      };
      onOpenNoteTarget?.(
        isSameNoteTarget(activeTarget, nextTarget) ? null : nextTarget,
      );
      return;
    }

    selectDate(date);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={currentMonth.toISOString()}
        initial={{ opacity: 0, filter: "blur(6px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(6px)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="grid grid-cols-7 gap-x-1 gap-y-0.5"
      >
        {days.map((day) => {
          const indicators = getDateNoteIndicators(
            dayNotes,
            rangeNotes,
            toDateKey(day.date),
          );
          const isStart = areSameDay(startDate, day.date);
          const isEnd = areSameDay(endDate, day.date);
          const inCommittedRange =
            startDate !== null &&
            endDate !== null &&
            isDateInRange(day.date, startDate, endDate);
          const inHoverRange =
            hoverRange !== null &&
            isDateInRange(day.date, hoverRange.min, hoverRange.max);

          return (
            <DayCell
              key={day.date.toISOString()}
              day={day}
              isStart={isStart}
              isEnd={isEnd}
              inRange={inCommittedRange || inHoverRange}
              isHovered={areSameDay(hoverDate, day.date) && endDate === null}
              hasDayNote={indicators.hasDayNote}
              rangeStartCount={indicators.rangeStartCount}
              rangeEndCount={indicators.rangeEndCount}
              onClick={handleDateClick}
              onMouseEnter={setHoverDate}
              onMouseLeave={() => setHoverDate(null)}
            />
          );
        })}
      </m.div>
    </AnimatePresence>
  );
}
