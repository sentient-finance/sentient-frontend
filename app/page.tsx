const steps = [
  {
    title: "Connect Wallet + Network",
    detail: "Connect ví và switch sang Base Sepolia để bắt đầu.",
  },
  {
    title: "Read Vault Data via GraphQL",
    detail: "Dashboard/Vault history đọc qua The Graph cho UX nhanh.",
  },
  {
    title: "Execute Actions via REST",
    detail: "execute/pause/shield gửi qua backend để đảm bảo an toàn và idempotency.",
  },
  {
    title: "Track Execution Lifecycle",
    detail: "queued → submitted → confirmed/failed hiển thị realtime trên UI.",
  },
  {
    title: "Notification UX (Telegram)",
    detail: "User connect bot 1-click, bật/tắt alert theo vault và test notification.",
  },
];

const pages = [
  "/",
  "/app",
  "/app/vault/new",
  "/app/vault/[address]",
  "/app/notifications",
  "/app/monitor",
];

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-10 md:px-8">
      <main className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur md:p-8">
          <p className="mb-2 text-xs tracking-[0.2em] text-muted uppercase">Sentient Finance</p>
          <h1 className="text-3xl font-bold md:text-4xl">Frontend MVP Workflow + Color Base</h1>
          <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">
            Base UI cho team triển khai nhanh theo kiến trúc hybrid: GraphQL cho read-heavy dashboard,
            REST cho write/action và execution tracking.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">GraphQL Read</span>
            <span className="rounded-full bg-success/20 px-3 py-1 text-xs text-success">REST Write</span>
            <span className="rounded-full bg-warning/20 px-3 py-1 text-xs text-warning">Telegram Alerts</span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {steps.map((s, i) => (
            <article key={s.title} className="rounded-2xl border border-border bg-card-2/80 p-5">
              <p className="text-xs text-muted">Step {i + 1}</p>
              <h2 className="mt-1 text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted">{s.detail}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card/80 p-6">
          <h3 className="text-xl font-semibold">Route plan</h3>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {pages.map((p) => (
              <div key={p} className="rounded-lg border border-border bg-black/10 px-3 py-2 font-mono text-sm">
                {p}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
