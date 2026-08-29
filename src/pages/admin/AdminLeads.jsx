import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import { ADMIN_NAV } from "./nav";
import { useProperties } from "../../context/PropertyContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { leads, agents, LEAD_STAGES } from "../../data/agentData";

const STAGE_VARIANT = {
  New: "soft",
  "Site Visit": "navy",
  Negotiation: "amber",
  Closed: "mint",
};

export default function AdminLeads() {
  const { admin, logoutAdmin } = useAdminAuth();
  const { getPropertyById } = useProperties();
  const navigate = useNavigate();

  const [stageTab, setStageTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (stageTab !== "All" && l.stage !== stageTab) return false;
      if (search && !`${l.name} ${l.phone}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [stageTab, search]);

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
        <h1 className="text-2xl font-extrabold text-navy-900">All Leads</h1>
        <p className="mt-1 text-sm text-slate-500">Every buyer lead across every agent on the platform.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {["All", ...LEAD_STAGES].map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setStageTab(stage)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                stageTab === stage ? "bg-navy-900 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
        <label className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name or phone"
            className="w-full text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white card-shadow">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Agent</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((lead) => {
              const property = getPropertyById(lead.propertyId);
              const agent = agents[lead.agentId];
              return (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy-900">{lead.name}</p>
                    <p className="text-xs text-slate-400">+91 {lead.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{property?.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{agent?.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.budget}</td>
                  <td className="px-4 py-3 text-slate-500">{lead.source}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STAGE_VARIANT[lead.stage] || "soft"}>{lead.stage}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{lead.lastActivity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-400">No leads match this view.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
