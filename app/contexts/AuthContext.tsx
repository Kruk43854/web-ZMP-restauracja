import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getCsrfToken = () => {
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  return match ? match[2] : null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

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
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers.set('X-XSRF-TOKEN', csrfToken);
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include", 
    };

    let response = await fetch(url, config);

    if (response.status === 401) {
      setIsAuthenticated(false);
    }

    return response;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authFetch('/api/reservations?page=1&size=1', { method: "GET" });
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", 
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
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
    }
  };

  if (isInitializing) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-50">
       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authFetch }}>
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