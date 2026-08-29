import { createContext, useContext, useEffect, useState } from "react";

const ContactRevealContext = createContext(null);
const STORAGE_KEY = "trinita_contact_reveals";
export const FREE_REVEAL_LIMIT = 5;

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function ContactRevealProvider({ children }) {
  const [byUser, setByUser] = useState(() => loadJSON(STORAGE_KEY, {}));

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(byUser)), [byUser]);

  const revealedFor = (userId) => byUser[userId] || [];

  const isRevealed = (userId, propertyId) => revealedFor(userId).includes(propertyId);

  const remainingFor = (userId) => Math.max(0, FREE_REVEAL_LIMIT - revealedFor(userId).length);

  const reveal = (userId, propertyId) => {
    if (!userId) return false;
    const revealed = revealedFor(userId);
    if (revealed.includes(propertyId)) return true;
    if (revealed.length >= FREE_REVEAL_LIMIT) return false;
    setByUser((prev) => ({ ...prev, [userId]: [...revealed, propertyId] }));
    return true;
  };

  return (
    <ContactRevealContext.Provider value={{ isRevealed, remainingFor, revealedFor, reveal }}>
      {children}
    </ContactRevealContext.Provider>
  );
}

export const useContactReveal = () => useContext(ContactRevealContext);
