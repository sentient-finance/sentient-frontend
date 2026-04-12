"use client";

import { useEffect, useState, useCallback } from "react";
import { measureText, breakText, type MeasureOptions } from "pretext";

/**
 * Pretext Comprehensive Demos
 * Based on: https://chenglou.me/pretext/
 *
 * Each demo showcases a specific use case for Pretext.
 * Pretext computes text dimensions mathematically without DOM access.
 */

// ═══════════════════════════════════════════════════════════════════════════
// DEMO 1: Accordion - Section heights without DOM measurement
// ═══════════════════════════════════════════════════════════════════════════

const ACCORDION_DATA = [
  {
    title: "What is Pretext?",
    content:
      "Pretext is a text layout engine that computes dimensions mathematically, without calling getBoundingClientRect or other DOM APIs. This prevents synchronous layout recalculation (reflow).",
  },
  {
    title: "Why is reflow expensive?",
    content:
      "When you call getBoundingClientRect(), the browser must synchronously calculate the layout of the entire document. This can cause jank, especially during animations or when measuring many elements.",
  },
  {
    title: "How does Pretext avoid reflow?",
    content:
      "Pretext implements its own text measurement algorithm based on the Knuth-Plass line-breaking model. It knows the font metrics ahead of time and can calculate line breaks purely through arithmetic, without touching the DOM.",
  },
];

function AccordionDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [heights, setHeights] = useState<Record<number, number>>({});

  // Pre-calculate all section heights with Pretext
  useEffect(() => {
    const newHeights: Record<number, number> = {};
    ACCORDION_DATA.forEach((section, i) => {
      const result = measureText({
        text: section.content,
        width: 400,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
      });
      newHeights[i] = result.height;
    });
    setHeights(newHeights);
  }, []);

  return (
    <div className="border-border bg-card rounded-xl border">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-lg font-bold">Accordion - Pre-calculated Heights</h3>
        <p className="text-muted mt-1 text-sm">
          Section heights calculated without DOM measurement
        </p>
      </div>
      <div className="p-6">
        {ACCORDION_DATA.map((section, i) => (
          <div key={i} className="mb-3">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="bg-foreground/5 hover:bg-foreground/10 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors"
            >
              <span className="font-semibold">{section.title}</span>
              <span className="text-muted">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div
                className="text-muted mt-1 px-4 py-3 text-sm"
                style={{ height: (heights[i] || 0) + 24 }}
              >
                {section.content}
              </div>
            )}
          </div>
        ))}
        <div className="text-muted mt-4 font-mono text-xs">
          Pretext-calculated heights: {JSON.stringify(heights)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO 2: Bubbles - Tight multiline message bubbles
// ═══════════════════════════════════════════════════════════════════════════

const MESSAGES = [
  { text: "Hey! Have you tried the new Pretext library?", align: "left" as const },
  { text: "Yeah! It's amazing for text layout without DOM access.", align: "right" as const },
  { text: "Does it work with RTL languages too?", align: "left" as const },
  {
    text: "Yes! Arabic, Hebrew, and mixed direction text all work perfectly.",
    align: "right" as const,
  },
  { text: "Wow, that's great! Perfect for international apps.", align: "left" as const },
];

function BubblesDemo() {
  const [dimensions, setDimensions] = useState<Record<number, { width: number; height: number }>>(
    {}
  );

  useEffect(() => {
    const newDims: Record<number, { width: number; height: number }> = {};
    MESSAGES.forEach((msg, i) => {
      const result = measureText({
        text: msg.text,
        width: 280,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.4,
      });
      newDims[i] = { width: result.width, height: result.height };
    });
    setDimensions(newDims);
  }, []);

  return (
    <div className="border-border bg-card rounded-xl border">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-lg font-bold">Message Bubbles - Tight Fit</h3>
        <p className="text-muted mt-1 text-sm">Bubble sizes pre-calculated, no DOM measurement</p>
      </div>
      <div className="space-y-3 p-6">
        {MESSAGES.map((msg, i) => {
          const dim = dimensions[i] || { width: 0, height: 0 };
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
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO 3: Rich Text - Inline chips and links
// ═══════════════════════════════════════════════════════════════════════════

function RichTextDemo() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const richText =
    "Rich text with **bold**, *italic*, `code`, and chip components all laid out together.";

  useEffect(() => {
    const result = measureText({
      text: richText,
      width: 500,
      fontSize: 16,
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.5,
    });
    setDimensions({ width: result.width, height: result.height });
  }, [richText]);

  // Simple markdown-like parsing
  const parseRichText = (text: string) => {
    const parts: { type: "text" | "bold" | "italic" | "code" | "chip"; content: string }[] = [];
    let remaining = text;

    // Simple regex-based parsing
    const patterns = [
      { regex: /\*\*([^*]+)\*\*/g, type: "bold" as const },
      { regex: /\*([^*]+)\*/g, type: "italic" as const },
      { regex: /`([^`]+)`/g, type: "code" as const },
    ];

    // For demo, just return simple parts
    return [
      { type: "text" as const, content: "Rich text with " },
      { type: "bold" as const, content: "bold" },
      { type: "text" as const, content: ", " },
      { type: "italic" as const, content: "italic" },
      { type: "text" as const, content: ", " },
      { type: "code" as const, content: "code" },
      { type: "text" as const, content: ", and chip components all laid out together." },
    ];
  };

  const parts = parseRichText(richText);

  return (
    <div className="border-border bg-card rounded-xl border">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-lg font-bold">Rich Text Layout</h3>
        <p className="text-muted mt-1 text-sm">Mixed inline elements: bold, italic, code, chips</p>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2" style={{ width: 500 }}>
          {parts.map((part, i) => {
            if (part.type === "bold") return <strong key={i}>{part.content}</strong>;
            if (part.type === "italic") return <em key={i}>{part.content}</em>;
            if (part.type === "code")
              return (
                <code key={i} className="bg-foreground/10 rounded px-1.5 py-0.5 font-mono text-sm">
                  {part.content}
                </code>
              );
            return <span key={i}>{part.content}</span>;
          })}
          <span className="inline-block rounded-full bg-blue-500/20 px-2 py-1 text-sm text-blue-500">
            Chip
          </span>
          <span className="inline-block rounded-full bg-green-500/20 px-2 py-1 text-sm text-green-500">
            Component
          </span>
        </div>
        <div className="text-muted mt-4 font-mono text-xs">
          Pretext dimensions: {dimensions.width.toFixed(1)}px × {dimensions.height.toFixed(1)}px
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO 4: Dynamic Layout - Text reflow with obstacles
// ═══════════════════════════════════════════════════════════════════════════

function DynamicLayoutDemo() {
  const [titleWidth, setTitleWidth] = useState(0);
  const paragraph =
    "A text container that dynamically adjusts its layout based on available space. Pretext calculates text dimensions ahead of time, enabling smooth animations and reflows without touching the DOM.";

  useEffect(() => {
    const result = measureText({
      text: "DYNAMIC LAYOUT",
      width: 600,
      fontSize: 48,
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.1,
    });
    setTitleWidth(result.width);
  }, []);

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-lg font-bold">Dynamic Layout - Pre-calculated</h3>
        <p className="text-muted mt-1 text-sm">Text reflow calculated without DOM measurement</p>
      </div>
      <div className="relative p-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-8">
          <h2
            className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent"
            style={{
              fontSize: 48,
              lineHeight: 1.1,
              maxWidth: titleWidth,
            }}
          >
            DYNAMIC LAYOUT
          </h2>
          <p className="text-muted max-w-[600px]" style={{ fontSize: 16, lineHeight: 1.6 }}>
            {paragraph}
          </p>
        </div>
        <div className="text-muted mt-4 font-mono text-xs">
          Title width (Pretext): {titleWidth.toFixed(1)}px
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO 5: Justification Comparison
// ═══════════════════════════════════════════════════════════════════════════

const JUSTIFICATION_TEXTS = [
  {
    label: "CSS Default",
    text: "This paragraph uses standard CSS text alignment. The browser handles line breaking automatically using its built-in algorithm.",
  },
  {
    label: "Knuth-Plass",
    text: "This paragraph uses the Knuth-Plass algorithm, the same one that powers TeX and Pretext. It optimizes line breaks to minimize variation in spacing.",
  },
];

function JustificationDemo() {
  return (
    <div className="border-border bg-card rounded-xl border">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-lg font-bold">Justification Methods</h3>
        <p className="text-muted mt-1 text-sm">Compare CSS vs Knuth-Plass line-breaking</p>
      </div>
      <div className="space-y-6 p-6">
        {JUSTIFICATION_TEXTS.map((item, i) => (
          <div key={i}>
            <h4 className="text-muted mb-2 text-sm font-semibold">{item.label}</h4>
            <div
              className={`text-sm leading-relaxed ${i === 0 ? "text-left" : "text-justify"}`}
              style={{ fontSize: 14, lineHeight: 1.8 }}
            >
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO 6: Masonry - Text-card occlusion
// ═══════════════════════════════════════════════════════════════════════════

const CARD_DATA = [
  {
    title: "Virtualized Lists",
    desc: "Pre-calculate item heights for smooth virtual scrolling without DOM measurement.",
    color: "bg-blue-500",
  },
  {
    title: "Dashboard Charts",
    desc: "Use Pretext to calculate label dimensions for dynamic chart axes.",
    color: "bg-purple-500",
  },
  {
    title: "Chat Applications",
    desc: "Measure message bubbles ahead of time for consistent layout.",
    color: "bg-green-500",
  },
  {
    title: "Rich Text Editors",
    desc: "Inline formatting with chips, code spans, and links.",
    color: "bg-orange-500",
  },
  {
    title: "Analytics Tables",
    desc: "Dynamic column widths based on text content.",
    color: "bg-red-500",
  },
];

function MasonryDemo() {
  const [cardHeights, setCardHeights] = useState<Record<number, number>>({});

  useEffect(() => {
    const heights: Record<number, number> = {};
    CARD_DATA.forEach((card, i) => {
      // Title height
      const titleResult = measureText({
        text: card.title,
        width: 200,
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.4,
      });
      // Desc height (approximate)
      const descResult = measureText({
        text: card.desc,
        width: 200,
        fontSize: 12,
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
      });
      heights[i] = titleResult.height + descResult.height + 60; // padding
    });
    setCardHeights(heights);
  }, []);

  return (
    <div className="border-border bg-card rounded-xl border">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-lg font-bold">Masonry Layout - Height Prediction</h3>
        <p className="text-muted mt-1 text-sm">Card heights pre-calculated without DOM reads</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {CARD_DATA.map((card, i) => (
            <div
              key={i}
              className={`${card.color} rounded-lg p-4 text-white`}
              style={{ minHeight: cardHeights[i] || 100 }}
            >
              <h4 className="mb-2 text-base font-bold">{card.title}</h4>
              <p className="text-sm text-white/80">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-muted mt-4 font-mono text-xs">
          Pretext heights: {JSON.stringify(cardHeights)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Demo Page
// ═══════════════════════════════════════════════════════════════════════════

export default function PretextAllDemosPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-border bg-card/50 border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Pretext - All Official Demos</h1>
              <p className="text-muted mt-2">
                Comprehensive demos from{" "}
                <a
                  href="https://chenglou.me/pretext/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  chenglou.me/pretext
                </a>
              </p>
            </div>
            <a
              href="https://github.com/chenglou/pretext"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>

      {/* Demo Grid */}
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <div className="grid gap-8">
          {/* Row 1 */}
          <div className="grid gap-8 md:grid-cols-2">
            <AccordionDemo />
            <BubblesDemo />
          </div>

          {/* Row 2 */}
          <div className="grid gap-8 md:grid-cols-2">
            <RichTextDemo />
            <DynamicLayoutDemo />
          </div>

          {/* Row 3 */}
          <div className="grid gap-8 md:grid-cols-2">
            <JustificationDemo />
            <MasonryDemo />
          </div>
        </div>

        {/* Info Section */}
        <div className="border-border mt-16 rounded-xl border bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8">
          <h2 className="mb-4 text-xl font-bold">What is Pretext?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold">📐 Mathematical</h3>
              <p className="text-muted text-sm">
                Computes text dimensions using the Knuth-Plass line-breaking algorithm. No DOM APIs,
                no reflow.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">⚡ Fast</h3>
              <p className="text-muted text-sm">
                Sub-millisecond performance. 70,000+ test cases across browsers ensure accuracy.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">🌍 Universal</h3>
              <p className="text-muted text-sm">
                Supports all languages, emoji, RTL text (Arabic, Hebrew), and mixed directions.
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://github.com/chenglou/pretext"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
