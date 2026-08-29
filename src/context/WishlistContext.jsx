import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "trinita_wishlist";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function WishlistProvider({ children }) {
  const [byUser, setByUser] = useState(() => loadJSON(STORAGE_KEY, {}));

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(byUser)), [byUser]);

  const wishlistFor = (userId) => (userId ? byUser[userId] || [] : []);

  const isWishlisted = (userId, propertyId) => wishlistFor(userId).includes(propertyId);

  const toggleWishlist = (userId, propertyId) => {
    if (!userId) return;
    setByUser((prev) => {
      const list = prev[userId] || [];
      const next = list.includes(propertyId) ? list.filter((i) => i !== propertyId) : [propertyId, ...list];
      return { ...prev, [userId]: next };
    });
  };

  const removeFromWishlist = (userId, propertyId) => {
    if (!userId) return;
    setByUser((prev) => ({ ...prev, [userId]: (prev[userId] || []).filter((i) => i !== propertyId) }));
  };

  return (
    <WishlistContext.Provider value={{ wishlistFor, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
