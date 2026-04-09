"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion as m } from "motion/react";
import { StickyNotePanel } from "./sticky-note-panel";
import { ZenCalendar } from "./zen-calendar";
import Calendar from "./calender";
import { useZenModeStore } from "~/lib/zen-mode-store";
import { type NoteTarget, useNotesStore } from "~/lib/notes-store";

export function AnimatedCalendarView() {
  const { isZenMode, setZenMode } = useZenModeStore();
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [activeStickyTarget, setActiveStickyTarget] =
    useState<NoteTarget | null>(null);
  const [closingStickyTarget, setClosingStickyTarget] =
    useState<NoteTarget | null>(null);
  const stickyCleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stickyOpenSoundTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    useNotesStore.getState().hydrateNotes();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateViewportMode = () => {
      setIsCompactViewport(mediaQuery.matches);
    };

    updateViewportMode();
    mediaQuery.addEventListener("change", updateViewportMode);

    return () => {
      mediaQuery.removeEventListener("change", updateViewportMode);
    };
  }, []);

  useEffect(() => {
    const audio = new Audio("/sfx/zen-toggle.mp3");
    void audio.play().catch(() => undefined);
  }, [isZenMode]);

  const PAN_TO_ZEN = { x: -980, y: 620 };
  const PAN_TO_STICKY = { x: -24, y: 660 };
  const panTransition = {
    duration: 1.4,
    ease: "anticipate",
  } as const;
  const stickyHideDelayMs = 1400;

  const clearStickyCleanupTimer = useCallback(() => {
    if (stickyCleanupTimeoutRef.current) {
      clearTimeout(stickyCleanupTimeoutRef.current);
      stickyCleanupTimeoutRef.current = null;
    }
  }, []);

  const playZenToggleSound = useCallback(() => {
    const audio = new Audio("/sfx/zen-toggle.mp3");
    void audio.play().catch(() => undefined);
  }, []);

  const playStickyOpenSound = useCallback(() => {
    if (stickyOpenSoundTimeoutRef.current) {
      clearTimeout(stickyOpenSoundTimeoutRef.current);
    }

    stickyOpenSoundTimeoutRef.current = setTimeout(() => {
      const audio = new Audio("/sfx/pencil-write.mp3");
      void audio.play().catch(() => undefined);
      stickyOpenSoundTimeoutRef.current = null;
    }, 1400);
  }, []);

  const setStickyTarget = useCallback(
    (nextTarget: NoteTarget | null) => {
      if (nextTarget) {
        clearStickyCleanupTimer();
        playZenToggleSound();
        playStickyOpenSound();
        setClosingStickyTarget(null);
        setActiveStickyTarget(nextTarget);
        return;
      }

      playZenToggleSound();

      if (stickyOpenSoundTimeoutRef.current) {
        clearTimeout(stickyOpenSoundTimeoutRef.current);
        stickyOpenSoundTimeoutRef.current = null;
      }

      setActiveStickyTarget((currentTarget) => {
        if (currentTarget) {
          setClosingStickyTarget(currentTarget);
        }
        return null;
      });
    },
    [clearStickyCleanupTimer, playStickyOpenSound, playZenToggleSound],
  );

  useEffect(() => {
    if (!activeStickyTarget && closingStickyTarget) {
      clearStickyCleanupTimer();
      stickyCleanupTimeoutRef.current = setTimeout(() => {
        setClosingStickyTarget(null);
        stickyCleanupTimeoutRef.current = null;
      }, stickyHideDelayMs);
    }
  }, [
    activeStickyTarget,
    clearStickyCleanupTimer,
    closingStickyTarget,
    stickyHideDelayMs,
  ]);

  useEffect(() => {
    return () => {
      clearStickyCleanupTimer();

      if (stickyOpenSoundTimeoutRef.current) {
        clearTimeout(stickyOpenSoundTimeoutRef.current);
      }
    };
  }, [clearStickyCleanupTimer]);

  const visibleStickyTarget = activeStickyTarget ?? closingStickyTarget;

  const cameraTarget = activeStickyTarget
    ? PAN_TO_STICKY
    : isZenMode
      ? PAN_TO_ZEN
      : { x: 0, y: 0 };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <m.div
        className="absolute inset-0"
        animate={cameraTarget}
        transition={panTransition}
      >
        <div
          onDoubleClick={() => setZenMode(true)}
          className={`absolute inset-0 grid place-items-center ${isZenMode || activeStickyTarget ? "pointer-events-none" : "pointer-events-auto cursor-pointer"}`}
          style={
            isCompactViewport
              ? {
                  transform: "scale(0.74)",
                  transformOrigin: "center",
                }
              : undefined
          }
        >
          <Calendar
            activeTarget={activeStickyTarget}
            onOpenNoteTarget={setStickyTarget}
          />
        </div>

        <div
          className={`absolute -top-155 left-245 h-full w-full ${isZenMode && !activeStickyTarget ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <ZenCalendar
            activeTarget={activeStickyTarget}
            onOpenNoteTarget={setStickyTarget}
          />
        </div>

        <div
          className={`absolute -top-155 left-6 h-full w-full ${activeStickyTarget ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <div className="grid h-full w-full place-items-center">
            {visibleStickyTarget && (
              <StickyNotePanel
                target={visibleStickyTarget}
                onClose={() => setStickyTarget(null)}
              />
            )}
          </div>
        </div>
      </m.div>
    </div>
  );
}
