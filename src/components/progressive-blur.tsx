"use client";

import React from "react";

type BlurPosition = "top" | "bottom" | "left" | "right";

const BLUR_LEVELS = [0.5, 1, 2, 4, 8, 16, 32, 64];
const EDGE_SIZE = "4%";

function EdgeBlur({ position }: { position: BlurPosition }) {
  const normalizedPosition: BlurPosition = position;

  const baseClasses = "gradient-blur pointer-events-none absolute z-10";
  const positionClasses =
    normalizedPosition === "top"
      ? "inset-x-0 top-0"
      : normalizedPosition === "bottom"
        ? "inset-x-0 bottom-0"
        : normalizedPosition === "left"
          ? "inset-y-0 left-0"
          : "inset-y-0 right-0";

  const maskGradientForStops = (
    startPercent: number,
    midPercent: number,
    endPercent: number,
  ) => {
    const direction =
      normalizedPosition === "bottom"
        ? "to bottom"
        : normalizedPosition === "top"
          ? "to top"
          : normalizedPosition === "left"
            ? "to left"
            : "to right";

    return `linear-gradient(${direction}, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${Math.min(endPercent + 12.5, 100)}%)`;
  };

  // Create array with length equal to blurLevels.length - 2 (for before/after pseudo elements)
  const divElements = Array(BLUR_LEVELS.length - 2).fill(null);

  return (
    <div
      className={`${baseClasses} ${positionClasses}`}
      style={{
        height:
          normalizedPosition === "top" || normalizedPosition === "bottom"
            ? EDGE_SIZE
            : "100%",
        width:
          normalizedPosition === "left" || normalizedPosition === "right"
            ? EDGE_SIZE
            : "100%",
      }}
    >
      {/* First blur layer (pseudo element) */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${BLUR_LEVELS[0]}px)`,
          WebkitBackdropFilter: `blur(${BLUR_LEVELS[0]}px)`,
          maskImage: maskGradientForStops(0, 12.5, 25),
          WebkitMaskImage: maskGradientForStops(0, 12.5, 25),
        }}
      />

      {/* Middle blur layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1;
        const startPercent = blurIndex * 12.5;
        const midPercent = (blurIndex + 1) * 12.5;
        const endPercent = (blurIndex + 2) * 12.5;

        const maskGradient = maskGradientForStops(
          startPercent,
          midPercent,
          endPercent,
        );

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${BLUR_LEVELS[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${BLUR_LEVELS[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        );
      })}

      {/* Last blur layer (pseudo element) */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: BLUR_LEVELS.length,
          backdropFilter: `blur(${BLUR_LEVELS[BLUR_LEVELS.length - 1]}px)`,
          WebkitBackdropFilter: `blur(${BLUR_LEVELS[BLUR_LEVELS.length - 1]}px)`,
          maskImage: maskGradientForStops(87.5, 100, 100),
          WebkitMaskImage: maskGradientForStops(87.5, 100, 100),
        }}
      />
    </div>
  );
}

export function ProgressiveBlur() {
  return (
    <>
      <EdgeBlur position="bottom" />
      <EdgeBlur position="top" />
      <EdgeBlur position="left" />
      <EdgeBlur position="right" />
    </>
  );
}
