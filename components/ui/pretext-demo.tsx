"use client";

import { useEffect, useState, useRef } from "react";
import { measureText, breakText, type MeasureOptions } from "pretext";

// ═══════════════════════════════════════════════════════════════════════════
// PretextDemo - Interactive comparison component
// ═══════════════════════════════════════════════════════════════════════════

interface PretextDemoProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  width?: number;
  className?: string;
}

export function PretextDemo({
  text,
  fontSize = 16,
  fontFamily = "Arial, sans-serif",
  lineHeight = 1.5,
  width = 300,
  className = "",
}: PretextDemoProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [usePretext, setUsePretext] = useState(true);
  const [domDimensions, setDomDimensions] = useState({ width: 0, height: 0 });

  // Pretext calculation
  useEffect(() => {
    const result = measureText({
      text,
      width,
      fontSize,
      fontFamily,
      lineHeight,
    });
    setDimensions({ width: result.width, height: result.height });
  }, [text, fontSize, fontFamily, lineHeight, width]);

  // DOM calculation (for comparison)
  useEffect(() => {
    if (!usePretext) {
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
      setDomDimensions({ width: rect.width, height: rect.height });
      document.body.removeChild(el);
    }
  }, [usePretext, text, fontSize, fontFamily, lineHeight, width]);

  const displayDimensions = usePretext ? dimensions : domDimensions;

  return (
    <div ref={undefined} className={className}>
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
          Method: {usePretext ? "✓ Pretext" : "✗ getBoundingClientRect"}
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
        Dimensions: {displayDimensions.width.toFixed(1)}px × {displayDimensions.height.toFixed(1)}px
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AnimatedText - Smooth text animation using Pretext pre-calculation
// ═══════════════════════════════════════════════════════════════════════════

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
      const ease = 1 - Math.pow(1 - progress, 3);
      setScale(0.5 + ease * 0.5);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [text, fontSize]);

  return (
    <div className={className}>
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

// ═══════════════════════════════════════════════════════════════════════════
// PretextAccordion - Accordion with pre-calculated heights
// ═══════════════════════════════════════════════════════════════════════════

interface AccordionItem {
  title: string;
  content: string;
}

interface PretextAccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function PretextAccordion({ items, className = "" }: PretextAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<Record<number, number>>({});

  useEffect(() => {
    const newHeights: Record<number, number> = {};
    items.forEach((item, i) => {
      const result = measureText({
        text: item.content,
        width: 400,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
      });
      newHeights[i] = result.height;
    });
    setHeights(newHeights);
  }, [items]);

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="border-border overflow-hidden rounded-lg border">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="bg-foreground/5 hover:bg-foreground/10 flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
          >
            <span className="font-semibold">{item.title}</span>
            <span className="text-muted text-xl">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div
              className="text-muted px-4 py-3 text-sm"
              style={{ minHeight: (heights[i] || 0) + 24 }}
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PretextBubbles - Message bubbles with pre-calculated sizes
// ═══════════════════════════════════════════════════════════════════════════

interface Message {
  text: string;
  align: "left" | "right";
}

interface PretextBubblesProps {
  messages: Message[];
  maxWidth?: number;
  className?: string;
}

export function PretextBubbles({ messages, maxWidth = 280, className = "" }: PretextBubblesProps) {
  const [dimensions, setDimensions] = useState<Record<number, { width: number; height: number }>>(
    {}
  );

  useEffect(() => {
    const newDims: Record<number, { width: number; height: number }> = {};
    messages.forEach((msg, i) => {
      const result = measureText({
        text: msg.text,
        width: maxWidth,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.4,
      });
      newDims[i] = { width: result.width, height: result.height };
    });
    setDimensions(newDims);
  }, [messages, maxWidth]);

  return (
    <div className={`space-y-3 ${className}`}>
      {messages.map((msg, i) => {
        const dim = dimensions[i] || { width: maxWidth, height: 40 };
        return (
          <div
            key={i}
            className={`flex ${msg.align === "right" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[300px] rounded-2xl px-4 py-2 text-sm ${
                msg.align === "right"
                  ? "rounded-br-md bg-blue-500 text-white"
                  : "rounded-bl-md bg-gray-200 text-gray-900"
              }`}
              style={{ minHeight: dim.height + 24 }}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PretextMasonry - Card grid with pre-calculated heights
// ═══════════════════════════════════════════════════════════════════════════

interface MasonryCard {
  title: string;
  description: string;
  color: string;
}

interface PretextMasonryProps {
  cards: MasonryCard[];
  columnWidth?: number;
  className?: string;
}

export function PretextMasonry({ cards, columnWidth = 200, className = "" }: PretextMasonryProps) {
  const [cardHeights, setCardHeights] = useState<Record<number, number>>({});

  useEffect(() => {
    const heights: Record<number, number> = {};
    cards.forEach((card, i) => {
      const titleResult = measureText({
        text: card.title,
        width: columnWidth,
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.4,
      });
      const descResult = measureText({
        text: card.description,
        width: columnWidth,
        fontSize: 12,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
      });
      heights[i] = titleResult.height + descResult.height + 40;
    });
    setCardHeights(heights);
  }, [cards, columnWidth]);

  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      {cards.map((card, i) => (
        <div
          key={i}
          className={`${card.color} rounded-lg p-4 text-white`}
          style={{ minHeight: cardHeights[i] || 100 }}
        >
          <h4 className="mb-2 text-base font-bold">{card.title}</h4>
          <p className="text-sm text-white/80">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PretextRichText - Rich text with inline formatting
// ═══════════════════════════════════════════════════════════════════════════

interface RichTextPart {
  type: "text" | "bold" | "italic" | "code" | "chip";
  content: string;
  color?: string;
}

interface PretextRichTextProps {
  parts: RichTextPart[];
  width?: number;
  className?: string;
}

export function PretextRichText({ parts, width = 500, className = "" }: PretextRichTextProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Calculate total text width
    const textContent = parts.map((p) => p.content).join("");
    const result = measureText({
      text: textContent,
      width,
      fontSize: 16,
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.5,
    });
    setDimensions({ width: result.width, height: result.height });
  }, [parts, width]);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2" style={{ width }}>
        {parts.map((part, i) => {
          if (part.type === "bold") return <strong key={i}>{part.content}</strong>;
          if (part.type === "italic") return <em key={i}>{part.content}</em>;
          if (part.type === "code")
            return (
              <code key={i} className="bg-foreground/10 rounded px-1.5 py-0.5 font-mono text-sm">
                {part.content}
              </code>
            );
          if (part.type === "chip")
            return (
              <span
                key={i}
                className={`inline-block rounded-full px-2 py-1 text-sm ${part.color || "bg-blue-500/20 text-blue-500"}`}
              >
                {part.content}
              </span>
            );
          return <span key={i}>{part.content}</span>;
        })}
      </div>
      <div className="text-muted mt-2 font-mono text-xs">
        {dimensions.width.toFixed(1)}px × {dimensions.height.toFixed(1)}px
      </div>
    </div>
  );
}
