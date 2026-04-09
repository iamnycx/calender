import { useCalendarStore } from "~/lib/calendar-store";

function formatDateLabel(date: Date) {
  return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`;
}

export default function CalendarFooterStatus() {
  const startDate = useCalendarStore((state) => state.startDate);
  const endDate = useCalendarStore((state) => state.endDate);

  return (
    <footer className="bg-accent text-foreground/70 flex h-12 w-full items-center justify-center text-xs">
      {startDate !== null &&
        endDate === null &&
        "Click another date to set end date"}
      {startDate !== null &&
        endDate !== null &&
        `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`}
    </footer>
  );
}
