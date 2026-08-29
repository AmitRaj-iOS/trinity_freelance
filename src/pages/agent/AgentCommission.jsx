import { Wallet } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import { AGENT_NAV } from "./nav";
import { properties } from "../../data/properties";
import { agents, leads, computeCommission } from "../../data/agentData";
import { formatINR } from "../../lib/format";

const CURRENT_AGENT_ID = "agent-priya";

export default function AgentCommission() {
  const agent = agents[CURRENT_AGENT_ID];
  const closedLeads = leads.filter((l) => l.agentId === CURRENT_AGENT_ID && l.stage === "Closed");
  const total = closedLeads.reduce((sum, l) => sum + computeCommission(l, properties), 0);

  return (
    <DashboardLayout role="agent" roleLabel="Agent" userName={agent.name} navItems={AGENT_NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy-900">Commission</h1>
        <p className="mt-1 text-sm text-slate-500">
          Earnings calculated at {(agent.commissionRate * 100).toFixed(0)}% of closed deal value.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total Commission" value={formatINR(total)} accent="amber" />
        <StatCard icon={Wallet} label="Deals Closed" value={closedLeads.length} accent="mint" />
        <StatCard icon={Wallet} label="Commission Rate" value={`${(agent.commissionRate * 100).toFixed(0)}%`} accent="navy" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Lead</th>
              <th className="px-5 py-3 font-semibold">Property</th>
              <th className="px-5 py-3 font-semibold">Deal Value</th>
              <th className="px-5 py-3 font-semibold text-right">Commission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {closedLeads.map((lead) => {
              const property = properties.find((p) => p.id === lead.propertyId);
              return (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-semibold text-navy-900">{lead.name}</td>
                  <td className="px-5 py-3 text-slate-600">{property?.name}</td>
                  <td className="px-5 py-3 text-slate-600">{property?.priceLabel}</td>
                  <td className="px-5 py-3 text-right font-bold text-mint-600">
                    {formatINR(computeCommission(lead, properties))}
                  </td>
                </tr>
              );
            })}
            {closedLeads.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  No closed deals yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
