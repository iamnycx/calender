"use client";

import DayGrid from "./month/day-grid";
import { getCalendarDays } from "./month/get-calendar-days";
import MonthHeader from "./month/month-header";
import WeekdayRow from "./month/weekday-row";
import { useCalendarStore } from "~/lib/calendar-store";
import type { NoteTarget } from "~/lib/notes-store";

interface MonthProps {
  onOpenNoteTarget?: (target: NoteTarget | null) => void;
}

export default function Month({ onOpenNoteTarget }: MonthProps) {
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const days = getCalendarDays(currentMonth);

  return (
    <div className="w-full p-4 pl-0">
      <MonthHeader />
      <WeekdayRow />
      <DayGrid days={days} onOpenNoteTarget={onOpenNoteTarget} />
    </div>
  );
}
