export default function StatCard({ icon: Icon, label, value, hint, accent = "navy" }) {
  const accentClasses = {
    navy: "bg-navy-50 text-navy-700",
    brand: "bg-brand-50 text-brand-600",
    mint: "bg-mint-50 text-mint-600",
    amber: "bg-amber-500/10 text-amber-500",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 card-shadow">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-xl font-extrabold text-navy-900">{value}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}
