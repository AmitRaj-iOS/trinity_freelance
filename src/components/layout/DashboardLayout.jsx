import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ role, roleLabel, userName, navItems, onLogout, children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-navy-950 text-white lg:flex">
        <Link to="/" className="flex flex-col px-6 py-6 leading-none">
          <span className="text-xl font-extrabold tracking-tight">
            TRIN<span className="text-brand-500">.</span>TA
          </span>
          <span className="mt-1 text-[11px] font-medium text-slate-400">properties</span>
        </Link>

        <div className="mx-4 mb-4 rounded-xl bg-white/5 px-4 py-3">
          <p className="text-xs text-slate-400">{roleLabel}</p>
          <p className="text-sm font-semibold text-white">{userName}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-400 hover:bg-white/5 hover:text-brand-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Exit to Public Site
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-lg font-extrabold text-navy-900">
              TRIN<span className="text-brand-600">.</span>TA
            </span>
          </div>
          <nav className="flex gap-1 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isActive ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">{userName}</p>
              <p className="text-xs capitalize text-slate-400">{role}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
