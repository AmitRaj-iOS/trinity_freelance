import { useState } from "react";
import { Phone } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AGENT_NAV } from "./nav";
import { properties } from "../../data/properties";
import { agents, leads as initialLeads, LEAD_STAGES } from "../../data/agentData";

const CURRENT_AGENT_ID = "agent-priya";

const STAGE_COLORS = {
  New: "border-t-navy-500",
  "Site Visit": "border-t-amber-500",
  Negotiation: "border-t-brand-500",
  Closed: "border-t-mint-500",
};

export default function AgentLeads() {
  const agent = agents[CURRENT_AGENT_ID];
  const [leads, setLeads] = useState(initialLeads.filter((l) => l.agentId === CURRENT_AGENT_ID));

  const advanceStage = (leadId) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const idx = LEAD_STAGES.indexOf(lead.stage);
        const next = LEAD_STAGES[Math.min(idx + 1, LEAD_STAGES.length - 1)];
        return { ...lead, stage: next };
      })
    );
  };

  return (
    <DashboardLayout role="agent" roleLabel="Agent" userName={agent.name} navItems={AGENT_NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy-900">Leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track buyers through your pipeline — New → Site Visit → Negotiation → Closed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          return (
            <div key={stage} className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-bold text-navy-900">{stage}</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                  {stageLeads.length}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {stageLeads.map((lead) => {
                  const property = properties.find((p) => p.id === lead.propertyId);
                  return (
                    <div
                      key={lead.id}
                      className={`rounded-xl border border-t-4 border-slate-200 bg-white p-4 card-shadow ${STAGE_COLORS[stage]}`}
                    >
                      <p className="text-sm font-bold text-navy-900">{lead.name}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{property?.name}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-navy-700">{lead.budget}</span>
                        <span className="text-slate-400">{lead.source}</span>
                      </div>
                      {stage !== "Closed" && (
                        <button
                          type="button"
                          onClick={() => advanceStage(lead.id)}
                          className="mt-3 w-full rounded-lg bg-navy-50 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-100"
                        >
                          Move to {LEAD_STAGES[LEAD_STAGES.indexOf(stage) + 1]} →
                        </button>
                      )}
                    </div>
                  );
                })}
                {stageLeads.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
