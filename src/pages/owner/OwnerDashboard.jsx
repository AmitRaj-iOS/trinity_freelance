import { Link } from "react-router-dom";
import { Building2, Users, CalendarCheck2, TrendingUp, ArrowRight, Eye, Activity } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { OWNER_NAV } from "./nav";
import { useProperties } from "../../context/PropertyContext";
import { useAuth } from "../../context/AuthContext";
import { leads, siteVisits, owners } from "../../data/agentData";
import { timeAgo } from "../../lib/format";

const CURRENT_OWNER_ID = "owner-ravi";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { allProperties, getVisitCount, getVisitors } = useProperties();
  const owner = user || owners[CURRENT_OWNER_ID];
  const myProperties = allProperties.filter(
    (p) => p.ownerId === CURRENT_OWNER_ID || (user && p.ownerId === user.id)
  );
  const myPropertyIds = myProperties.map((p) => p.id);
  const myLeads = leads.filter((l) => myPropertyIds.includes(l.propertyId));
  const myVisits = siteVisits.filter(
    (v) => myPropertyIds.includes(v.propertyId) && v.status === "Scheduled"
  );
  const totalPropertyViews = myPropertyIds.reduce((s, id) => s + getVisitCount(id), 0);

  const recentActivity = myProperties
    .flatMap((property) => getVisitors(property.id).map((v) => ({ ...v, propertyName: property.name })))
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 6);

  return (
    <DashboardLayout role="owner" roleLabel="Owner" userName={owner.name} navItems={OWNER_NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-navy-900">Welcome back, {owner.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-slate-500">An overview of your listed properties and inbound interest.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Building2} label="My Properties" value={myProperties.length} accent="navy" />
        <StatCard icon={Eye} label="Total Property Visits" value={totalPropertyViews} accent="brand" />
        <StatCard icon={Users} label="Total Leads" value={myLeads.length} accent="brand" />
        <StatCard icon={CalendarCheck2} label="Upcoming Site Visits" value={myVisits.length} accent="mint" />
        <StatCard
          icon={TrendingUp}
          label="Avg. Construction Progress"
          value={`${Math.round(
            myProperties.reduce((s, p) => s + p.completion, 0) / (myProperties.length || 1)
          )}%`}
          accent="amber"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">My Properties</h2>
            <Link to="/owner/properties" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {myProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-4 py-3">
                <img src={property.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900">{property.name}</p>
                  <p className="text-xs text-slate-400">{property.location}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Eye className="h-3.5 w-3.5" />
                  {getVisitCount(property.id)}
                </span>
                <StatusBadge status={property.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-brand-500" />
            <h2 className="text-base font-bold text-navy-900">Recent Visitor Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="mt-6 text-center text-xs text-slate-400">
              No one has viewed your listings yet. Share your listing link to get visitors.
            </p>
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
      </div>
    </DashboardLayout>
  );
}
