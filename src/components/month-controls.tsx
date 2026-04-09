"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useCalendarStore } from "~/lib/calendar-store";

export default function MonthControls() {
  const goToPreviousMonth = useCalendarStore(
    (state) => state.goToPreviousMonth,
  );
  const goToNextMonth = useCalendarStore((state) => state.goToNextMonth);
  const resetToCurrentMonth = useCalendarStore(
    (state) => state.resetToCurrentMonth,
  );

  const playButtonClick = () => {
    const audio = new Audio("/sfx/button-click.mp3");
    void audio.play().catch(() => {
      // Ignore autoplay restrictions when browser blocks playback.
    });
  };

  const handlePreviousMonth = () => {
    playButtonClick();
    goToPreviousMonth();
  };

  const handleNextMonth = () => {
    playButtonClick();
    goToNextMonth();
  };

  const handleResetToCurrentMonth = () => {
    const audio = new Audio("/sfx/opening-door.mp3");
    void audio.play().catch(() => {
      // Ignore autoplay restrictions when browser blocks playback.
    });
    resetToCurrentMonth();
  };

  const navButtonClass =
    "bg-secondary ring-muted-foreground/20 text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0.75 shadow-2xs ring transition-transform duration-500 ease-in-out outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95";

  const todayButtonClass =
    "bg-secondary/50 ring-muted-foreground/10 text-foreground flex h-8 min-w-16 cursor-pointer items-center justify-center rounded-full px-3 text-xs font-semibold tracking-wide shadow-2xs ring transition-transform duration-500 ease-in-out outline-none hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95";

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handlePreviousMonth}
        className={navButtonClass}
        aria-label="Previous month"
      >
        <CaretLeftIcon weight="bold" size={16} />
      </button>
      <button
        type="button"
        onClick={handleResetToCurrentMonth}
        className={todayButtonClass}
        aria-label="Return to current month"
      >
        Today
      </button>
      <button
        type="button"
        onClick={handleNextMonth}
        className={navButtonClass}
        aria-label="Next month"
      >
        <CaretRightIcon weight="bold" size={16} />
      </button>
    </div>
  );
}
