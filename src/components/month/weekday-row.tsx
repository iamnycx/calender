const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekdayRow() {
  return (
    <div className="mt-8 mb-1 grid grid-cols-7 gap-x-1 uppercase">
      {WEEKDAY_NAMES.map((weekday) => (
        <div
          key={weekday}
          className="text-foreground text-center text-[0.65rem] font-semibold"
        >
          {weekday}
        </div>
      ))}
    </div>
  );
}
