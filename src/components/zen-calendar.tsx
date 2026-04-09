"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion as m } from "motion/react";
import { useCalendarStore } from "~/lib/calendar-store";
import {
  getDateNoteIndicators,
  isSameNoteTarget,
  normalizeRangeKeys,
  toDateKey,
  type NoteTarget,
  useNotesStore,
} from "~/lib/notes-store";
import { PlusIcon } from "@phosphor-icons/react";

interface ZenCalendarProps {
  activeTarget: NoteTarget | null;
  onOpenNoteTarget: (target: NoteTarget | null) => void;
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
  const monthQuote = monthNotes[currentMonthKey]?.text?.trim() ?? "";

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
      isSameNoteTarget(activeTarget, nextTarget) ? null : nextTarget,
    );
  };

  const openRangeNote = (startKey: string, endKey: string) => {
    const nextTarget: NoteTarget = { kind: "range", startKey, endKey };
    onOpenNoteTarget(
      isSameNoteTarget(activeTarget, nextTarget) ? null : nextTarget,
    );
  };

  const openMonthNote = () => {
    if (activeTarget) return;

    const nextTarget: NoteTarget = {
      kind: "month",
      monthKey: currentMonthKey,
    };
    onOpenNoteTarget(
      isSameNoteTarget(activeTarget, nextTarget) ? null : nextTarget,
    );
  };

  const handleDateClick = (date: Date) => {
    if (activeTarget) return;

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
      className="bg-background relative flex h-full w-full flex-col overflow-hidden px-4 py-8 md:px-12"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {monthQuote ? (
            <p
              onClick={openMonthNote}
              className="text-foreground/75 line-clamp-2 italic"
            >
              {`"${monthQuote}"`}
            </p>
          ) : (
            <button
              type="button"
              onClick={openMonthNote}
              className="text-muted-foreground hover:text-muted-foreground/80 underline-offset-2 hover:underline"
            >
              {"create this month's new"}
            </button>
          )}
        </div>
        <div className="text-foreground/85 relative text-right text-3xl font-semibold tracking-tight">
          <span className="inline-flex items-baseline gap-2">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={monthLabel}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                {monthLabel}
              </m.span>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={yearLabel}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="text-foreground/60 text-xl"
              >
                {yearLabel}
              </m.span>
            </AnimatePresence>
          </span>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div
            key={day}
            className={`bg-secondary/30 rounded-lg p-4 md:text-xl ${
              day === "Sun" || day === "Sat" ? "text-destructive" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={currentMonthKey}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="grid flex-1 grid-cols-7 gap-1"
        >
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
                <m.div
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
                  tabIndex={activeTarget ? -1 : 0}
                  onKeyDown={(e) => {
                    if (activeTarget) return;

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
                  className={`group relative cursor-pointer overflow-hidden rounded-lg p-4 font-semibold transition-all md:text-2xl ${
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
                </m.div>
              );
            }),
          )}
        </m.div>
      </AnimatePresence>
    </m.div>
  );
}
