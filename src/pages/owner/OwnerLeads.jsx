import { Phone } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import { OWNER_NAV } from "./nav";
import { properties } from "../../data/properties";
import { leads, owners } from "../../data/agentData";

const CURRENT_OWNER_ID = "owner-ravi";

const STAGE_VARIANT = {
  New: "soft",
  "Site Visit": "amber",
  Negotiation: "brand",
  Closed: "mint",
};

export default function OwnerLeads() {
  const owner = owners[CURRENT_OWNER_ID];
  const myPropertyIds = properties.filter((p) => p.ownerId === CURRENT_OWNER_ID).map((p) => p.id);
  const myLeads = leads.filter((l) => myPropertyIds.includes(l.propertyId));

  return (
    <DashboardLayout role="owner" roleLabel="Owner" userName={owner.name} navItems={OWNER_NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy-900">Leads (Read-only)</h1>
        <p className="mt-1 text-sm text-slate-500">Buyer interest across your properties, managed by your agent.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Lead</th>
              <th className="px-5 py-3 font-semibold">Property</th>
              <th className="px-5 py-3 font-semibold">Stage</th>
              <th className="px-5 py-3 font-semibold">Contact</th>
              <th className="px-5 py-3 font-semibold text-right">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myLeads.map((lead) => {
              const property = properties.find((p) => p.id === lead.propertyId);
              return (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-semibold text-navy-900">{lead.name}</td>
                  <td className="px-5 py-3 text-slate-600">{property?.name}</td>
                  <td className="px-5 py-3">
                    <Badge variant={STAGE_VARIANT[lead.stage]}>{lead.stage}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {lead.phone}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-slate-400">{lead.lastActivity}</td>
                </tr>
              );
            })}
            {myLeads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
