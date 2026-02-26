const rows = [
  { type: "Upkeep", status: "Success", note: "checkUpkeep -> performUpkeep" },
  { type: "Swap", status: "Failed", note: "SlippageTooHigh" },
  { type: "Shield", status: "Success", note: "CCIP message sent" },
];

export default function MonitorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Monitor</h1>
      <p className="text-sm text-white/70">Day 1 placeholder logs. Real indexer stream in next phase.</p>

      <div className="overflow-hidden rounded-2xl border border-white/15 bg-card/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-white/10">
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3 text-white/70">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
