import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Heart, Phone, User as UserIcon, ArrowRight, Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import PropertyCard from "../../components/common/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import { useProperties } from "../../context/PropertyContext";
import { useWishlist } from "../../context/WishlistContext";
import { useContactReveal, FREE_REVEAL_LIMIT } from "../../context/ContactRevealContext";
import { BUYER_NAV } from "./nav";

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { allProperties } = useProperties();
  const { wishlistFor } = useWishlist();
  const { revealedFor, remainingFor } = useContactReveal();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const savedProperties = wishlistFor(user.id)
    .map((id) => allProperties.find((p) => p.id === id))
    .filter(Boolean);
  const revealedIds = revealedFor(user.id);
  const revealedProperties = revealedIds
    .map((id) => allProperties.find((p) => p.id === id))
    .filter(Boolean);
  const remaining = remainingFor(user.id);

  return (
    <DashboardLayout
      role="buyer"
      roleLabel="Buyer"
      userName={user.name}
      navItems={BUYER_NAV}
      onLogout={() => {
        logout();
        navigate("/");
      }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy-900">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-slate-500">Here's everything about your Trin.ta account.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Heart} label="Saved Properties" value={savedProperties.length} accent="brand" />
        <StatCard icon={Phone} label="Contacts Revealed" value={revealedIds.length} accent="navy" />
        <StatCard
          icon={Search}
          label="Free Reveals Left"
          value={`${remaining} / ${FREE_REVEAL_LIMIT}`}
          accent="mint"
        />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-navy-900">
          <UserIcon className="h-4 w-4 text-brand-500" />
          Your Details
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full Name</p>
            <p className="mt-0.5 text-sm font-semibold text-navy-900">{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mobile Number</p>
            <p className="mt-0.5 text-sm font-semibold text-navy-900">+91 {user.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account Type</p>
            <p className="mt-0.5 text-sm font-semibold text-navy-900">{user.roleLabel}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-base font-bold text-navy-900">Saved Properties</h2>
        {savedProperties.length > 0 && (
          <Link
            to="/account/wishlist"
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {savedProperties.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          No saved properties yet.{" "}
          <Link to="/buy" className="font-semibold text-brand-600 hover:underline">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {savedProperties.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-navy-900">
          <Phone className="h-4 w-4 text-brand-500" />
          Contacts You've Revealed
        </h2>
        {revealedProperties.length === 0 ? (
          <p className="mt-4 text-center text-xs text-slate-400">
            You haven't revealed any owner contacts yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {revealedProperties.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <img src={p.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/property/${p.id}`}
                    className="truncate text-sm font-semibold text-navy-900 hover:text-brand-600"
                  >
                    {p.name}
                  </Link>
                  <p className="truncate text-xs text-slate-400">{p.location}</p>
                </div>
                <Link
                  to={`/property/${p.id}`}
                  className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
