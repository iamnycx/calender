"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MAX_NOTE_LENGTH,
  type NoteTarget,
  getNoteTargetLabel,
  useNotesStore,
} from "~/lib/notes-store";
import { splitTextIntoLines } from "~/lib/text-utils";

interface NotesProps {
  target: NoteTarget;
  className?: string;
  showLabel?: boolean;
  autoFocus?: boolean;
  compact?: boolean;
  frame?: boolean;
  _onDelete?: () => void;
  onActivityChange?: () => void;
  onSubmit?: () => void;
}

function getValueForTarget(
  target: NoteTarget,
  state: ReturnType<typeof useNotesStore.getState>,
) {
  switch (target.kind) {
    case "month":
      return state.monthNotes[target.monthKey]?.text ?? "";
    case "day":
      return state.dayNotes[target.dateKey]?.text ?? "";
    case "range":
      return (
        state.rangeNotes.find(
          (note) =>
            note.startKey === target.startKey && note.endKey === target.endKey,
        )?.text ?? ""
      );
  }
}

function getPlaceholder(target: NoteTarget) {
  switch (target.kind) {
    case "month":
      return "Add a month note...";
    case "day":
      return "Add a day note...";
    case "range":
      return "Add a range note...";
  }
}

export default function Notes({
  target,
  className,
  showLabel = true,
  autoFocus = false,
  compact = false,
  frame = true,
  _onDelete,
  onActivityChange,
  onSubmit,
}: NotesProps) {
  const hydrateNotes = useNotesStore((state) => state.hydrateNotes);
  const setMonthNote = useNotesStore((state) => state.setMonthNote);
  const setDayNote = useNotesStore((state) => state.setDayNote);
  const setRangeNote = useNotesStore((state) => state.setRangeNote);
  const noteValue = useNotesStore((state) => getValueForTarget(target, state));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noteLines = useMemo(
    () => splitTextIntoLines(noteValue, 9),
    [noteValue],
  );
  const visibleLineCount = noteLines.filter(Boolean).length;
  const ruledPaperStyle = {
    backgroundImage:
      "repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.5rem - 1px), rgba(0, 0, 0, 0.12) calc(1.5rem - 1px), rgba(0, 0, 0, 0.12) 1.5rem)",
  };

  useEffect(() => {
    hydrateNotes();
  }, [hydrateNotes]);

  useEffect(() => {
    if (!autoFocus) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const end = textarea.value.length;
    textarea.setSelectionRange(end, end);
  }, [autoFocus, noteValue]);

  const label = useMemo(() => getNoteTargetLabel(target), [target]);

  const updateNote = (nextValue: string) => {
    const value = nextValue.slice(0, MAX_NOTE_LENGTH);

    switch (target.kind) {
      case "month":
        setMonthNote(target.monthKey, value);
        break;
      case "day":
        setDayNote(target.dateKey, value);
        break;
      case "range":
        setRangeNote(target.startKey, target.endKey, value);
        break;
    }

    onActivityChange?.();
  };

  const submitNote = () => {
    onSubmit?.();
  };

  return (
    <div
      className={`flex h-full flex-col ${frame ? `border-foreground/15 bg-secondary/15 rounded-2xl border border-dashed shadow-sm ${compact ? "p-3" : "p-4"}` : ""} ${className ?? ""}`}
    >
      {showLabel && (
        <div className="font-kalam text-foreground/45 mb-3 text-left text-[0.65rem] font-semibold tracking-[0.28em] uppercase">
          {label}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={noteValue}
        onChange={(event) => updateNote(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          if (event.nativeEvent.isComposing) return;

          event.preventDefault();
          submitNote();
        }}
        onBeforeInput={(event) => {
          const nativeEvent = event.nativeEvent;
          if (nativeEvent.inputType !== "insertLineBreak") return;

          event.preventDefault();
          submitNote();
        }}
        maxLength={MAX_NOTE_LENGTH}
        rows={9}
        placeholder={getPlaceholder(target)}
        spellCheck={false}
        style={ruledPaperStyle}
        className={`font-kalam placeholder:text-foreground/30 min-h-24 w-full flex-1 resize-none border-none bg-transparent p-0 text-base leading-6 outline-none ${compact ? "min-h-18" : "min-h-24"}`}
      />
      <div className="font-kalam text-foreground/35 mt-3 text-right text-[0.62rem]">
        {visibleLineCount}/9 lines • {noteValue.length}/{MAX_NOTE_LENGTH}
      </div>
    </div>
  );
}
