import { createContext, useContext, useEffect, useState } from "react";
import { getRole } from "../data/roles";

const AuthContext = createContext(null);
const STORAGE_KEY = "trinita_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = ({ name, phone, roleKey }) => {
    const role = getRole(roleKey);
    const loggedInUser = {
      id: `${roleKey}-${phone}`,
      name,
      phone,
      role: roleKey,
      roleLabel: role?.label || roleKey,
    };
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
