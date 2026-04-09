"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useCalendarStore } from "~/lib/calendar-store";

const MONTH_KEYS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export default function HeroImage() {
  const { resolvedTheme } = useTheme();
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const mode = resolvedTheme === "dark" ? "night" : "day";
  const monthKey = MONTH_KEYS[currentMonth.getMonth()] ?? "jan";
  const imageSrc = `/img/${monthKey}-${mode}.png`;

  return (
    <>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath
            id="calendar-image-clip-mobile"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M1,0 L1,0.45 L0.47,0.73 Q0.40,0.75 0.33,0.72 L0,0.6 L0,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative inset-x-0 top-0 h-96 overflow-hidden select-none md:inset-y-0 md:left-0 md:h-full md:w-[38%]">
        <div
          className="absolute inset-0 md:hidden"
          style={{ clipPath: "url(#calendar-image-clip-mobile)" }}
        >
          <Image
            src={imageSrc}
            fill
            alt=""
            draggable={false}
            className="pointer-events-none object-cover select-none"
          />
        </div>
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={imageSrc}
            fill
            alt=""
            draggable={false}
            className="pointer-events-none object-cover select-none"
          />
        </div>
      </div>
    </>
  );
}
