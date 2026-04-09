"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { motion as m } from "motion/react";
import {
  getDateNoteSelectionOptions,
  getNoteTargetLabel,
  type NoteTarget,
  isSameNoteTarget,
  useNotesStore,
} from "~/lib/notes-store";
import Notes from "./notes";

interface StickyNotePanelProps {
  target: NoteTarget;
  onClose: () => void;
}

export function StickyNotePanel({ target, onClose }: StickyNotePanelProps) {
  const deleteMonthNote = useNotesStore((state) => state.deleteMonthNote);
  const deleteDayNote = useNotesStore((state) => state.deleteDayNote);
  const deleteRangeNote = useNotesStore((state) => state.deleteRangeNote);
  const dayNotes = useNotesStore((state) => state.dayNotes);
  const rangeNotes = useNotesStore((state) => state.rangeNotes);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [progressCycle, setProgressCycle] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState(target);
  const clipPathId = useId().replace(/:/g, "");

  const selectionOptions = useMemo(() => {
    if (target.kind === "month") return [];

    const dateKey = target.kind === "day" ? target.dateKey : target.startKey;
    const options = getDateNoteSelectionOptions(dateKey, {
      dayNotes,
      rangeNotes,
    });
    const targetAlreadyIncluded = options.some((option) =>
      isSameNoteTarget(option.target, target),
    );

    if (!targetAlreadyIncluded) {
      options.unshift({
        target,
        title: target.kind === "day" ? "Date note" : "Range note",
        detail: getNoteTargetLabel(target),
      });
    }

    return options;
  }, [dayNotes, rangeNotes, target]);

  const selectedIndex = selectionOptions.findIndex((option) =>
    isSameNoteTarget(option.target, selectedTarget),
  );
  const currentNoteIndex =
    selectedIndex >= 0
      ? selectedIndex + 1
      : selectionOptions.length > 0
        ? 1
        : 0;
  const totalNotes = selectionOptions.length;

  const restartInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    setProgressCycle((value) => value + 1);
    inactivityTimerRef.current = setTimeout(() => {
      onClose();
    }, 5000);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    restartInactivityTimer();
  }, [target, restartInactivityTimer]);

  useEffect(() => {
    setSelectedTarget(target);
  }, [target]);

  useEffect(() => {
    if (target.kind === "month") {
      setSelectedTarget(target);
      return;
    }

    if (selectionOptions.length === 0) {
      setSelectedTarget(target);
      return;
    }

    const currentSelectionExists = selectionOptions.some((option) =>
      isSameNoteTarget(option.target, selectedTarget),
    );

    if (!currentSelectionExists) {
      const nextTarget = selectionOptions[0]?.target;
      setSelectedTarget(nextTarget ?? target);
    }
  }, [selectionOptions, selectedTarget, target]);

  const handleActivityChange = () => {
    restartInactivityTimer();
  };

  const handleDelete = () => {
    if (selectedTarget.kind === "month") {
      deleteMonthNote(selectedTarget.monthKey);
    } else if (selectedTarget.kind === "day") {
      deleteDayNote(selectedTarget.dateKey);
    } else {
      deleteRangeNote(selectedTarget.startKey, selectedTarget.endKey);
    }
  };

  const handleSelectTarget = (nextTarget: NoteTarget) => {
    setSelectedTarget(nextTarget);
    restartInactivityTimer();
  };

  const handlePreviousNote = () => {
    if (selectionOptions.length === 0) return;

    const previousIndex =
      selectedIndex > 0 ? selectedIndex - 1 : selectionOptions.length - 1;
    const nextTarget = selectionOptions[previousIndex]?.target;

    if (!nextTarget) return;

    handleSelectTarget(nextTarget);
  };

  const handleNextNote = () => {
    if (selectionOptions.length === 0) return;

    const nextIndex =
      selectedIndex >= 0 && selectedIndex < selectionOptions.length - 1
        ? selectedIndex + 1
        : 0;
    const nextTarget = selectionOptions[nextIndex]?.target;

    if (!nextTarget) return;

    handleSelectTarget(nextTarget);
  };

  const pagerButtonClass =
    "bg-secondary ring-muted-foreground/20 text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0.75 shadow-2xs ring transition-transform duration-500 ease-in-out outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95";

  const pagerCounterClass =
    "bg-secondary/50 ring-muted-foreground/10 text-foreground flex h-8 min-w-16 items-center justify-center rounded-full px-3 text-xs font-semibold tracking-wide shadow-2xs ring";

  return (
    <div className="relative h-88 w-80 -translate-y-16 -rotate-2 md:translate-y-0">
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
            <path d="M0.022,0.045 L0.066,0.015 L0.108,0.042 L0.152,0.018 L0.194,0.044 L0.238,0.017 L0.282,0.046 L0.326,0.019 L0.372,0.045 L0.418,0.016 L0.462,0.043 L0.506,0.018 L0.552,0.046 L0.598,0.017 L0.644,0.045 L0.69,0.018 L0.736,0.048 L0.782,0.02 L0.828,0.049 L0.874,0.022 L0.92,0.05 L0.96,0.08 L0.982,0.124 L0.968,0.172 L0.986,0.22 L0.966,0.266 L0.986,0.314 L0.964,0.36 L0.984,0.41 L0.962,0.456 L0.984,0.506 L0.96,0.552 L0.982,0.602 L0.958,0.648 L0.98,0.698 L0.956,0.744 L0.978,0.794 L0.954,0.84 L0.972,0.892 L0.95,0.94 L0.908,0.972 L0.862,0.956 L0.816,0.984 L0.77,0.954 L0.724,0.982 L0.678,0.952 L0.632,0.98 L0.586,0.95 L0.54,0.978 L0.494,0.952 L0.448,0.98 L0.402,0.95 L0.356,0.978 L0.31,0.95 L0.264,0.98 L0.218,0.952 L0.172,0.982 L0.126,0.954 L0.082,0.98 L0.042,0.956 L0.018,0.912 L0.034,0.864 L0.014,0.816 L0.036,0.77 L0.014,0.722 L0.038,0.676 L0.016,0.628 L0.04,0.582 L0.018,0.534 L0.042,0.488 L0.02,0.44 L0.044,0.394 L0.022,0.346 L0.046,0.3 L0.024,0.252 L0.048,0.206 L0.026,0.158 L0.05,0.112 L0.028,0.066 Z" />
          </clipPath>
        </defs>
      </svg>

      {totalNotes > 1 && (
        <div className="bg-card/90 border-border/60 absolute -bottom-14 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border p-1 shadow-md backdrop-blur-xs">
          <button
            type="button"
            onClick={handlePreviousNote}
            className={pagerButtonClass}
            aria-label="Previous note"
          >
            <CaretLeftIcon />
          </button>
          <div className={pagerCounterClass} aria-label="Current note count">
            {currentNoteIndex}/{totalNotes}
          </div>
          <button
            type="button"
            onClick={handleNextNote}
            className={pagerButtonClass}
            aria-label="Next note"
          >
            <CaretRightIcon />
          </button>
        </div>
      )}

      <div className="pointer-events-none absolute -top-2 left-1/2 z-40 h-8 w-20 -translate-x-1/2 -rotate-6 bg-amber-200/70 shadow-sm dark:bg-amber-300/25" />

      <div
        className="border-foreground/20 bg-secondary/70 dark:bg-secondary/60 relative z-20 h-full w-full overflow-hidden border p-10"
        style={{
          clipPath: `url(#${clipPathId})`,
          filter: "drop-shadow(0 16px 22px rgba(0,0,0,0.24))",
        }}
      >
        <div className="relative flex h-full flex-col gap-2">
          <div className="bg-foreground/8 flex items-center justify-between rounded-md px-2 py-1">
            <div className="text-foreground/75 font-kalam min-w-0 pr-2 text-xs font-semibold">
              <span className="block truncate">
                {getNoteTargetLabel(selectedTarget)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDelete}
                className="text-foreground/65 hover:bg-foreground/10 hover:text-foreground rounded-full p-1 transition-colors"
                aria-label="Delete note"
              >
                <TrashIcon size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-foreground/65 hover:bg-foreground/10 hover:text-foreground rounded-full p-1 transition-colors"
                aria-label="Close note"
              >
                <CheckIcon size={14} weight="bold" />
              </button>
            </div>
          </div>

          <Notes
            target={selectedTarget}
            showLabel={false}
            autoFocus
            compact
            frame={false}
            className="text-foreground h-full"
            onActivityChange={handleActivityChange}
            onSubmit={onClose}
          />
        </div>
      </div>

      <div className="bg-card/90 border-border/70 pointer-events-none absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-md">
        <svg
          viewBox="0 0 32 32"
          className="h-8 w-8 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="16"
            cy="16"
            r="12"
            className="stroke-foreground/20 fill-none"
            strokeWidth="2"
          />
          <m.circle
            key={`${progressCycle}-${getNoteTargetLabel(target)}`}
            cx="16"
            cy="16"
            r="12"
            className="stroke-foreground/55 fill-none"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: 0 }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </svg>
      </div>
    </div>
  );
}
