import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, MapPin, Pencil, Trash2, Eye, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { OWNER_NAV } from "./nav";
import { useProperties } from "../../context/PropertyContext";
import { useAuth } from "../../context/AuthContext";
import { owners, leads } from "../../data/agentData";
import { timeAgo } from "../../lib/format";

const CURRENT_OWNER_ID = "owner-ravi";

export default function OwnerProperties() {
  const { user } = useAuth();
  const { allProperties, deleteProperty, getVisitCount, getVisitors } = useProperties();
  const navigate = useNavigate();
  const owner = user || owners[CURRENT_OWNER_ID];
  const myProperties = allProperties.filter(
    (p) => p.ownerId === CURRENT_OWNER_ID || (user && p.ownerId === user.id)
  );

  const [visitorsFor, setVisitorsFor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    if (deleteTarget) deleteProperty(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <DashboardLayout role="owner" roleLabel="Owner" userName={owner.name} navItems={OWNER_NAV}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">My Properties</h1>
          <p className="mt-1 text-sm text-slate-500">Manage listings you own on Trin.ta.</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/post-property")}>
          <Plus className="h-4 w-4" />
          List New Property
        </Button>
      </div>

      {myProperties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-sm font-semibold text-navy-800">You haven't listed any properties yet.</p>
          <Button variant="primary" className="mt-4" onClick={() => navigate("/post-property")}>
            <Plus className="h-4 w-4" />
            Post Your First Property
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {myProperties.map((property) => {
            const leadCount = leads.filter((l) => l.propertyId === property.id).length;
            const visitCount = getVisitCount(property.id);
            return (
              <div key={property.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow">
                <div className="relative h-36">
                  <img src={property.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <StatusBadge status={property.status} />
                    {property.approvalStatus === "Pending" && <Badge variant="amber">Pending Review</Badge>}
                    {property.approvalStatus === "Rejected" && <Badge variant="brand">Rejected</Badge>}
                  </div>
                  <div className="absolute right-3 top-3 flex gap-1.5">
                    <button
                      type="button"
                      aria-label="Edit property"
                      onClick={() => navigate(`/post-property/edit/${property.id}`)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-700 hover:bg-white hover:text-brand-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete property"
                      onClick={() => setDeleteTarget(property)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-700 hover:bg-white hover:text-brand-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3 text-brand-500" />
                    {property.location}
                  </p>
                  <p className="mt-1 text-sm font-bold text-navy-900">{property.name}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-navy-800">{property.priceLabel}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setVisitorsFor(property)}
                        className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        <Eye className="h-3 w-3" />
                        {visitCount} visited
                      </button>
                      <span className="rounded-full bg-brand-50 px-2 py-1 font-semibold text-brand-700">
                        {leadCount} leads
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/property/${property.id}`}
                      className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-xs font-semibold text-navy-700 hover:bg-slate-50"
                    >
                      View Public Listing
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate(`/post-property/edit/${property.id}`)}
                      className="flex-1 rounded-lg bg-navy-900 py-2 text-center text-xs font-semibold text-white hover:bg-navy-800"
                    >
                      Edit Listing
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {visitorsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-navy-900">Visitors — {visitorsFor.name}</h2>
              <button type="button" onClick={() => setVisitorsFor(null)} className="text-slate-400 hover:text-navy-800">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 max-h-80 space-y-1 overflow-y-auto">
              {getVisitors(visitorsFor.id).length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">No visitors yet.</p>
              ) : (
                getVisitors(visitorsFor.id).map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-slate-50">
                    <div>
                      <p className="font-semibold text-navy-900">{v.name}</p>
                      {v.role && <p className="text-xs text-slate-400">{v.role}</p>}
                    </div>
                    <span className="text-xs text-slate-400">{timeAgo(v.at)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-sm font-bold text-navy-900">Delete this listing?</h2>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold text-navy-800">{deleteTarget.name}</span> will be removed
              from Trin.ta and buyers will no longer be able to view it. This can't be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
