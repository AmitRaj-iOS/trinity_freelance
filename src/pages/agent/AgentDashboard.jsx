import { Link } from "react-router-dom";
import { Building2, Users, CalendarCheck2, Wallet, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import { AGENT_NAV } from "./nav";
import { properties } from "../../data/properties";
import { leads, siteVisits, agents, computeCommission } from "../../data/agentData";
import { formatINR } from "../../lib/format";

const CURRENT_AGENT_ID = "agent-priya";

export default function AgentDashboard() {
  const agent = agents[CURRENT_AGENT_ID];
  const myListings = properties.filter((p) => p.agentId === CURRENT_AGENT_ID);
  const myLeads = leads.filter((l) => l.agentId === CURRENT_AGENT_ID);
  const myVisits = siteVisits
    .filter((v) => v.agentId === CURRENT_AGENT_ID && v.status === "Scheduled")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const closedLeads = myLeads.filter((l) => l.stage === "Closed");
  const commissionEarned = closedLeads.reduce((sum, l) => sum + computeCommission(l, properties), 0);

  return (
    <DashboardLayout
      role="agent"
      roleLabel="Agent"
      userName={agent.name}
      navItems={AGENT_NAV}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900">Welcome back, {agent.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening with your pipeline today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Building2} label="My Listings" value={myListings.length} accent="navy" />
        <StatCard icon={Users} label="Active Leads" value={myLeads.filter((l) => l.stage !== "Closed").length} accent="brand" />
        <StatCard icon={CalendarCheck2} label="Upcoming Site Visits" value={myVisits.length} accent="mint" />
        <StatCard icon={Wallet} label="Commission Earned" value={formatINR(commissionEarned)} accent="amber" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Recent Leads</h2>
            <Link to="/agent/leads" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {myLeads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.budget}</p>
                </div>
                <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-700">
                  {lead.stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Upcoming Site Visits</h2>
            <Link to="/agent/site-visits" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {myVisits.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No upcoming visits.</p>}
            {myVisits.map((visit) => {
              const property = properties.find((p) => p.id === visit.propertyId);
              return (
                <div key={visit.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{visit.leadName}</p>
                    <p className="text-xs text-slate-400">{property?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-navy-800">{visit.date}</p>
                    <p className="text-xs text-slate-400">{visit.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
