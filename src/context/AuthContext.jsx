import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
        // Here we could validate the token with the backend if we had a /me endpoint
        // For now, we assume if token exists, we are logged in.
        // We can decode the token to get the username if needed, or store it in localStorage too.
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(storedUser);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5042/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(error || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.username);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (username, password) => {
      try {
        const response = await fetch('http://localhost:5042/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }
        return true;
      } catch (error) {
          throw error;
      }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
