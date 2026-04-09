import { create } from "zustand";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface CalendarStore {
  currentMonth: Date;
  visibleMonthKey: string;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  resetToCurrentMonth: () => void;
  selectDate: (date: Date) => void;
  setHoverDate: (date: Date | null) => void;
}

function toMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export const useCalendarStore = create<CalendarStore>()((set) => ({
  currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  visibleMonthKey: toMonthKey(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  ),
  startDate: null,
  endDate: null,
  hoverDate: null,
  goToPreviousMonth: () =>
    set((state) => {
      const nextMonth = new Date(
        state.currentMonth.getFullYear(),
        state.currentMonth.getMonth() - 1,
        1,
      );

      return {
        currentMonth: nextMonth,
        visibleMonthKey: toMonthKey(nextMonth),
      };
    }),
  goToNextMonth: () =>
    set((state) => {
      const nextMonth = new Date(
        state.currentMonth.getFullYear(),
        state.currentMonth.getMonth() + 1,
        1,
      );

      return {
        currentMonth: nextMonth,
        visibleMonthKey: toMonthKey(nextMonth),
      };
    }),
  resetToCurrentMonth: () =>
    set(() => {
      const nextMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );

      return {
        currentMonth: nextMonth,
        visibleMonthKey: toMonthKey(nextMonth),
      };
    }),
  selectDate: (date) =>
    set((state) => {
      const selectedDate = startOfDay(date);

      if (state.startDate === null) {
        return { startDate: selectedDate, endDate: null };
      }

      if (state.endDate === null) {
        if (isSameDay(selectedDate, state.startDate)) {
          return { startDate: null, endDate: null };
        }

        const minDate =
          state.startDate.getTime() <= selectedDate.getTime()
            ? state.startDate
            : selectedDate;
        const maxDate =
          state.startDate.getTime() > selectedDate.getTime()
            ? state.startDate
            : selectedDate;

        return { startDate: minDate, endDate: maxDate };
      }

      return { startDate: selectedDate, endDate: null };
    }),
  setHoverDate: (date) => set({ hoverDate: date ? startOfDay(date) : null }),
}));

export function getHoverRange(
  startDate: Date | null,
  endDate: Date | null,
  hoverDate: Date | null,
) {
  if (startDate === null || endDate !== null) return null;
  if (hoverDate === null || isSameDay(hoverDate, startDate)) return null;

  const min =
    startDate.getTime() <= hoverDate.getTime() ? startDate : hoverDate;
  const max = startDate.getTime() > hoverDate.getTime() ? startDate : hoverDate;
  return { min, max };
}

export function isDateInRange(date: Date, min: Date, max: Date) {
  const value = startOfDay(date).getTime();
  return value > min.getTime() && value < max.getTime();
}

export function areSameDay(a: Date | null, b: Date | null) {
  return isSameDay(a, b);
}
