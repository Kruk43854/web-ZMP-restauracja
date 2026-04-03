import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
  updateUsername: (newUsername: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (storedToken) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  const updateUsername = (newUsername: string) => {
    localStorage.setItem("username", newUsername);
    setUsername(newUsername);
  };

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth musi być użyty wewnątrz AuthProvider");
  }
  return context;
};