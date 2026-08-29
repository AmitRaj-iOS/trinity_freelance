import { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext(null);
const STORAGE_KEY = "trinita_admin_auth";

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (admin) localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
    else localStorage.removeItem(STORAGE_KEY);
  }, [admin]);

  const loginAdmin = ({ name, phone }) => {
    const loggedInAdmin = {
      id: `admin-${phone}`,
      name,
      phone,
      role: "admin",
      roleLabel: "Admin",
    };
    setAdmin(loggedInAdmin);
    return loggedInAdmin;
  };

  const logoutAdmin = () => setAdmin(null);

  return (
    <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
