"use client";

import * as React from "react";
import { useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { MoonStarsIcon, SunDimIcon } from "@phosphor-icons/react";
import { motion as m } from "motion/react";

const TRANSITION_DURATION = 500;

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = resolvedTheme === "dark";

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );

    const applyTheme = () => {
      const newTheme = !isDark;
      setTheme(newTheme ? "dark" : "light");

      const audio = new Audio("/sfx/click-sound.mp3");
      void audio.play();
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const transition = document.startViewTransition(() => {});

    const ready = transition?.ready;
    if (ready !== undefined && ready !== null) {
      void ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: TRANSITION_DURATION,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );

        requestAnimationFrame(() => {
          flushSync(applyTheme);
        });
      });
    }
  }, [isDark, setTheme]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="bg-secondary/50 ring-muted-foreground/10 flex w-14 cursor-pointer items-center justify-between rounded-full p-0.75 shadow-2xs ring transition-transform duration-500 ease-in-out outline-none dark:justify-end"
    >
      <span className="relative grid h-6 w-6 place-items-center rounded-full">
        <SunDimIcon
          weight="duotone"
          className={`absolute z-10 transition-opacity duration-500 ease-in-out ${isDark ? "opacity-15" : "opacity-100"}`}
        />
        {!isDark && (
          <m.span
            layout
            layoutId="mode-toggle-active"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-secondary ring-muted-foreground/10 absolute inset-0 rounded-full ring"
          />
        )}
      </span>
      <span className="relative grid h-6 w-6 place-items-center rounded-full">
        <MoonStarsIcon
          weight="duotone"
          className={`absolute z-10 transition-opacity duration-500 ease-in-out ${isDark ? "opacity-100" : "opacity-15"}`}
        />
        {isDark && (
          <m.span
            layout
            layoutId="mode-toggle-active"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-secondary ring-muted-foreground/10 absolute inset-0 rounded-full ring"
          />
        )}
      </span>
    </button>
  );
}
