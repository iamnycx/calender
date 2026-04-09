"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { motion as m } from "motion/react";
import { useCalendarStore } from "~/lib/calendar-store";
import { useZenModeStore } from "~/lib/zen-mode-store";

export function ZenCalendar() {
  const { currentMonth, goToPreviousMonth, goToNextMonth } = useCalendarStore();
  const { setZenMode } = useZenModeStore();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

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

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="bg-background flex h-screen w-screen flex-col p-8"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="hover:bg-secondary rounded-lg p-2 transition-colors"
        >
          <ArrowLeftIcon size={32} />
        </button>
        <h2 className="text-4xl font-bold">{monthName}</h2>
        <button
          onClick={goToNextMonth}
          className="hover:bg-secondary rounded-lg p-2 transition-colors"
        >
          <ArrowRightIcon size={32} />
        </button>
      </div>

      {/* Weekday Row */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div
            key={day}
            className="bg-secondary/30 rounded-lg p-4 text-center text-xl font-bold"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid flex-1 grid-cols-7 gap-1">
        {weeks.map((week, weekIdx) =>
          week.map((date, dayIdx) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={`${weekIdx}-${dayIdx}`}
                onClick={() => setZenMode(false)}
                className={`rounded-lg p-4 text-2xl font-semibold transition-all hover:scale-105 ${
                  isCurrentMonth
                    ? isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                    : "bg-background/50 text-foreground/30"
                }`}
              >
                {date.getDate()}
              </button>
            );
          }),
        )}
      </div>

      {/* Footer hint */}
      <div className="text-muted-foreground mt-8 text-center text-sm">
        Click any date to exit zen mode
      </div>
    </m.div>
  );
}
