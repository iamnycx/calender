"use client";

import Container from "~/components/container";
import { ModeToggle } from "~/components/mode-toggle";
import MonthControls from "~/components/month-controls";
import { StripedPattern } from "~/components/stripe";
import { ZenModeToggle } from "~/components/zen-mode-toggle";
import { AnimatedCalendarView } from "~/components/animated-calendar-view";
import { ProgressiveBlur } from "~/components/progressive-blur";

export default function HomePage() {
  return (
    <>
      <StripedPattern className="text-foreground/30" />
      <Container className="border-secondary-foreground bg-background dark:border-secondary-foreground/25 border-x border-dashed">
        <div className="h-screen">
          <div className="border-secondary-foreground dark:border-secondary-foreground/25 absolute inset-x-0 inset-y-10 border-y border-dashed">
            {/* Root parent Everything should be below this do not put any element outside it visualy or in code */}
            <Container className="flex h-full flex-col">
              <header className="flex items-center justify-between py-2 px-12">
                <ZenModeToggle />
                <ModeToggle />
              </header>
              <div className="b relative overflow-hidden grid mx-0.5 flex-1 place-items-center gap-12">
                {/* Root parent Everything should be below this do not put any element outside it visualy or in code */}
                <AnimatedCalendarView />
                <ProgressiveBlur />
              </div>
              <footer className="mt-auto flex items-center justify-between py-2 px-12">
                <h1 className="text-2xl">Calendar</h1>
                <MonthControls />
              </footer>
            </Container>
          </div>
        </div>
      </Container>
    </>
  );
}
