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
  const [wishlist, setWishlist] = useState(() => loadJSON(STORAGE_KEY, []));

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist)), [wishlist]);

  const isWishlisted = (id) => wishlist.includes(id);

  const toggleWishlist = (id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [id, ...prev]));
  };

  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((i) => i !== id));

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
