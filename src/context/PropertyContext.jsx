import { createContext, useContext, useEffect, useState } from "react";
import { properties as staticProperties, STATUS } from "../data/properties";
import { formatINR } from "../lib/format";

const PropertyContext = createContext(null);
const POSTED_KEY = "trinita_posted_properties";
const DELETED_KEY = "trinita_deleted_properties";
const EDITS_KEY = "trinita_property_edits";
const VISITS_KEY = "trinita_property_visits";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function draftToProperty(draft, user) {
  const images = draft.images?.length ? draft.images : [PLACEHOLDER_IMAGE];
  return {
    name: draft.title,
    builder: draft.builder || user?.name || "Owner Listing",
    status: draft.possessionStatus || STATUS.READY_TO_MOVE,
    completion: draft.possessionStatus === STATUS.READY_TO_MOVE ? 100 : 40,
    tagline:
      draft.description?.slice(0, 140) ||
      `${draft.bhk || ""} ${draft.propertyType} in ${draft.locality}`,
    location: [draft.locality, draft.city].filter(Boolean).join(", "),
    city: draft.city,
    state: draft.state,
    locality: draft.locality,
    config: draft.bhk ? `${draft.bhk} ${draft.propertyType}` : draft.propertyType,
    bhk: draft.bhk ? [Number(draft.bhk)] : [],
    possession: draft.possessionStatus === STATUS.READY_TO_MOVE ? "Ready" : draft.possessionDate || "TBD",
    priceFrom: Number(draft.price) || 0,
    priceLabel: formatINR(Number(draft.price) || 0),
    areaSqft: draft.areaSqft,
    type: draft.propertyType,
    purpose: draft.purpose,
    approvals: draft.approvals || [],
    image: images[0],
    gallery: images,
    amenities: draft.amenities || [],
    address: draft.address,
    description: draft.description,
  };
}

export function PropertyProvider({ children }) {
  const [posted, setPosted] = useState(() => loadJSON(POSTED_KEY, []));
  const [deletedIds, setDeletedIds] = useState(() => loadJSON(DELETED_KEY, []));
  const [edits, setEdits] = useState(() => loadJSON(EDITS_KEY, {}));
  const [visits, setVisits] = useState(() => loadJSON(VISITS_KEY, {}));

  useEffect(() => localStorage.setItem(POSTED_KEY, JSON.stringify(posted)), [posted]);
  useEffect(() => localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds)), [deletedIds]);
  useEffect(() => localStorage.setItem(EDITS_KEY, JSON.stringify(edits)), [edits]);
  useEffect(() => localStorage.setItem(VISITS_KEY, JSON.stringify(visits)), [visits]);

  const addProperty = (draft, user, { approvalStatus = "Pending" } = {}) => {
    const slug = draft.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const id = `${slug || "listing"}-${Date.now().toString(36)}`;

    const property = {
      id,
      ...draftToProperty(draft, user),
      agentId: null,
      ownerId: user?.id || "self-listed",
      postedBy: { name: user?.name, phone: user?.phone, role: user?.role },
      isUserPosted: true,
      approvalStatus,
      createdAt: new Date().toISOString(),
    };

    setPosted((prev) => [property, ...prev]);
    return property;
  };

  const updateProperty = (id, draft, user) => {
    const patch = { ...draftToProperty(draft, user), updatedAt: new Date().toISOString() };
    if (posted.some((p) => p.id === id)) {
      setPosted((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    } else {
      setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    }
  };

  const deleteProperty = (id) => {
    if (posted.some((p) => p.id === id)) {
      setPosted((prev) => prev.filter((p) => p.id !== id));
    } else {
      setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  const setApprovalStatus = (id, approvalStatus) => {
    if (posted.some((p) => p.id === id)) {
      setPosted((prev) => prev.map((p) => (p.id === id ? { ...p, approvalStatus } : p)));
    } else {
      setEdits((prev) => ({ ...prev, [id]: { ...prev[id], approvalStatus } }));
    }
  };

  const approveProperty = (id) => setApprovalStatus(id, "Approved");
  const rejectProperty = (id) => setApprovalStatus(id, "Rejected");

  const recordVisit = (id, viewer) => {
    if (!id) return;
    setVisits((prev) => {
      const existing = prev[id] || [];
      const entry = { name: viewer?.name || "Guest Visitor", role: viewer?.roleLabel, at: new Date().toISOString() };
      return { ...prev, [id]: [entry, ...existing].slice(0, 50) };
    });
  };

  const getVisitors = (id) => visits[id] || [];
  const getVisitCount = (id) => (visits[id] || []).length;

  const merged = [...posted, ...staticProperties.map((p) => (edits[p.id] ? { ...p, ...edits[p.id] } : p))];
  const allProperties = merged.filter((p) => !deletedIds.includes(p.id));
  const publicProperties = allProperties.filter((p) => (p.approvalStatus || "Approved") === "Approved");
  const pendingProperties = allProperties.filter((p) => p.approvalStatus === "Pending");

  const getPropertyById = (id) => allProperties.find((p) => p.id === id);
  const getPropertiesByOwner = (ownerId) => allProperties.filter((p) => p.ownerId === ownerId);

  return (
    <PropertyContext.Provider
      value={{
        allProperties,
        publicProperties,
        pendingProperties,
        postedProperties: posted,
        addProperty,
        updateProperty,
        deleteProperty,
        approveProperty,
        rejectProperty,
        recordVisit,
        getVisitors,
        getVisitCount,
        getPropertyById,
        getPropertiesByOwner,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => useContext(PropertyContext);
