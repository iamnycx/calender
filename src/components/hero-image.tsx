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
          <clipPath id="calendar-image-clip" clipPathUnits="objectBoundingBox">
            <path d="M1,0 L1,0.45 L0.47,0.73 Q0.40,0.75 0.33,0.72 L0,0.6 L0,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative inset-x-0 top-0 h-96 overflow-visible">
        <div
          className="absolute inset-0"
          style={{ clipPath: "url(#calendar-image-clip)" }}
        >
          <Image src={imageSrc} fill alt="" className="aspect-square" />
        </div>
      </div>
    </>
  );
}
