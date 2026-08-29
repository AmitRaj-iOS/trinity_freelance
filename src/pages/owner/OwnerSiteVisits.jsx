import { CalendarCheck2, MapPin } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import { OWNER_NAV } from "./nav";
import { properties } from "../../data/properties";
import { siteVisits, owners } from "../../data/agentData";

const CURRENT_OWNER_ID = "owner-ravi";

export default function OwnerSiteVisits() {
  const owner = owners[CURRENT_OWNER_ID];
  const myPropertyIds = properties.filter((p) => p.ownerId === CURRENT_OWNER_ID).map((p) => p.id);
  const visits = siteVisits
    .filter((v) => myPropertyIds.includes(v.propertyId))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <DashboardLayout role="owner" roleLabel="Owner" userName={owner.name} navItems={OWNER_NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy-900">Site Visits (Read-only)</h1>
        <p className="mt-1 text-sm text-slate-500">Tours scheduled by your agent for your properties.</p>
      </div>

      <div className="space-y-3">
        {visits.map((visit) => {
          const property = properties.find((p) => p.id === visit.propertyId);
          return (
            <div
              key={visit.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 card-shadow sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">{visit.leadName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" />
                    {property?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy-800">{visit.date}</p>
                  <p className="text-xs text-slate-400">{visit.time}</p>
                </div>
                <Badge variant={visit.status === "Scheduled" ? "brand" : "mint"}>{visit.status}</Badge>
              </div>
            </div>
          );
        })}
        {visits.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-400">
            No site visits scheduled.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
