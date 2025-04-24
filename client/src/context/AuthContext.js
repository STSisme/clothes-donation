import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { login as apiLogin, register as apiRegister } from "api/authService"; // adjust path as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || null);

  const isAuthenticated = !!user && !!authToken;

  const login = useCallback(async (email, password) => {
    try {
      const { token, user } = await apiLogin(email, password);
  
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
  
      setUser(user);
      setAuthToken(token);

      return user;

    } catch (error) {
      const message = error?.response?.data?.detail || error.message || "Login failed.";
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const { token, user } = await apiRegister(userData);
  
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
  
      setUser(user);
      setAuthToken(token);
  
      return user;
    } catch (error) {
      const message = error?.response?.data?.detail || error.message || "Registration failed.";
      throw new Error(message);
    }
  }, []);  

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  
    setUser(null);
    setAuthToken(null);
  }, []);
  

  const contextValue = useMemo(() => ({
    user,
    authToken,
    isAuthenticated,
    login,
    logout,
    register,
  }), [user, authToken, isAuthenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
