import type { CalendarDay } from "./day-types";

interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  isHovered: boolean;
  hasDayNote: boolean;
  rangeStartCount: number;
  rangeEndCount: number;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
}

export default function DayCell({
  day,
  isStart,
  isEnd,
  inRange,
  isHovered,
  hasDayNote,
  rangeStartCount,
  rangeEndCount,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: DayCellProps) {
  const now = new Date();
  const isToday =
    day.date.getFullYear() === now.getFullYear() &&
    day.date.getMonth() === now.getMonth() &&
    day.date.getDate() === now.getDate();

  return (
    <div
      onClick={() => onClick(day.date)}
      onMouseEnter={() => onMouseEnter(day.date)}
      onMouseLeave={onMouseLeave}
      className={`relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded p-0.75 text-[0.65rem] font-bold transition-colors duration-200 ease-in-out ${day.isCurrentMonth ? "text-foreground" : "text-foreground/15"} ${day.isWeekend && day.isCurrentMonth ? "text-destructive" : ""} ${isToday && !isStart && !isEnd ? "ring-primary ring-1 ring-inset" : ""} ${isStart ? "bg-primary text-primary-foreground font-black" : ""} ${isEnd ? "bg-primary text-primary-foreground font-black" : ""} ${inRange && !isStart && !isEnd ? "bg-secondary/70 text-secondary-foreground" : ""} ${isHovered && !isStart ? "bg-secondary" : ""} ${!isStart && !isEnd && !inRange ? "hover:bg-accent" : ""} `}
    >
      <span className="relative z-10">{day.dayOfMonth}</span>

      {hasDayNote && (
        <span className="bg-primary absolute bottom-0.5 left-0.5 h-1 w-1 rounded-full" />
      )}

      {rangeStartCount > 0 && (
        <span className="absolute bottom-0.5 left-2.5 flex items-center gap-px">
          {Array.from({ length: Math.min(rangeStartCount, 3) }).map(
            (_, index) => (
              <span
                key={`legacy-range-start-${index}`}
                className="bg-secondary-foreground inline-block h-1 w-1 rounded-full"
                title="Range note start"
              />
            ),
          )}
        </span>
      )}

      {rangeEndCount > 0 && (
        <span className="absolute right-0.5 bottom-0.5 flex items-center gap-px">
          {Array.from({ length: Math.min(rangeEndCount, 3) }).map(
            (_, index) => (
              <span
                key={`legacy-range-end-${index}`}
                className="inline-block h-1 w-1 rounded-full bg-rose-500"
                title="Range note end"
              />
            ),
          )}
        </span>
      )}
    </div>
  );
}
