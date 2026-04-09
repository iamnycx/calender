"use client";

import { AnimatePresence, motion as m } from "motion/react";
import { useCalendarStore } from "~/lib/calendar-store";

export default function MonthHeader() {
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const monthLabel = currentMonth.toLocaleString("default", { month: "long" });
  const yearLabel = String(currentMonth.getFullYear());

  return (
    <div className="text-right">
      <div className="inline-flex flex-col items-end">
        <AnimatePresence mode="wait" initial={false}>
          <m.h1
            key={yearLabel}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="font-kamal -mb-2"
          >
            {yearLabel}
          </m.h1>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <m.h1
            key={monthLabel}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="font-kamal text-2xl"
          >
            {monthLabel}
          </m.h1>
        </AnimatePresence>
      </div>
    </div>
  );
}
