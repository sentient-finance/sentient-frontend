"use client";

import { useEffect, useRef, useState } from "react";
import { measureText, type MeasureOptions } from "pretext";

interface PretextMeasureProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  width?: number;
  className?: string;
}

/**
 * PretextDemo - demonstrates Pretext library for text measurement.
 *
 * Pretext computes text dimensions WITHOUT triggering DOM reflow,
 * enabling smooth 60fps animations and better performance.
 *
 * Learn more: https://github.com/chenglou/pretext
 */
export function PretextDemo({
  text,
  fontSize = 16,
  fontFamily = "Arial, sans-serif",
  lineHeight = 1.5,
  width = 300,
  className = "",
}: PretextMeasureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [usePretext, setUsePretext] = useState(true);

  useEffect(() => {
    const options: MeasureOptions = {
      text,
      width,
      fontSize,
      fontFamily,
      lineHeight,
    };

    if (usePretext) {
      // Pretext: Compute WITHOUT DOM access - no reflow!
      const result = measureText(options);
      setDimensions({ width: result.width, height: result.height });
    } else {
      // DOM way: Triggers reflow - bad for performance
      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        visibility: hidden;
        font-size: ${fontSize}px;
        font-family: ${fontFamily};
        line-height: ${lineHeight};
        width: ${width}px;
        white-space: pre-wrap;
        word-wrap: break-word;
      `;
      el.textContent = text;
      document.body.appendChild(el);
      const rect = el.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      document.body.removeChild(el);
    }
  }, [text, fontSize, fontFamily, lineHeight, width, usePretext]);

  return (
    <div ref={containerRef} className={className}>
      {/* Method Toggle */}
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => setUsePretext(true)}
          className={`rounded px-3 py-1 text-xs transition-colors ${
            usePretext ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pretext (No Reflow)
        </button>
        <button
          onClick={() => setUsePretext(false)}
          className={`rounded px-3 py-1 text-xs transition-colors ${
            !usePretext ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          DOM (Reflow)
        </button>
        <span className="text-muted text-xs">
          Method: {usePretext ? "✓ Pretext arithmetic" : "✗ getBoundingClientRect"}
        </span>
      </div>

      {/* Text Display */}
      <div
        className="border-border bg-card rounded-lg border p-4"
        style={{
          width,
          wordWrap: "break-word",
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight,
        }}
      >
        {text}
      </div>

      {/* Dimensions Output */}
      <div className="text-muted mt-3 font-mono text-xs">
        Dimensions: {dimensions.width.toFixed(1)}px × {dimensions.height.toFixed(1)}px
      </div>
    </div>
  );
}

/**
 * AnimatedText - demonstrates Pretext for smooth text animations.
 * Uses Pretext to pre-calculate text bounds before animation.
 */
export function AnimatedText({
  text,
  fontSize = 48,
  className = "",
}: {
  text: string;
  fontSize?: number;
  className?: string;
}) {
  const [scale, setScale] = useState(0.5);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pre-calculate with Pretext - no DOM measurement needed
    const result = measureText({
      text,
      width: 500,
      fontSize,
      fontFamily: "Arial",
      lineHeight: 1.2,
    });
    setDimensions({ width: result.width, height: result.height });

    // Animate scale
    let start: number | null = null;
    const duration = 1000;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setScale(0.5 + ease * 0.5);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [text, fontSize]);

  return (
    <div ref={containerRef} className={className}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          fontSize: `${fontSize}px`,
          fontFamily: "Arial",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          color: "#e6eeff",
          textShadow: "0 0 30px rgba(96, 165, 255, 0.5)",
        }}
      >
        {text}
      </div>
      <div className="text-muted mt-2 font-mono text-xs">
        Pre-calculated: {dimensions.width.toFixed(0)}px × {dimensions.height.toFixed(0)}px
      </div>
    </div>
  );
}
