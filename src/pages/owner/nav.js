import { LayoutDashboard, Building2, Users, CalendarCheck2 } from "lucide-react";

export const OWNER_NAV = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/owner/properties", label: "My Properties", icon: Building2 },
  { to: "/owner/leads", label: "Leads", icon: Users },
  { to: "/owner/site-visits", label: "Site Visits", icon: CalendarCheck2 },
];
