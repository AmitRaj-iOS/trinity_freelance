import { useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, LayoutGrid, List, MapPin, X } from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import PropertyCard from "../../components/common/PropertyCard";
import { useProperties } from "../../context/PropertyContext";
import { useFilterData } from "../../context/FilterDataContext";
import { STATUS } from "../../data/properties";

const SORTS = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest"];
const POSSESSION_OPTIONS = [STATUS.READY_TO_MOVE, STATUS.UNDER_CONSTRUCTION, STATUS.NEWLY_LAUNCHED];

const ROUTE_PURPOSE = { "/buy": "Sell", "/rent": "Rent", "/lease": "Lease" };
const ROUTE_HEADING = {
  "/buy": "Properties for Sale",
  "/rent": "Properties for Rent",
  "/lease": "Properties for Lease",
  "/new-projects": "New Project Launches",
  "/commercial": "Commercial Spaces",
};

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function Listings() {
  const { publicProperties } = useProperties();
  const { propertyTypes, citiesByState } = useFilterData();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [typeFilter, setTypeFilter] = useState(() => searchParams.get("type") || "All");
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [selectedPossession, setSelectedPossession] = useState([]);
  const [sort, setSort] = useState("Relevance");
  const [view, setView] = useState("grid");

  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";
  const locality = searchParams.get("locality") || "";
  const bhk = searchParams.get("bhk") || "";
  const budgetMin = searchParams.get("budgetMin");
  const budgetMax = searchParams.get("budgetMax");
  const urlApproval = searchParams.get("approval") || "";

  const clearParam = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
  };

  const activeChips = [
    state && { key: "state", label: state },
    city && { key: "city", label: city },
    locality && { key: "locality", label: locality },
    bhk && { key: "bhk", label: `${bhk} BHK` },
    urlApproval && { key: "approval", label: urlApproval },
    (budgetMin || budgetMax) && {
      key: budgetMax ? "budgetMax" : "budgetMin",
      label: budgetMax ? `Up to ₹${(Number(budgetMax) / 100000).toFixed(0)}L` : `₹${(Number(budgetMin) / 100000).toFixed(0)}L+`,
      extraKeys: ["budgetMin", "budgetMax"],
    },
  ].filter(Boolean);

  const filtered = useMemo(() => {
    const routePurpose = ROUTE_PURPOSE[location.pathname];
    let list = publicProperties.filter((p) => {
      if (routePurpose && (p.purpose || "Sell") !== routePurpose) return false;
      if (location.pathname === "/new-projects" && p.status !== STATUS.NEWLY_LAUNCHED) return false;
      if (location.pathname === "/commercial" && p.type !== "Commercial") return false;
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      if (state && !(citiesByState[state] || []).includes(p.city)) return false;
      if (city && p.city !== city) return false;
      if (locality && !`${p.location || ""}`.toLowerCase().includes(locality.toLowerCase())) return false;
      if (bhk && !(p.bhk || []).includes(Number(bhk))) return false;
      if (budgetMin && p.priceFrom < Number(budgetMin)) return false;
      if (budgetMax && p.priceFrom > Number(budgetMax)) return false;
      if (urlApproval && !(p.approvals || []).includes(urlApproval)) return false;
      if (selectedApprovals.length && !selectedApprovals.every((a) => (p.approvals || []).includes(a))) return false;
      if (selectedPossession.length && !selectedPossession.includes(p.status)) return false;
      return true;
    });
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.priceFrom - a.priceFrom);
    if (sort === "Newest") list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  }, [
    publicProperties,
    location.pathname,
    typeFilter,
    state,
    city,
    locality,
    bhk,
    budgetMin,
    budgetMax,
    urlApproval,
    selectedApprovals,
    selectedPossession,
    sort,
    citiesByState,
  ]);

  return (
    <PublicLayout>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-brand-500" />
            {[locality, city || "Chennai", state || "Tamil Nadu"].filter(Boolean).join(", ")}
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-navy-900">
            {filtered.length} {ROUTE_HEADING[location.pathname] || "Properties"} in {city || "Chennai"}
          </h1>

          {activeChips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  {chip.label}
                  <button
                    type="button"
                    aria-label={`Remove ${chip.label} filter`}
                    onClick={() => {
                      (chip.extraKeys || [chip.key]).forEach((k) => clearParam(k));
                    }}
                    className="rounded-full hover:bg-brand-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
              <p className="flex items-center gap-1.5 text-sm font-bold text-navy-900">
                <SlidersHorizontal className="h-4 w-4 text-brand-500" />
                Filters
              </p>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Property Type
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTypeFilter("All")}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      typeFilter === "All"
                        ? "bg-navy-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All Types
                  </button>
                  {propertyTypes.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTypeFilter(t.key)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        typeFilter === t.key
                          ? "bg-navy-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Approvals
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["RERA", "CMDA", "DTCP"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-navy-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedApprovals.includes(item)}
                        onChange={() => setSelectedApprovals((prev) => toggleInList(prev, item))}
                        className="h-3.5 w-3.5 accent-brand-600"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Possession Status
                </p>
                <div className="mt-2 space-y-2 text-xs font-semibold text-navy-700">
                  {POSSESSION_OPTIONS.map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPossession.includes(item)}
                        onChange={() => setSelectedPossession((prev) => toggleInList(prev, item))}
                        className="h-3.5 w-3.5 accent-brand-600"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    view === "grid" ? "bg-navy-900 text-white" : "text-slate-500"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${
                    view === "list" ? "bg-navy-900 text-white" : "text-slate-500"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-navy-800 focus:border-brand-500 focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500">
                No properties match your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
