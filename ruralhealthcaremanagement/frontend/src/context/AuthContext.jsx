import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rhms_user')));

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      const userData = response.data;
      localStorage.setItem('rhms_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      // Fallback for frontend testing when backend is not running
      if (error.code === 'ERR_NETWORK') {
        console.warn('Backend not reachable. Logging in with mock data.');
        const mockUser = { id: 1, username, roles: ['ROLE_ADMIN'], name: 'Mock Admin' };
        localStorage.setItem('rhms_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true };
      }
      return { success: false, message: error.response?.data || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('rhms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
