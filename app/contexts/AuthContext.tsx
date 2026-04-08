import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, username: string) => void;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUsername(storedUsername);
    }
    setIsReady(true);
  }, []);

  const login = (newToken: string, newRefreshToken: string, newUsername: string) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUsername(newUsername);
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("username", newUsername);
  };

  const logout = async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      try {
        await fetch('/api/auth/logout', {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${currentToken}` 
          }
        });
      } catch (error) {
        console.error("Błąd podczas wylogowywania na serwerze:", error);
      }
    }
    setToken(null);
    setRefreshToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
  };

  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let currentToken = localStorage.getItem("token");
    const currentRefreshToken = localStorage.getItem("refreshToken");

    const headers = new Headers(options.headers || {});
    if (currentToken) {
      headers.set("Authorization", `Bearer ${currentToken}`);
    }

    let response = await fetch(url, { ...options, headers });
    if ((response.status === 401 || response.status === 403) && currentRefreshToken) {
      console.log("Token wygasł! Próbuję odświeżyć w tle...");
      
      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ refreshToken: currentRefreshToken })
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          
          const newToken = refreshData.data?.token || refreshData.data;
          const newRefresh = refreshData.data?.refreshToken || currentRefreshToken;

          setToken(newToken);
          setRefreshToken(newRefresh);
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefresh);

          console.log("Odświeżono pomyślnie! Ponawiam przerwane zapytanie...");

          headers.set("Authorization", `Bearer ${newToken}`);
          response = await fetch(url, { ...options, headers });
        } else {
          console.error("Refresh token również wygasł. Wylogowuję.");
          await logout();
        }
      } catch (error) {
        console.error("Błąd sieci przy odświeżaniu tokena.", error);
        await logout();
      }
    }

    return response;
  };

  if (!isReady) return null; 

  return (
    <AuthContext.Provider value={{ token, refreshToken, username, isAuthenticated: !!token, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth musi być użyte wewnątrz AuthProvider");
  }
  return context;
}