import { Link } from "react-router-dom";
import { ShieldCheck, Users, Handshake, Building2, ArrowRight } from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import SearchBar from "../../components/common/SearchBar";
import PropertyCard from "../../components/common/PropertyCard";
import StatCard from "../../components/common/StatCard";
import { useProperties } from "../../context/PropertyContext";

const WHY_US = [
  {
    icon: ShieldCheck,
    title: "Zero Brokerage",
    desc: "Connect directly with verified owners and RERA-approved projects — no middlemen, no hidden fees.",
  },
  {
    icon: Users,
    title: "Verified Listings Only",
    desc: "Every listing is manually reviewed and approved before it goes live on the marketplace.",
  },
  {
    icon: Handshake,
    title: "Agent Support, Optional",
    desc: "Prefer expert help? Opt into agent-assisted site visits and negotiation, on your terms.",
  },
];

export default function Home() {
  const { publicProperties } = useProperties();
  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-navy-700/40 via-navy-950 to-navy-950" />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-14 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
              <ShieldCheck className="h-3.5 w-3.5 text-mint-500" />
              India's Direct-from-Owner Property Marketplace
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Find your next home.
              <span className="text-brand-500"> No brokers, no brokerage.</span>
            </h1>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Search verified apartments, villas, plots and commercial spaces across Chennai —
              straight from owners, developers and vetted agents.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-6xl">
            <SearchBar />
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl">12,400+</p>
              <p className="text-xs text-slate-400 sm:text-sm">Verified Listings</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl">₹0</p>
              <p className="text-xs text-slate-400 sm:text-sm">Brokerage on Owner Listings</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl">340+</p>
              <p className="text-xs text-slate-400 sm:text-sm">RERA-Approved Projects</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900">
              Featured Integrated Townships &amp; Projects
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Explore premier residential communities with world-class clubhouses, parks, and
              smart infrastructure.
            </p>
          </div>
          <Link
            to="/buy"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View All Properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {publicProperties.slice(0, 8).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-navy-900">
            Why Buyers Choose Trin.ta
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {WHY_US.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 p-6 text-center card-shadow"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard icon={Building2} label="Active Listings" value="12,400+" accent="navy" />
          <StatCard icon={Users} label="Verified Owners" value="3,120" accent="brand" />
          <StatCard icon={Handshake} label="Deals Closed This Year" value="890" accent="mint" />
        </div>
      </section>
    </PublicLayout>
  );
}
