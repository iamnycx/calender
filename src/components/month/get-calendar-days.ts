import type { CalendarDay } from "./day-types";

export function getCalendarDays(date: Date = new Date()): CalendarDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const days: CalendarDay[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayOfMonth = prevMonthLastDay - i;
    const dayDate = new Date(year, month - 1, dayOfMonth);
    const dayOfWeek = (dayDate.getDay() + 6) % 7;
    days.push({
      dayOfMonth,
      date: dayDate,
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayOfWeek = (startingDayOfWeek + i - 1) % 7;
    days.push({
      dayOfMonth: i,
      date: new Date(year, month, i),
      isCurrentMonth: true,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const dayDate = new Date(year, month + 1, i);
    const dayOfWeek = (dayDate.getDay() + 6) % 7;
    days.push({
      dayOfMonth: i,
      date: dayDate,
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
    });
  }

  return days;
}
