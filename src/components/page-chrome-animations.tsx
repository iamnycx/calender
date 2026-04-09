"use client";

import { motion as m } from "motion/react";
import { ModeToggle } from "~/components/mode-toggle";
import MonthControls from "~/components/month-controls";
import { ZenModeToggle } from "~/components/zen-mode-toggle";

export function AnimatedPageHeader() {
  return (
    <m.header
      className="flex items-center justify-between px-4 py-4 md:px-12 md:py-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <ZenModeToggle />
      <ModeToggle />
    </m.header>
  );
}

export function AnimatedPageFooter() {
  return (
    <m.footer
      className="mt-auto flex items-center justify-between px-4 py-4 md:px-12 md:py-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-2xl">Calendar</h1>
      <MonthControls />
    </m.footer>
  );
}
