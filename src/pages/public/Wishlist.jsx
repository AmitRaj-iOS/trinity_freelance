import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import PropertyCard from "../../components/common/PropertyCard";
import { useProperties } from "../../context/PropertyContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
  const { allProperties } = useProperties();
  const { wishlist } = useWishlist();

  const saved = wishlist
    .map((id) => allProperties.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <PublicLayout>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-navy-900">
            <Heart className="h-5 w-5 text-brand-600" />
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {saved.length} {saved.length === 1 ? "property" : "properties"} saved for later.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {saved.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-bold text-navy-900">Your wishlist is empty</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Tap the heart icon on any listing to save it here and compare later.
            </p>
            <Link
              to="/buy"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
            >
              Browse Properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {saved.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
