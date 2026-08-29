import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, UserPlus, Check, SlidersHorizontal } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import PropertyFormWizard, { emptyDraft } from "../../components/property/PropertyFormWizard";
import ManageFiltersPanel from "../../components/admin/ManageFiltersPanel";
import { ADMIN_NAV } from "./nav";
import { useProperties } from "../../context/PropertyContext";
import { useUsers } from "../../context/UserContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { ROLES } from "../../data/roles";

const TABS = [
  { key: "property", label: "Add Property", icon: Building2 },
  { key: "user", label: "Add User", icon: UserPlus },
  { key: "filters", label: "Manage Filters", icon: SlidersHorizontal },
];

const emptyUserDraft = { name: "", phone: "", email: "", role: "buyer" };

export default function AdminAddData() {
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { addProperty } = useProperties();
  const { addUser } = useUsers();

  const [tab, setTab] = useState("property");
  const [propertyDraft, setPropertyDraft] = useState(emptyDraft);
  const [userDraft, setUserDraft] = useState(emptyUserDraft);
  const [userError, setUserError] = useState("");
  const [userSuccess, setUserSuccess] = useState(null);

  const handleAddProperty = () => {
    addProperty(propertyDraft, { name: admin.name, roleLabel: "Admin" }, { approvalStatus: "Approved" });
    navigate("/admin/properties");
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!userDraft.name.trim()) return setUserError("Enter the user's full name.");
    if (!/^\d{10}$/.test(userDraft.phone.trim())) return setUserError("Enter a valid 10-digit mobile number.");
    if (!/^\S+@\S+\.\S+$/.test(userDraft.email.trim())) return setUserError("Enter a valid email address.");
    setUserError("");
    const user = addUser(userDraft);
    setUserSuccess(user);
    setUserDraft(emptyUserDraft);
  };

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
        <h1 className="text-2xl font-extrabold text-navy-900">Add Data</h1>
        <p className="mt-1 text-sm text-slate-500">Directly add a new property listing or user account to Trin.ta.</p>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              tab === t.key ? "bg-navy-900 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "property" && (
        <div className="-mx-4 lg:-mx-8">
          <PropertyFormWizard
            draft={propertyDraft}
            setDraft={setPropertyDraft}
            onSubmit={handleAddProperty}
            submitLabel="Add Property"
            posterLabel={`${admin.name} (Admin)`}
            heading="Add a New Property"
            subheading="Directly list a property on Trin.ta — it publishes immediately, no approval needed."
          />
        </div>
      )}

      {tab === "filters" && <ManageFiltersPanel />}

      {tab === "user" && (
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 card-shadow">
          {userSuccess ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mint-50 text-mint-600">
                <Check className="h-5 w-5" />
              </div>
              <h2 className="mt-3 text-base font-bold text-navy-900">User added successfully</h2>
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-semibold text-navy-800">{userSuccess.name}</span> has been added as{" "}
                {ROLES.find((r) => r.key === userSuccess.role)?.label}.
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <Button variant="outline" onClick={() => setUserSuccess(null)}>
                  Add Another
                </Button>
                <Button variant="primary" onClick={() => navigate("/admin/users")}>
                  View All Users
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddUser}>
              <label className="block text-sm">
                <span className="font-semibold text-navy-800">Full Name</span>
                <input
                  value={userDraft.name}
                  onChange={(e) => setUserDraft((d) => ({ ...d, name: e.target.value }))}
                  type="text"
                  placeholder="e.g. Karthik Venkat"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>

              <label className="mt-4 block text-sm">
                <span className="font-semibold text-navy-800">Mobile Number</span>
                <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 py-2.5 focus-within:border-brand-500">
                  <span className="mr-2 font-semibold text-slate-500">+91</span>
                  <input
                    value={userDraft.phone}
                    onChange={(e) =>
                      setUserDraft((d) => ({ ...d, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
                    }
                    type="tel"
                    placeholder="9840000000"
                    className="w-full text-sm font-semibold text-navy-900 focus:outline-none"
                  />
                </div>
              </label>

              <label className="mt-4 block text-sm">
                <span className="font-semibold text-navy-800">Email Address</span>
                <input
                  value={userDraft.email}
                  onChange={(e) => setUserDraft((d) => ({ ...d, email: e.target.value }))}
                  type="email"
                  placeholder="name@example.com"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </label>

              <label className="mt-4 block text-sm">
                <span className="font-semibold text-navy-800">Role</span>
                <select
                  value={userDraft.role}
                  onChange={(e) => setUserDraft((d) => ({ ...d, role: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              {userError && <p className="mt-3 text-xs font-semibold text-brand-600">{userError}</p>}

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-extrabold text-white hover:bg-brand-700"
              >
                Add User
                <UserPlus className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
