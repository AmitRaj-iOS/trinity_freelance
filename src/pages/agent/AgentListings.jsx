import { Link } from "react-router-dom";
import { Plus, MapPin } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { AGENT_NAV } from "./nav";
import { properties } from "../../data/properties";
import { agents, leads } from "../../data/agentData";

const CURRENT_AGENT_ID = "agent-priya";

export default function AgentListings() {
  const agent = agents[CURRENT_AGENT_ID];
  const myListings = properties.filter((p) => p.agentId === CURRENT_AGENT_ID);

  return (
    <DashboardLayout role="agent" roleLabel="Agent" userName={agent.name} navItems={AGENT_NAV}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">My Listings</h1>
          <p className="mt-1 text-sm text-slate-500">Properties you represent as the assigned agent.</p>
        </div>
        <Button variant="primary">
          <Plus className="h-4 w-4" />
          Add Listing
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Property</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Leads</th>
              <th className="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myListings.map((property) => {
              const leadCount = leads.filter((l) => l.propertyId === property.id).length;
              return (
                <tr key={property.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.image}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-navy-900">{property.name}</p>
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="px-5 py-3 font-semibold text-navy-800">{property.priceLabel}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                      {leadCount} leads
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/property/${property.id}`}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
