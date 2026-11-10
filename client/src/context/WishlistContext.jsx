import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'srent_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (item) => {
    if (!item || !item._id) return;
    setWishlist((prev) => {
      const exists = prev.some((it) => it._id === item._id);
      if (exists) {
        return prev.filter((it) => it._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isWishlisted = (itemId) => {
    if (!itemId) return false;
    return wishlist.some((it) => it._id === itemId);
  };

  const removeFromWishlist = (itemId) => {
    setWishlist((prev) => prev.filter((it) => it._id !== itemId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

