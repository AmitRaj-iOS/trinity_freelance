import { LayoutDashboard, Building2, Users, ClipboardList, PlusCircle } from "lucide-react";

export const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/leads", label: "Leads", icon: ClipboardList },
  { to: "/admin/add-data", label: "Add Data", icon: PlusCircle },
];
