import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = Boolean(adminToken);

  const loginUser = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('adminToken');
    setToken(newToken);
    setUser(userData);
    setAdminToken(null);
  };

  const loginAdmin = (newAdminToken) => {
    localStorage.setItem('adminToken', newAdminToken);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAdminToken(newAdminToken);
    setToken(null);
    setUser({ name: 'Super Admin', role: 'admin' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    setToken(null);
    setAdminToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        adminToken,
        user,
        isSuperAdmin,
        isAuthenticated: Boolean(token || adminToken),
        isUser: Boolean(token && !adminToken),
        loading,
        loginUser,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
