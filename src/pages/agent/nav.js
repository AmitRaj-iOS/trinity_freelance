import { LayoutDashboard, Building2, Users, CalendarCheck2, Wallet } from "lucide-react";

export const AGENT_NAV = [
  { to: "/agent", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/agent/listings", label: "My Listings", icon: Building2 },
  { to: "/agent/leads", label: "Leads", icon: Users },
  { to: "/agent/site-visits", label: "Site Visits", icon: CalendarCheck2 },
  { to: "/agent/commission", label: "Commission", icon: Wallet },
];
