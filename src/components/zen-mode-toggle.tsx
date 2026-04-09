"use client";

import * as React from "react";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import { motion as m } from "motion/react";
import { useZenModeStore } from "~/lib/zen-mode-store";

export function ZenModeToggle() {
  const { isZenMode, toggleZenMode } = useZenModeStore();

  const handleToggle = () => {
    toggleZenMode();
  };

  return (
    <button
      onClick={handleToggle}
      className="bg-secondary/50 ring-muted-foreground/10 flex w-14 cursor-pointer items-center justify-between rounded-full p-0.75 shadow-2xs ring transition-transform duration-500 ease-in-out outline-none dark:justify-end"
      aria-label="Toggle Zen Mode"
    >
      <span className="relative grid h-6 w-6 place-items-center rounded-full">
        <EyeIcon
          weight="duotone"
          className={`absolute z-10 transition-opacity duration-500 ease-in-out ${isZenMode ? "opacity-15" : "opacity-100"}`}
        />
        {!isZenMode && (
          <m.span
            layout
            layoutId="zen-mode-toggle-active"
            className="bg-secondary ring-muted-foreground/10 absolute inset-0 rounded-full ring"
          />
        )}
      </span>
      <span className="relative grid h-6 w-6 place-items-center rounded-full">
        <EyeClosedIcon
          weight="duotone"
          className={`absolute z-10 transition-opacity duration-500 ease-in-out ${isZenMode ? "opacity-100" : "opacity-15"}`}
        />
        {isZenMode && (
          <m.span
            layout
            layoutId="zen-mode-toggle-active"
            className="bg-secondary ring-muted-foreground/10 absolute inset-0 rounded-full ring"
          />
        )}
      </span>
    </button>
  );
}
