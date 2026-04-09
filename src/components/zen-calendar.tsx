"use client";

import { useEffect, useState } from "react";
import { motion as m } from "motion/react";
import { useCalendarStore } from "~/lib/calendar-store";
import {
  getDateNoteIndicators,
  normalizeRangeKeys,
  toDateKey,
  type NoteTarget,
  useNotesStore,
} from "~/lib/notes-store";
import {
  CalendarDotIcon,
  PlusIcon,
} from "@phosphor-icons/react";

interface ZenCalendarProps {
  activeTarget: NoteTarget | null;
  onOpenNoteTarget: (target: NoteTarget | null) => void;
}

function isSameTarget(a: NoteTarget | null, b: NoteTarget | null) {
  if (a === null || b === null) return false;
  if (a.kind !== b.kind) return false;

  switch (a.kind) {
    case "month":
      return b.kind === "month" && a.monthKey === b.monthKey;
    case "day":
      return b.kind === "day" && a.dateKey === b.dateKey;
    case "range":
      return (
        b.kind === "range" && a.startKey === b.startKey && a.endKey === b.endKey
      );
  }
}

export function ZenCalendar({
  activeTarget,
  onOpenNoteTarget,
}: ZenCalendarProps) {
  const hydrateNotes = useNotesStore((state) => state.hydrateNotes);
  const monthNotes = useNotesStore((state) => state.monthNotes);
  const dayNotes = useNotesStore((state) => state.dayNotes);
  const rangeNotes = useNotesStore((state) => state.rangeNotes);
  const { currentMonth } = useCalendarStore();

  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeHoverEnd, setRangeHoverEnd] = useState<string | null>(null);

  useEffect(() => {
    hydrateNotes();
  }, [hydrateNotes]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const hasCurrentMonthNote = currentMonthKey in monthNotes;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const weeks: Date[][] = [];
  const current = new Date(startDate);
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  while (current <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabel = currentMonth.toLocaleDateString("default", {
    month: "long",
  });
  const yearLabel = String(currentMonth.getFullYear());

  const openDayNote = (dateKey: string) => {
    const nextTarget: NoteTarget = { kind: "day", dateKey };
    onOpenNoteTarget(
      isSameTarget(activeTarget, nextTarget) ? null : nextTarget,
    );
  };

  const openRangeNote = (startKey: string, endKey: string) => {
    const nextTarget: NoteTarget = { kind: "range", startKey, endKey };
    onOpenNoteTarget(
      isSameTarget(activeTarget, nextTarget) ? null : nextTarget,
    );
  };

  const openMonthNote = () => {
    const nextTarget: NoteTarget = {
      kind: "month",
      monthKey: currentMonthKey,
    };
    onOpenNoteTarget(
      isSameTarget(activeTarget, nextTarget) ? null : nextTarget,
    );
  };

  const handleDateClick = (date: Date) => {
    const dateKey = toDateKey(date);

    if (!rangeStart) {
      setRangeStart(dateKey);
      setRangeHoverEnd(null);
      return;
    }

    if (rangeStart === dateKey) {
      setRangeStart(null);
      setRangeHoverEnd(null);
      openDayNote(dateKey);
      return;
    }

    const { startKey, endKey } = normalizeRangeKeys(rangeStart, dateKey);
    setRangeStart(null);
    setRangeHoverEnd(null);
    openRangeNote(startKey, endKey);
  };

  const headerHelpText = rangeStart
    ? "Range start selected. Click another date to open range note, or click same date for day note."
    : "Click one date to start range. Click second date for range note, or same date for day note.";

  const previewRange =
    rangeStart && rangeHoverEnd && rangeStart !== rangeHoverEnd
      ? normalizeRangeKeys(rangeStart, rangeHoverEnd)
      : null;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      data-zen-calendar-container
      className="bg-background relative flex h-full w-full flex-col overflow-hidden px-12 py-8"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openMonthNote}
            className={`bg-secondary/50 ring-muted-foreground/10 text-foreground mb-2 flex h-8 min-w-16 cursor-pointer items-center justify-center gap-1 rounded-full px-3 text-xs font-semibold tracking-wide shadow-2xs ring transition-transform duration-500 ease-in-out outline-none hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 ${
              activeTarget?.kind === "month" || hasCurrentMonthNote
                ? "bg-primary/15 text-primary ring-primary/30"
                : "hover:bg-foreground/5"
            }`}
          >
            <CalendarDotIcon size={14} weight="bold" />
            Month Note
          </button>
        </div>
        <div className="text-foreground/70 text-sm">{headerHelpText}</div>
        <div className="text-right leading-none">
          <div className="text-foreground/85 text-3xl font-semibold tracking-tight">
            {monthLabel}
          </div>
          <div className="text-foreground/60 mt-1 text-xl font-medium tracking-wide">
            {yearLabel}
          </div>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div
            key={day}
            className={`bg-secondary/30 rounded-lg p-4 text-xl ${
              day === "Sun" || day === "Sat" ? "text-destructive" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 gap-1">
        {weeks.map((week, weekIdx) =>
          week.map((date, dayIdx) => {
            const dateKey = toDateKey(date);
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            const noteIndicators = getDateNoteIndicators(
              dayNotes,
              rangeNotes,
              dateKey,
            );
            const isRangeStart = dateKey === rangeStart;
            const isInRangeHoverPreview = previewRange
              ? dateKey >= previewRange.startKey &&
                dateKey <= previewRange.endKey
              : false;

            return (
              <div
                key={`${weekIdx}-${dayIdx}`}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => {
                  if (rangeStart) {
                    setRangeHoverEnd(dateKey);
                  }
                }}
                onMouseLeave={() => {
                  if (rangeStart) {
                    setRangeHoverEnd(null);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDateClick(date);
                  }
                }}
                onFocus={() => {
                  if (rangeStart) {
                    setRangeHoverEnd(dateKey);
                  }
                }}
                onBlur={() => {
                  if (rangeStart) {
                    setRangeHoverEnd(null);
                  }
                }}
                className={`group relative cursor-pointer overflow-hidden rounded-lg p-4 text-2xl font-semibold transition-all ${
                  isCurrentMonth
                    ? isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                    : "bg-background/50 text-foreground/30"
                } ${dayIdx === 0 || dayIdx === 6 ? "text-destructive" : ""} ${isInRangeHoverPreview ? "ring-foreground ring-1" : ""} ${isRangeStart ? "ring-primary ring-2" : ""}`}
              >
                <span className="relative z-10">{date.getDate()}</span>
                <PlusIcon
                  className="absolute top-4 right-4 -rotate-90 opacity-0 transition-all ease-in-out group-hover:rotate-0 group-hover:opacity-100"
                  weight="bold"
                  size={16}
                />

                {noteIndicators.rangeStartCount > 0 && (
                  <span className="absolute bottom-3 left-4 flex items-center gap-0.5">
                    {noteIndicators.hasDayNote && (
                      <span className="bg-primary inline-block h-2 w-2 rounded-full" />
                    )}
                    {Array.from({
                      length: Math.min(noteIndicators.rangeStartCount, 3),
                    }).map((_, index) => (
                      <span
                        key={`start-${index}`}
                        title="Range note start"
                        className="bg-secondary-foreground inline-block h-2 w-2 rounded-full"
                      />
                    ))}
                  </span>
                )}
                {noteIndicators.rangeEndCount > 0 && (
                  <span className="absolute right-4 bottom-3 flex items-center gap-0.5">
                    {Array.from({
                      length: Math.min(noteIndicators.rangeEndCount, 3),
                    }).map((_, index) => (
                      <span
                        key={`end-${index}`}
                        title="Range note end"
                        className="bg-destructive inline-block h-2 w-2 rounded-full"
                      />
                    ))}
                  </span>
                )}
              </div>
            );
          }),
        )}
      </div>
    </m.div>
  );
}
