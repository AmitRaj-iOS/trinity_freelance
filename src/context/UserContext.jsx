import { createContext, useContext, useEffect, useState } from "react";
import { users as staticUsers } from "../data/users";

const UserContext = createContext(null);
const ADDED_KEY = "trinita_added_users";
const EDITS_KEY = "trinita_user_edits";
const DELETED_KEY = "trinita_deleted_users";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function UserProvider({ children }) {
  const [added, setAdded] = useState(() => loadJSON(ADDED_KEY, []));
  const [edits, setEdits] = useState(() => loadJSON(EDITS_KEY, {}));
  const [deletedIds, setDeletedIds] = useState(() => loadJSON(DELETED_KEY, []));

  useEffect(() => localStorage.setItem(ADDED_KEY, JSON.stringify(added)), [added]);
  useEffect(() => localStorage.setItem(EDITS_KEY, JSON.stringify(edits)), [edits]);
  useEffect(() => localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds)), [deletedIds]);

  const allUsers = [...added, ...staticUsers]
    .map((u) => (edits[u.id] ? { ...u, ...edits[u.id] } : u))
    .filter((u) => !deletedIds.includes(u.id));

  const addUser = ({ name, phone, email, role }) => {
    const id = `${role}-${Date.now().toString(36)}`;
    const user = {
      id,
      name,
      phone,
      email,
      role,
      status: "Active",
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setAdded((prev) => [user, ...prev]);
    return user;
  };

  const setStatus = (id, status) => setEdits((prev) => ({ ...prev, [id]: { ...prev[id], status } }));
  const suspendUser = (id) => setStatus(id, "Suspended");
  const activateUser = (id) => setStatus(id, "Active");
  const deleteUser = (id) => {
    if (added.some((u) => u.id === id)) {
      setAdded((prev) => prev.filter((u) => u.id !== id));
    } else {
      setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  return (
    <UserContext.Provider value={{ allUsers, addUser, suspendUser, activateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => useContext(UserContext);
