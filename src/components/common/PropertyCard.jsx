import { Link, useNavigate, useLocation } from "react-router-dom";
import { MapPin, ArrowRight, Heart } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

export default function PropertyCard({ property }) {
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const saved = isWishlisted(user?.id, property.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow card-shadow-hover transition-shadow">
      <div className="relative h-44 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={property.status} />
        </div>
        <button
          type="button"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              navigate("/login", { state: { from: location } });
              return;
            }
            toggleWishlist(user.id, property.id);
          }}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${
            saved ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-white/90 text-navy-700 hover:bg-white hover:text-brand-600"
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent px-3 py-2">
          <p className="line-clamp-1 text-xs font-medium text-white/95">{property.tagline}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-500" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <Link to={`/property/${property.id}`} className="line-clamp-1 text-base font-bold text-navy-900 hover:text-brand-600">
          {property.name}
        </Link>
        <p className="line-clamp-1 text-xs text-slate-500">By {property.builder}</p>

        <div className="mt-1 space-y-1 border-t border-slate-100 pt-2.5 text-xs">
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Config</span>
            <span className="text-right font-medium text-navy-800">{property.config}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">Possession</span>
            <span className="font-medium text-navy-800">{property.possession}</span>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Starting From</p>
            <p className="text-lg font-extrabold text-navy-900">{property.priceLabel}</p>
          </div>
          <Link
            to={`/property/${property.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
          >
            View Units
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
