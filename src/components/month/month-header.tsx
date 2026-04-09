import { useCalendarStore } from "~/lib/calendar-store";

export default function MonthHeader() {
  const currentMonth = useCalendarStore((state) => state.currentMonth);

  return (
    <div className="text-right">
      <h1 className="-mb-2 font-kamal">{currentMonth.getFullYear()}</h1>
      <h1 className="font-kamal text-2xl">
        {currentMonth.toLocaleString("default", { month: "long" })}
      </h1>
    </div>
  );
}
