import { createContext, useContext, useEffect, useState } from "react";

const FilterDataContext = createContext(null);
const STORAGE_KEY = "trinita_filter_data";

const DEFAULT_DATA = {
  states: ["Tamil Nadu", "Karnataka", "Telangana", "Maharashtra"],
  citiesByState: {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
    Telangana: ["Hyderabad", "Warangal"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  },
  localities: [
    "OMR IT Corridor",
    "Avadi - Poonamallee Link Rd",
    "ECR",
    "Sriperumbudur Rd",
    "Guduvancheri",
    "Near Poonamallee Junction",
  ],
  propertyTypes: [
    { key: "Apartment", label: "Apartment / Flat" },
    { key: "Villa", label: "Villa / Independent House" },
    { key: "Plot", label: "Plot / Land" },
    { key: "Commercial", label: "Commercial Space" },
    { key: "Warehouse", label: "Warehouse / Godown" },
  ],
  bhkOptions: [1, 2, 3, 4, 5],
  budgetRanges: [
    { label: "Under ₹50 L", min: 0, max: 5000000 },
    { label: "₹50 L - ₹1 Cr", min: 5000000, max: 10000000 },
    { label: "₹1 Cr - ₹2 Cr", min: 10000000, max: 20000000 },
    { label: "Above ₹2 Cr", min: 20000000, max: null },
  ],
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function FilterDataProvider({ children }) {
  const [data, setData] = useState(() => loadJSON(STORAGE_KEY, DEFAULT_DATA));

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)), [data]);

  const addState = (name) => {
    const state = name.trim();
    if (!state || data.states.includes(state)) return;
    setData((d) => ({
      ...d,
      states: [...d.states, state],
      citiesByState: { ...d.citiesByState, [state]: d.citiesByState[state] || [] },
    }));
  };

  const addCity = (state, name) => {
    const city = name.trim();
    if (!state || !city) return;
    setData((d) => {
      const existing = d.citiesByState[state] || [];
      if (existing.includes(city)) return d;
      return { ...d, citiesByState: { ...d.citiesByState, [state]: [...existing, city] } };
    });
  };

  const addLocality = (name) => {
    const locality = name.trim();
    if (!locality || data.localities.includes(locality)) return;
    setData((d) => ({ ...d, localities: [...d.localities, locality] }));
  };

  const addPropertyType = (label) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const key = trimmed.replace(/\s+/g, "");
    setData((d) => {
      if (d.propertyTypes.some((t) => t.label.toLowerCase() === trimmed.toLowerCase())) return d;
      return { ...d, propertyTypes: [...d.propertyTypes, { key, label: trimmed }] };
    });
  };

  const addBhkOption = (n) => {
    const value = Number(n);
    if (!value || data.bhkOptions.includes(value)) return;
    setData((d) => ({ ...d, bhkOptions: [...d.bhkOptions, value].sort((a, b) => a - b) }));
  };

  const addBudgetRange = (label, min, max) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setData((d) => ({
      ...d,
      budgetRanges: [...d.budgetRanges, { label: trimmed, min: Number(min) || 0, max: max ? Number(max) : null }],
    }));
  };

  return (
    <FilterDataContext.Provider
      value={{ ...data, addState, addCity, addLocality, addPropertyType, addBhkOption, addBudgetRange }}
    >
      {children}
    </FilterDataContext.Provider>
  );
}

export const useFilterData = () => useContext(FilterDataContext);
