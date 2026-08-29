import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Check, X, Pencil, Trash2, Eye, MapPin, Building2, Calendar, ShieldCheck } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import StatusBadge from "../../components/common/StatusBadge";
import { ADMIN_NAV } from "./nav";
import { useProperties } from "../../context/PropertyContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

const TABS = ["All", "Pending", "Approved", "Rejected"];

const APPROVAL_VARIANT = {
  Pending: "amber",
  Approved: "mint",
  Rejected: "brand",
};

export default function AdminProperties() {
  const { admin, logoutAdmin } = useAdminAuth();
  const { allProperties, getVisitCount, approveProperty, rejectProperty, deleteProperty } = useProperties();
  const navigate = useNavigate();

  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = useMemo(() => {
    return allProperties.filter((p) => {
      const status = p.approvalStatus || "Approved";
      if (tab !== "All" && status !== tab) return false;
      if (search && !`${p.name} ${p.builder} ${p.location}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [allProperties, tab, search]);

  return (
    <DashboardLayout
      role="admin"
      roleLabel="Admin"
      userName={admin.name}
      navItems={ADMIN_NAV}
      onLogout={() => {
        logoutAdmin();
        navigate("/admin/login");
      }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy-900">All Properties</h1>
        <p className="mt-1 text-sm text-slate-500">Review, approve and manage every listing on the platform.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === t ? "bg-navy-900 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name, builder, location"
            className="w-full text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white card-shadow">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Owner / Builder</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Approval</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((property) => {
              const approval = property.approvalStatus || "Approved";
              return (
                <tr
                  key={property.id}
                  onClick={() => setViewTarget(property)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={property.image} alt="" className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-navy-900">{property.name}</p>
                        <p className="truncate text-xs text-slate-400">{property.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {property.postedBy?.name || property.builder}
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy-900">{property.priceLabel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={APPROVAL_VARIANT[approval]}>{approval}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Eye className="h-3.5 w-3.5" />
                      {getVisitCount(property.id)}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {approval === "Pending" && (
                        <>
                          <button
                            type="button"
                            aria-label="Approve"
                            onClick={() => approveProperty(property.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-50 text-mint-600 hover:bg-mint-100"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Reject"
                            onClick={() => rejectProperty(property.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        aria-label="Edit property"
                        onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-navy-800"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete property"
                        onClick={() => setDeleteTarget(property)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-400">No properties match this view.</div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-sm font-bold text-navy-900">Delete this listing?</h2>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold text-navy-800">{deleteTarget.name}</span> will be permanently
              removed from Trin.ta. This can't be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-navy-800 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProperty(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {viewTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4"
          onClick={() => setViewTarget(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img src={viewTarget.image} alt="" className="h-48 w-full object-cover" />
              <button
                type="button"
                aria-label="Close"
                onClick={() => setViewTarget(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-800 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-4 flex gap-1.5">
                <StatusBadge status={viewTarget.status} />
                <Badge variant={APPROVAL_VARIANT[viewTarget.approvalStatus || "Approved"]}>
                  {viewTarget.approvalStatus || "Approved"}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-extrabold text-navy-900">{viewTarget.name}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {viewTarget.location}
              </p>
              {viewTarget.tagline && <p className="mt-2 text-sm text-slate-600">{viewTarget.tagline}</p>}

              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm sm:grid-cols-3">
                <DetailField label="Price" value={viewTarget.priceLabel} />
                <DetailField label="Type" value={viewTarget.type} />
                <DetailField label="Configuration" value={viewTarget.config} />
                <DetailField label="Possession" value={viewTarget.possession} />
                <DetailField
                  label="Builder / Owner"
                  value={viewTarget.postedBy?.name || viewTarget.builder}
                />
                <DetailField label="City" value={viewTarget.city} />
                {typeof viewTarget.completion === "number" && (
                  <DetailField label="Completion" value={`${viewTarget.completion}%`} />
                )}
                <DetailField label="Visits" value={getVisitCount(viewTarget.id)} />
                <DetailField label="Property ID" value={viewTarget.id} mono />
              </div>

              {viewTarget.approvals?.length > 0 && (
                <div className="mt-5">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Approvals
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {viewTarget.approvals.map((a) => (
                      <Badge key={a} variant="outline">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewTarget.amenities?.length > 0 && (
                <div className="mt-5">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <Building2 className="h-3.5 w-3.5" /> Amenities
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {viewTarget.amenities.map((a) => (
                      <Badge key={a} variant="soft">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewTarget.gallery?.length > 1 && (
                <div className="mt-5 flex gap-2 overflow-x-auto">
                  {viewTarget.gallery.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt=""
                      className="h-16 w-24 shrink-0 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              {(viewTarget.createdAt || viewTarget.updatedAt) && (
                <p className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {viewTarget.createdAt && `Posted ${new Date(viewTarget.createdAt).toLocaleDateString()}`}
                  {viewTarget.createdAt && viewTarget.updatedAt && " · "}
                  {viewTarget.updatedAt && `Updated ${new Date(viewTarget.updatedAt).toLocaleDateString()}`}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewTarget(null)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-navy-800 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/properties/edit/${viewTarget.id}`)}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function DetailField({ label, value, mono = false }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-0.5 truncate font-semibold text-navy-900 ${mono ? "font-mono text-xs" : "text-sm"}`}>
        {value}
      </p>
    </div>
  );
}
