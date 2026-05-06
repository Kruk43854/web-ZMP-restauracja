import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (data: any) => Promise<boolean>;
  loginGoogle: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const refreshCsrfToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/csrf`, {
        method: "GET",
        credentials: "include", 
      });
      if (response.ok) {
        const result = await response.json();
        const token = result.data; 
        setCsrfToken(token);
        return token;
      }
    } catch (error) {
      console.error("Nie udało się pobrać tokena CSRF", error);
    }
    return null;
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    if (options.body && typeof options.body === 'string' && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    
    const method = options.method?.toUpperCase() || 'GET';
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      let currentCsrf = csrfToken;
      if (!currentCsrf) {
        currentCsrf = await refreshCsrfToken();
      }
      if (currentCsrf) {
        headers.set('X-XSRF-TOKEN', currentCsrf);
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include", 
    };

    let response = await fetch(`${API_URL}${url}`, config);

    if (response.status === 401) {
      setIsAuthenticated(false);
      setUsername(null);
    }

    return response;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authFetch('/api/reservations?page=1&size=1', { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUsername(data?.data?.username || data?.username || null);
          
          refreshCsrfToken();
        } else {
          setIsAuthenticated(false);
          setUsername(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", 
      });

      if (response.ok) {
        const result = await response.json();
        setIsAuthenticated(true);
        setUsername(result?.data?.username || result?.username || null); 

        refreshCsrfToken();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const loginGoogle = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        setIsAuthenticated(true);
        setUsername(data?.data?.username || data?.username || null);
        
        refreshCsrfToken();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: "POST" });
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
    } finally {
      setIsAuthenticated(false);
      setUsername(null);
      setCsrfToken(null); 
    }
  };

  if (isInitializing) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50">
       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, loginGoogle, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}