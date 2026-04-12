"use client";

import { useEffect, useState } from "react";
import { measureText } from "pretext";

interface PretextBadgeProps {
  children: string;
  className?: string;
}

/**
 * PretextBadge - demonstrates Pretext for badge text measurement.
 *
 * Instead of relying on DOM to measure text for proper sizing,
 * Pretext calculates dimensions mathematically - no reflow.
 *
 * This enables consistent, predictable badge sizes without
 * waiting for DOM render.
 */
export function PretextBadge({ children, className = "" }: PretextBadgeProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Pre-calculate with Pretext - no DOM needed!
    const result = measureText({
      text: children,
      width: 200,
      fontSize: 10,
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.4,
    });
    setDimensions({ width: result.width, height: result.height });
  }, [children]);

  return (
    <span
      className={`border-primary/20 bg-primary/[0.08] text-primary absolute top-[18px] right-4 rounded-[4px] border px-[7px] py-[2px] font-mono text-[10px] font-bold tracking-[0.04em] ${className}`}
      style={{
        // Use Pretext-calculated dimensions for precise sizing
        minWidth: Math.max(dimensions.width + 14, 50),
      }}
    >
      {children}
    </span>
  );
}

/**
 * PretextChip - chip component with pre-calculated dimensions.
 * Useful for feature tags that need consistent sizing.
 */
export function PretextChip({ children, className = "" }: PretextBadgeProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const result = measureText({
      text: children,
      width: 300,
      fontSize: 10,
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.4,
    });
    setDimensions({ width: result.width, height: result.height });
  }, [children]);

  return (
    <span
      className={`border-border/60 bg-card/60 text-muted/55 inline-block rounded-[4px] border px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] uppercase ${className}`}
      style={{
        minWidth: dimensions.width + 20,
      }}
    >
      {children}
    </span>
  );
}
