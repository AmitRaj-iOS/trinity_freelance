import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Ban, CheckCircle2, Trash2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import { ADMIN_NAV } from "./nav";
import { useUsers } from "../../context/UserContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { ROLES, getRole } from "../../data/roles";

const ROLE_TABS = ["All", ...ROLES.map((r) => r.key)];

export default function AdminUsers() {
  const { admin, logoutAdmin } = useAdminAuth();
  const { allUsers, suspendUser, activateUser, deleteUser } = useUsers();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState("All");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      if (roleTab !== "All" && u.role !== roleTab) return false;
      if (search && !`${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [allUsers, roleTab, search]);

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
        <h1 className="text-2xl font-extrabold text-navy-900">All Users</h1>
        <p className="mt-1 text-sm text-slate-500">Manage everyone registered on Trin.ta.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {ROLE_TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRoleTab(key)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                roleTab === key ? "bg-navy-900 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {key === "All" ? "All" : getRole(key)?.label}
            </button>
          ))}
        </div>
        <label className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name, email, phone"
            className="w-full text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white card-shadow">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy-700">
                      {u.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <p className="font-semibold text-navy-900">{u.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{u.email}</p>
                  <p className="text-xs text-slate-400">+91 {u.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="soft">{getRole(u.role)?.label || u.role}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{u.joinedAt}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.status === "Active" ? "mint" : "brand"}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {u.status === "Active" ? (
                      <button
                        type="button"
                        aria-label="Suspend user"
                        onClick={() => suspendUser(u.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label="Activate user"
                        onClick={() => activateUser(u.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-mint-50 hover:text-mint-600"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Delete user"
                      onClick={() => setDeleteTarget(u)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-400">No users match this view.</div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-sm font-bold text-navy-900">Remove this user?</h2>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold text-navy-800">{deleteTarget.name}</span> will lose access to
              Trin.ta. This can't be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-navy-800 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
