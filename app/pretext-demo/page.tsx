"use client";

import { PretextDemo, AnimatedText } from "@/components/ui/pretext-demo";
import { CountUp } from "@/components/ui/count-up";

const DEMO_TEXTS = [
  {
    text: "Rule-Based Automation enables your vault to execute on-chain automatically based on price triggers.",
    width: 320,
    fontSize: 14,
  },
  {
    text: "Circuit breakers halt execution when market conditions are abnormal—protecting capital without manual intervention.",
    width: 400,
    fontSize: 16,
  },
  {
    text: "Cross-Chain Monitoring tracks vault health across 12 EVM chains from a single dashboard.",
    width: 280,
    fontSize: 18,
  },
];

const ANIMATED_HEADLINES = ["AUTOMATE", "YOUR DeFi", "VAULTS"];

export default function PretextDemoPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="border-border bg-card/50 border-b">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Pretext Integration Demo</h1>
              <p className="text-muted mt-1 text-sm">
                Text measurement without DOM reflow - for smooth 60fps animations
              </p>
            </div>
            <a
              href="https://github.com/chenglou/pretext"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              View Pretext Repo →
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Section 1: What is Pretext */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold">Why Pretext?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border-border bg-card rounded-xl border p-6">
              <h3 className="mb-3 text-lg font-semibold text-red-400">❌ DOM Measurement</h3>
              <ul className="text-muted space-y-2 text-sm">
                <li>• Triggers synchronous layout recalculation (reflow)</li>
                <li>• Expensive especially on pages with many elements</li>
                <li>• Can cause lag on user interactions</li>
                <li>• Requires DOM access to measure</li>
              </ul>
            </div>
            <div className="border-border bg-card rounded-xl border p-6">
              <h3 className="mb-3 text-lg font-semibold text-green-400">✓ Pretext (Arithmetic)</h3>
              <ul className="text-muted space-y-2 text-sm">
                <li>• Computes dimensions mathematically</li>
                <li>• No DOM access, no reflow</li>
                <li>• 60fps+ smooth animations</li>
                <li>• Pre-calculate before rendering</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Live Demo */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold">Interactive Demo</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {DEMO_TEXTS.map((demo, i) => (
              <div key={i} className="border-border bg-card rounded-xl border p-6">
                <h3 className="text-muted mb-4 text-sm font-semibold tracking-wider uppercase">
                  Example {i + 1}
                </h3>
                <PretextDemo text={demo.text} width={demo.width} fontSize={demo.fontSize} />
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Animated Headlines */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold">Animated Headlines (Pre-calculated)</h2>
          <div className="border-border bg-card rounded-xl border p-8">
            <div className="mb-4">
              {ANIMATED_HEADLINES.map((line, i) => (
                <AnimatedText
                  key={i}
                  text={line}
                  fontSize={i === 2 ? 64 : 72}
                  className={i > 0 ? "mt-2" : ""}
                />
              ))}
            </div>
            <p className="text-muted text-xs">
              Pretext pre-calculates text dimensions before animation starts. No
              getBoundingClientRect calls during animation = smooth 60fps.
            </p>
          </div>
        </section>

        {/* Section 4: Integration Points in sentient-frontend */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold">Integration Opportunities</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-border bg-card rounded-xl border p-6">
              <h3 className="mb-2 font-semibold">1. CountUp Component</h3>
              <p className="text-muted text-sm">
                Current CountUp uses getBoundingClientRect indirectly via reflow. Pretext could
                pre-calculate number display bounds for smoother animations.
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-6">
              <h3 className="mb-2 font-semibold">2. Stats Grid (HeroSection)</h3>
              <p className="text-muted text-sm">
                Stats display with badges and labels - could use Pretext to pre-calculate all text
                dimensions and avoid reflow during scroll.
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-6">
              <h3 className="mb-2 font-semibold">3. BenefitCard (FeaturesSection)</h3>
              <p className="text-muted text-sm">
                Cards with dynamic text content - Pretext could ensure consistent heights without
                DOM measurement.
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-6">
              <h3 className="mb-2 font-semibold">4. Transaction History Tables</h3>
              <p className="text-muted text-sm">
                Large tables with text-heavy cells - Pretext can help with virtual scrolling and
                dynamic column widths.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Performance Stats */}
        <section>
          <h2 className="mb-6 text-xl font-bold">Pretext Performance</h2>
          <div className="border-border bg-card rounded-xl border p-8">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-primary mb-1 text-3xl font-bold">
                  <CountUp to={70} suffix="K+" />
                </p>
                <p className="text-muted text-xs">Test Cases</p>
              </div>
              <div className="text-center">
                <p className="text-primary mb-1 text-3xl font-bold">
                  <CountUp to={1} suffix="ms" />
                </p>
                <p className="text-muted text-xs">Sub-millisecond</p>
              </div>
              <div className="text-center">
                <p className="text-primary mb-1 text-3xl font-bold">
                  <CountUp to={60} suffix="+" />
                </p>
                <p className="text-muted text-xs">FPS Target</p>
              </div>
              <div className="text-center">
                <p className="text-primary mb-1 text-3xl font-bold">
                  <CountUp to={15} suffix="K" />
                </p>
                <p className="text-muted text-xs">GitHub Stars (3 days)</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
