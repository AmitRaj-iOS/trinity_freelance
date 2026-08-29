import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  MapPin,
  Scale,
  Wrench,
  Sparkles,
  Calculator,
  Smartphone,
  ArrowLeftRight,
  Heart,
  ChevronDown,
  Menu,
  X,
  Plus,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { getRole } from "../../data/roles";

const NAV_LINKS = [
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "New Projects", to: "/new-projects" },
  { label: "Lease", to: "/lease" },
  { label: "Commercial", to: "/commercial" },
];

const TOOL_LINKS = [
  { label: "Map", icon: MapPin, tone: "brand" },
  { label: "Legal", icon: Scale, tone: "navy" },
  { label: "Services", icon: Wrench, tone: "slate" },
  { label: "AI Suite", icon: Sparkles, tone: "amber" },
  { label: "Finance", icon: Calculator, tone: "mint" },
  { label: "App", icon: Smartphone, tone: "brand", tag: "PWA" },
  { label: "Compare", icon: ArrowLeftRight, tone: "slate" },
];

const TONE_CLASSES = {
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  navy: "bg-navy-50 text-navy-700 border-navy-100",
  slate: "bg-slate-50 text-navy-700 border-slate-200",
  amber: "bg-amber-500/10 text-amber-600 border-amber-200",
  mint: "bg-mint-50 text-mint-600 border-mint-100",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex shrink-0 flex-col leading-none">
          <span className="text-2xl font-extrabold tracking-tight text-navy-900">
            TRIN<span className="text-brand-600">.</span>TA
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <span className="h-px w-4 bg-brand-500" />
            properties
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative pb-1 text-sm font-semibold transition-colors ${
                  isActive ? "text-navy-900" : "text-slate-600 hover:text-navy-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[15px] left-0 h-0.5 w-full bg-brand-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none 2xl:flex">
          {TOOL_LINKS.map((tool) => (
            <button
              key={tool.label}
              type="button"
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:brightness-95 ${TONE_CLASSES[tool.tone]}`}
            >
              <tool.icon className="h-3.5 w-3.5" />
              {tool.label}
              {tool.tag && (
                <span className="rounded bg-brand-600 px-1 py-0.5 text-[9px] font-bold text-white">
                  {tool.tag}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/post-property")}
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-600 pl-3.5 pr-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-brand-600/30 transition-colors hover:bg-brand-700 sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Post Property
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide">
              FREE
            </span>
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            onClick={() => navigate("/account/wishlist")}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-navy-700 hover:bg-slate-50 sm:flex"
          >
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </button>
          {user ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-navy-900 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white hover:bg-navy-800"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold">
                  {initials}
                </span>
                {user.name.split(" ")[0]}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-2 py-2">
                    <p className="text-sm font-bold text-navy-900">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.roleLabel} · +91 {user.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate(getRole(user.role)?.dashboard || "/");
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-navy-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hidden items-center gap-1 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 sm:inline-flex"
            >
              Sign In / Login
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-navy-800 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-slate-50"
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate("/account/wishlist");
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-navy-800 hover:bg-slate-50"
            >
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                Wishlist
              </span>
              {wishlist.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate("/post-property");
              }}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Post Property
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide">
                FREE
              </span>
            </button>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                  navigate("/");
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-navy-900 px-3 py-2 text-sm font-semibold text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign Out ({user.name.split(" ")[0]})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="rounded-lg bg-navy-900 px-3 py-2 text-sm font-semibold text-white"
              >
                Sign In / Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
