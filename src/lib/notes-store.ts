"use client";

import { create } from "zustand";

export const MAX_NOTE_LENGTH = 240;
const STORAGE_KEY = "calender-component.notes.v1";

export type NoteTarget =
  | { kind: "month"; monthKey: string }
  | { kind: "day"; dateKey: string }
  | { kind: "range"; startKey: string; endKey: string };

export interface TextNoteRecord {
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface RangeNoteRecord extends TextNoteRecord {
  id: string;
  startKey: string;
  endKey: string;
  color: string;
}

export interface NoteSelectionOption {
  target: NoteTarget;
  title: string;
  detail: string;
}

interface StoredNotesPayload {
  monthNotes: Record<string, TextNoteRecord>;
  dayNotes: Record<string, TextNoteRecord>;
  rangeNotes: RangeNoteRecord[];
}

interface NotesStore extends StoredNotesPayload {
  hydrated: boolean;
  hydrateNotes: () => void;
  setMonthNote: (monthKey: string, text: string) => void;
  setDayNote: (dateKey: string, text: string) => void;
  setRangeNote: (startKey: string, endKey: string, text: string) => void;
  deleteMonthNote: (monthKey: string) => void;
  deleteDayNote: (dateKey: string) => void;
  deleteRangeNote: (startKey: string, endKey: string) => void;
}

export function clampNoteText(text: string) {
  return text.slice(0, MAX_NOTE_LENGTH);
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function parseDateKey(dateKey: string) {
  const [yearValue, monthValue, dayValue] = dateKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  return new Date(year, month - 1, day);
}

export function parseMonthKey(monthKey: string) {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  return new Date(year, month - 1, 1);
}

export function normalizeRangeKeys(startKey: string, endKey: string) {
  return startKey <= endKey
    ? { startKey, endKey }
    : { startKey: endKey, endKey: startKey };
}

export function formatDateKey(dateKey: string) {
  return parseDateKey(dateKey).toLocaleDateString("default", {
    month: "short",
    day: "numeric",
  });
}

export function formatMonthKey(monthKey: string) {
  return parseMonthKey(monthKey).toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
}

export function isDateWithinRange(
  dateKey: string,
  startKey: string,
  endKey: string,
) {
  return dateKey >= startKey && dateKey <= endKey;
}

export function generatePastelColor(): string {
  // Generate a random pastel color
  const hue = Math.random() * 360;
  const saturation = 50 + Math.random() * 30; // 50-80%
  const lightness = 70 + Math.random() * 15; // 70-85%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function findRangeNoteForDate(
  rangeNotes: RangeNoteRecord[],
  dateKey: string,
) {
  return rangeNotes.find((note) =>
    isDateWithinRange(dateKey, note.startKey, note.endKey),
  );
}

export function getDateNoteIndicators(
  dayNotes: Record<string, TextNoteRecord>,
  rangeNotes: RangeNoteRecord[],
  dateKey: string,
) {
  const dayNote = dayNotes[dateKey] ?? null;
  const rangeStartCount = rangeNotes.filter(
    (note) => note.startKey === dateKey,
  ).length;
  const rangeEndCount = rangeNotes.filter(
    (note) => note.endKey === dateKey,
  ).length;

  return {
    hasDayNote: dayNote !== null,
    rangeStartCount,
    rangeEndCount,
  };
}

export function isSameNoteTarget(a: NoteTarget, b: NoteTarget) {
  if (a.kind !== b.kind) return false;

  switch (a.kind) {
    case "month":
      return b.kind === "month" && a.monthKey === b.monthKey;
    case "day":
      return b.kind === "day" && a.dateKey === b.dateKey;
    case "range":
      return (
        b.kind === "range" && a.startKey === b.startKey && a.endKey === b.endKey
      );
  }
}

export function getDateNoteSelectionOptions(
  dateKey: string,
  state: Pick<NotesStore, "dayNotes" | "rangeNotes">,
) {
  const options: NoteSelectionOption[] = [];

  if (state.dayNotes[dateKey]) {
    options.push({
      target: { kind: "day", dateKey },
      title: "Date note",
      detail: formatDateKey(dateKey),
    });
  }

  state.rangeNotes.forEach((note) => {
    const target = {
      kind: "range",
      startKey: note.startKey,
      endKey: note.endKey,
    } as const;

    // Include ALL range notes that overlap with this date
    if (isDateWithinRange(dateKey, note.startKey, note.endKey)) {
      let title: string;
      if (note.startKey === dateKey && note.endKey === dateKey) {
        title = "Single-day range";
      } else if (note.startKey === dateKey) {
        title = "Range start";
      } else if (note.endKey === dateKey) {
        title = "Range end";
      } else {
        title = "Range";
      }

      options.push({
        target,
        title,
        detail: getNoteTargetLabel(target),
      });
    }
  });

  return options;
}

function getNoteRecord(text: string, existing?: TextNoteRecord) {
  const cleaned = clampNoteText(text);

  if (!cleaned.trim()) return null;

  const now = Date.now();
  return {
    text: cleaned,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  } satisfies TextNoteRecord;
}

function createRangeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function persistNotes(notes: StoredNotesPayload) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadNotes() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredNotesPayload>;
    return {
      monthNotes: parsed.monthNotes ?? {},
      dayNotes: parsed.dayNotes ?? {},
      rangeNotes: parsed.rangeNotes ?? [],
    } satisfies StoredNotesPayload;
  } catch {
    return null;
  }
}

export const useNotesStore = create<NotesStore>()((set, get) => ({
  hydrated: false,
  monthNotes: {},
  dayNotes: {},
  rangeNotes: [],
  hydrateNotes: () => {
    if (get().hydrated || typeof window === "undefined") return;

    const stored = loadNotes();
    if (stored) {
      set({ ...stored, hydrated: true });
      return;
    }

    set({ hydrated: true });
  },
  setMonthNote: (monthKey, text) => {
    set((state) => {
      const nextMonthNotes = { ...state.monthNotes };
      const nextRecord = getNoteRecord(text, nextMonthNotes[monthKey]);

      if (nextRecord === null) {
        delete nextMonthNotes[monthKey];
      } else {
        nextMonthNotes[monthKey] = nextRecord;
      }

      const nextState = {
        monthNotes: nextMonthNotes,
        dayNotes: state.dayNotes,
        rangeNotes: state.rangeNotes,
      };

      persistNotes(nextState);
      return nextState;
    });
  },
  setDayNote: (dateKey, text) => {
    set((state) => {
      const nextDayNotes = { ...state.dayNotes };
      const nextRecord = getNoteRecord(text, nextDayNotes[dateKey]);

      if (nextRecord === null) {
        delete nextDayNotes[dateKey];
      } else {
        nextDayNotes[dateKey] = nextRecord;
      }

      const nextState = {
        monthNotes: state.monthNotes,
        dayNotes: nextDayNotes,
        rangeNotes: state.rangeNotes,
      };

      persistNotes(nextState);
      return nextState;
    });
  },
  setRangeNote: (startKey, endKey, text) => {
    set((state) => {
      const normalized = normalizeRangeKeys(startKey, endKey);
      const nextRangeNotes = [...state.rangeNotes];
      const existingIndex = nextRangeNotes.findIndex(
        (note) =>
          note.startKey === normalized.startKey &&
          note.endKey === normalized.endKey,
      );
      const existingRecord =
        existingIndex >= 0 ? nextRangeNotes[existingIndex] : undefined;
      const nextRecord = getNoteRecord(text, existingRecord);

      if (nextRecord === null) {
        if (existingIndex >= 0) {
          nextRangeNotes.splice(existingIndex, 1);
        }
      } else if (existingIndex >= 0) {
        nextRangeNotes[existingIndex] = {
          ...existingRecord!,
          ...nextRecord,
          id: existingRecord!.id,
          color: existingRecord!.color,
          startKey: normalized.startKey,
          endKey: normalized.endKey,
        };
      } else {
        nextRangeNotes.push({
          id: createRangeId(),
          startKey: normalized.startKey,
          endKey: normalized.endKey,
          color: generatePastelColor(),
          ...nextRecord,
        });
      }

      const nextState = {
        monthNotes: state.monthNotes,
        dayNotes: state.dayNotes,
        rangeNotes: nextRangeNotes,
      };

      persistNotes(nextState);
      return nextState;
    });
  },
  deleteMonthNote: (monthKey) => {
    set((state) => {
      const nextMonthNotes = { ...state.monthNotes };
      delete nextMonthNotes[monthKey];

      const nextState = {
        monthNotes: nextMonthNotes,
        dayNotes: state.dayNotes,
        rangeNotes: state.rangeNotes,
      };

      persistNotes(nextState);
      return nextState;
    });
  },
  deleteDayNote: (dateKey) => {
    set((state) => {
      const nextDayNotes = { ...state.dayNotes };
      delete nextDayNotes[dateKey];

      const nextState = {
        monthNotes: state.monthNotes,
        dayNotes: nextDayNotes,
        rangeNotes: state.rangeNotes,
      };

      persistNotes(nextState);
      return nextState;
    });
  },
  deleteRangeNote: (startKey, endKey) => {
    set((state) => {
      const normalized = normalizeRangeKeys(startKey, endKey);
      const nextRangeNotes = state.rangeNotes.filter(
        (note) =>
          !(
            note.startKey === normalized.startKey &&
            note.endKey === normalized.endKey
          ),
      );

      const nextState = {
        monthNotes: state.monthNotes,
        dayNotes: state.dayNotes,
        rangeNotes: nextRangeNotes,
      };

      persistNotes(nextState);
      return nextState;
    });
  },
}));

export function getNoteTargetLabel(target: NoteTarget) {
  switch (target.kind) {
    case "month":
      return formatMonthKey(target.monthKey);
    case "day":
      return formatDateKey(target.dateKey);
    case "range":
      return `${formatDateKey(target.startKey)} - ${formatDateKey(target.endKey)}`;
  }
}
