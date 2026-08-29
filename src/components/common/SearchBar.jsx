import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, MapPin, Building2, Wallet, Grid3x3, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useFilterData } from "../../context/FilterDataContext";

const TABS = ["Buy", "Rent", "New Projects", "Lease", "Commercial"];
const APPROVALS = ["All", "DTCP", "CMDA", "RERA"];

const TAB_ROUTES = {
  Buy: "/buy",
  Rent: "/rent",
  "New Projects": "/new-projects",
  Lease: "/lease",
  Commercial: "/commercial",
};

const emptyFilters = { state: "", city: "", locality: "", type: "", budget: "", bhk: "" };

export default function SearchBar({ embedded = false }) {
  const { states, citiesByState, localities, propertyTypes, budgetRanges, bhkOptions } = useFilterData();
  const [activeTab, setActiveTab] = useState("Buy");
  const [approval, setApproval] = useState("All");
  const [filters, setFilters] = useState(emptyFilters);
  const navigate = useNavigate();

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const cityOptions = useMemo(() => {
    if (filters.state) return citiesByState[filters.state] || [];
    return [...new Set(Object.values(citiesByState).flat())];
  }, [filters.state, citiesByState]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    if (filters.locality) params.set("locality", filters.locality);
    if (filters.type) params.set("type", filters.type);
    if (filters.bhk) params.set("bhk", filters.bhk);
    if (filters.budget) {
      const range = budgetRanges.find((b) => b.label === filters.budget);
      if (range) {
        if (range.min) params.set("budgetMin", String(range.min));
        if (range.max) params.set("budgetMax", String(range.max));
      }
    }
    if (approval !== "All") params.set("approval", approval);

    const query = params.toString();
    navigate(`${TAB_ROUTES[activeTab]}${query ? `?${query}` : ""}`);
  };

  return (
    <div
      className={`w-full rounded-2xl bg-white p-5 shadow-xl shadow-navy-950/20 sm:p-6 ${
        embedded ? "" : "border border-slate-100"
      }`}
    >
      <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              activeTab === tab
                ? "bg-navy-900 text-white"
                : "text-slate-500 hover:bg-slate-50 hover:text-navy-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        <label className="flex flex-col gap-1 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-brand-400 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">State / Region</span>
          <span className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 shrink-0 text-brand-500" />
            <select
              value={filters.state}
              onChange={(e) => update({ state: e.target.value, city: "" })}
              className="w-full truncate bg-transparent text-sm font-semibold text-navy-900 focus:outline-none"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex flex-col gap-1 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-brand-400 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">City / District</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-brand-500" />
            <select
              value={filters.city}
              onChange={(e) => update({ city: e.target.value })}
              className="w-full truncate bg-transparent text-sm font-semibold text-navy-900 focus:outline-none"
            >
              <option value="">All Cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex flex-col gap-1 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-brand-400 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Locality / Area</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-brand-500" />
            <select
              value={filters.locality}
              onChange={(e) => update({ locality: e.target.value })}
              className="w-full truncate bg-transparent text-sm font-semibold text-navy-900 focus:outline-none"
            >
              <option value="">All Localities</option>
              {localities.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex flex-col gap-1 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-brand-400 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Property Type</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 shrink-0 text-brand-500" />
            <select
              value={filters.type}
              onChange={(e) => update({ type: e.target.value })}
              className="w-full truncate bg-transparent text-sm font-semibold text-navy-900 focus:outline-none"
            >
              <option value="">All Property Types</option>
              {propertyTypes.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex flex-col gap-1 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-brand-400 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Budget</span>
          <span className="flex items-center gap-1.5">
            <Wallet className="h-4 w-4 shrink-0 text-brand-500" />
            <select
              value={filters.budget}
              onChange={(e) => update({ budget: e.target.value })}
              className="w-full truncate bg-transparent text-sm font-semibold text-navy-900 focus:outline-none"
            >
              <option value="">All Budgets</option>
              {budgetRanges.map((b) => (
                <option key={b.label} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex flex-col gap-1 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-brand-400 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">BHK / Config</span>
          <span className="flex items-center gap-1.5">
            <Grid3x3 className="h-4 w-4 shrink-0 text-brand-500" />
            <select
              value={filters.bhk}
              onChange={(e) => update({ bhk: e.target.value })}
              className="w-full truncate bg-transparent text-sm font-semibold text-navy-900 focus:outline-none"
            >
              <option value="">All BHK</option>
              {bhkOptions.map((n) => (
                <option key={n} value={n}>
                  {n} BHK
                </option>
              ))}
            </select>
          </span>
        </label>

        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-colors hover:bg-brand-700 lg:col-span-1"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-navy-800">
            <ShieldCheck className="h-4 w-4 text-mint-600" />
            Approvals:
          </span>
          {APPROVALS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setApproval(item)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                approval === item
                  ? "bg-navy-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setFilters(emptyFilters);
            setApproval("All");
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-brand-600"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}
