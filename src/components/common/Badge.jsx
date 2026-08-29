const VARIANTS = {
  navy: "bg-navy-800 text-white",
  brand: "bg-brand-600 text-white",
  mint: "bg-mint-600 text-white",
  amber: "bg-amber-500 text-navy-900",
  outline: "bg-white text-navy-700 border border-slate-200",
  soft: "bg-navy-50 text-navy-700",
};

export default function Badge({ children, variant = "navy", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
