import { Link, useNavigate } from "react-router-dom";
import { Building2, Users, ClipboardList, Eye, Clock, ArrowRight, Check, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import BarChart from "../../components/charts/BarChart";
import { ADMIN_NAV } from "./nav";
import { useProperties } from "../../context/PropertyContext";
import { useUsers } from "../../context/UserContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { leads, LEAD_STAGES } from "../../data/agentData";
import { STATUS } from "../../data/properties";
import { getRole } from "../../data/roles";
import { timeAgo } from "../../lib/format";

const STAGE_COLORS = {
  New: "#86b6ef",
  "Site Visit": "#3987e5",
  Negotiation: "#1c5cab",
  Closed: "#0d366b",
};

const LISTING_STATUS_COLORS = {
  [STATUS.NEWLY_LAUNCHED]: "#2a78d6",
  [STATUS.UNDER_CONSTRUCTION]: "#eb6834",
  [STATUS.READY_TO_MOVE]: "#1baf7a",
};

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { allProperties, pendingProperties, getVisitCount, getVisitors, approveProperty, rejectProperty } =
    useProperties();
  const { allUsers } = useUsers();

  const totalVisits = allProperties.reduce((s, p) => s + getVisitCount(p.id), 0);

  const usersByRole = ["buyer", "owner", "builder", "agent", "area_head", "admin"].map((key) => ({
    key,
    label: getRole(key)?.label || key,
    count: allUsers.filter((u) => u.role === key).length,
  }));

  const usersByRoleChart = usersByRole
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((r) => ({ key: r.key, label: r.label, value: r.count }));

  const leadsByStageChart = LEAD_STAGES.map((stage) => ({
    key: stage,
    label: stage,
    value: leads.filter((l) => l.stage === stage).length,
    color: STAGE_COLORS[stage],
  }));

  const propertiesByStatusChart = Object.values(STATUS).map((status) => ({
    key: status,
    label: status,
    value: allProperties.filter((p) => p.status === status).length,
    color: LISTING_STATUS_COLORS[status],
  }));

  const recentActivity = allProperties
    .flatMap((property) => getVisitors(property.id).map((v) => ({ ...v, propertyName: property.name })))
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 6);

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
        <h1 className="text-2xl font-extrabold text-navy-900">Platform Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Everything happening across Trin.ta, in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Building2} label="Total Properties" value={allProperties.length} accent="navy" />
        <StatCard icon={Clock} label="Pending Approvals" value={pendingProperties.length} accent="amber" />
        <StatCard icon={Users} label="Total Users" value={allUsers.length} accent="brand" />
        <StatCard icon={ClipboardList} label="Total Leads" value={leads.length} accent="mint" />
        <StatCard icon={Eye} label="Total Platform Visits" value={totalVisits} accent="brand" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Pending Approvals</h2>
            <Link
              to="/admin/properties"
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {pendingProperties.length === 0 ? (
            <p className="mt-6 text-center text-xs text-slate-400">No listings waiting for review.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {pendingProperties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex items-center gap-4 py-3">
                  <img src={property.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900">{property.name}</p>
                    <p className="text-xs text-slate-400">
                      {property.postedBy?.name || property.builder} · {property.location}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <h2 className="text-base font-bold text-navy-900">Users by Role</h2>
          <div className="mt-5">
            <BarChart data={usersByRoleChart} color="#e11d68" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <h2 className="text-base font-bold text-navy-900">Leads by Stage</h2>
          <p className="mt-0.5 text-xs text-slate-400">Where buyer leads sit in the pipeline, across every agent.</p>
          <div className="mt-5">
            <BarChart data={leadsByStageChart} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <h2 className="text-base font-bold text-navy-900">Properties by Listing Status</h2>
          <p className="mt-0.5 text-xs text-slate-400">Inventory mix across every approved listing.</p>
          <div className="mt-5">
            <BarChart data={propertiesByStatusChart} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
        <h2 className="text-base font-bold text-navy-900">Recent Platform Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="mt-6 text-center text-xs text-slate-400">No visitor activity yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentActivity.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Eye className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-navy-900">
                    <span className="font-semibold">{entry.name}</span> viewed{" "}
                    <span className="font-semibold">{entry.propertyName}</span>
                  </p>
                  <p className="text-xs text-slate-400">{timeAgo(entry.at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
