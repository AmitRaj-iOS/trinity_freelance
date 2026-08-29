import { LayoutDashboard, Heart } from "lucide-react";

export const BUYER_NAV = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
];
