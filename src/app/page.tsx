import Container from "~/components/container";
import { AnimatedCalendarView } from "~/components/animated-calendar-view";
import { StripedPattern } from "~/components/stripe";
import { ProgressiveBlur } from "~/components/progressive-blur";
import {
  AnimatedPageFooter,
  AnimatedPageHeader,
} from "~/components/page-chrome-animations";

export default function HomePage() {
  return (
    <>
      <StripedPattern className="text-foreground/30" />
      <Container className="border-secondary-foreground bg-background dark:border-secondary-foreground/25 border-x border-dashed">
        <div className="h-screen">
          <div className="border-secondary-foreground dark:border-secondary-foreground/25 absolute inset-x-0 inset-y-10 border-y border-dashed">
            <Container className="flex h-full flex-col">
              <AnimatedPageHeader />
              <div className="relative mx-0.5 grid flex-1 place-items-center gap-12 overflow-hidden">
                <AnimatedCalendarView />
                <ProgressiveBlur />
              </div>
              <AnimatedPageFooter />
            </Container>
          </div>
        </div>
      </Container>
    </>
  );
}
