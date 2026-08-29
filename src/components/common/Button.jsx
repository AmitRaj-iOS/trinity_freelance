const VARIANTS = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-300",
  navy: "bg-navy-800 text-white hover:bg-navy-700 focus-visible:ring-navy-300",
  outline: "border border-slate-300 text-navy-800 hover:bg-slate-50 focus-visible:ring-navy-200",
  ghost: "text-navy-700 hover:bg-navy-50 focus-visible:ring-navy-200",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
