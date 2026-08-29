import { Link } from "react-router-dom";
import { Mail, MessageCircle, Globe, Phone } from "lucide-react";

const COLUMNS = [
  {
    title: "Explore",
    links: ["Buy Properties", "Rent Properties", "New Projects", "Commercial Spaces", "Post Property Free"],
  },
  {
    title: "For Professionals",
    links: ["Agent Dashboard", "Owner Dashboard", "List with Trin.ta", "Commission Calculator"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Contact Us"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "RERA Disclaimer"],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-white">
              TRIN<span className="text-brand-500">.</span>TA
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              A no-broker property marketplace connecting owners, agents and buyers directly —
              zero brokerage on owner listings.
            </p>
            <div className="mt-4 flex gap-2">
              {[Mail, Phone, MessageCircle, Globe].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-white">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 hover:text-brand-400">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Trin.ta Properties. All rights reserved.</p>
          <p>Phase 1 build — design preview data, not connected to live listings.</p>
        </div>
      </div>
    </footer>
  );
}
