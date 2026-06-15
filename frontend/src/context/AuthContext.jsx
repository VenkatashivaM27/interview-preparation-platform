import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      userService.getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    localStorage.setItem('token', data.token);
    const profile = await userService.getProfile();
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem('token', data.token);
    const profile = await userService.getProfile();
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    const profile = await userService.getProfile();
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAdmin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
