export default function BarChart({ data, color = "#e11d68", valueFormatter = (v) => v }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        const fill = d.color || color;
        return (
          <div key={d.key} className="group flex items-center gap-3" title={`${d.label}: ${valueFormatter(d.value)}`}>
            <span className="w-24 shrink-0 truncate text-xs font-semibold text-slate-600">{d.label}</span>
            <div className="h-3 flex-1 rounded-r-[4px] bg-slate-100">
              <div
                className="h-3 rounded-r-[4px] transition-[width] duration-300 ease-out group-hover:brightness-110"
                style={{ width: `${pct}%`, backgroundColor: fill }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-navy-900">
              {valueFormatter(d.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
