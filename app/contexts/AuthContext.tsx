import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface LoginCredentials {
  username?: string;
  password?: string;
  [key: string]: string | undefined; 
}

interface AuthResponse {
  data?: {
    username?: string;
  };
  username?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginGoogle: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const getCsrfToken = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  return match ? match[2] : null;
};

const clearCookies = () => {
  const hostname = window.location.hostname;
  const domains = ["", `; domain=${hostname}`, `; domain=.${hostname}`];

  domains.forEach(domainAttr => {
    document.cookie = `XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainAttr}; Secure; SameSite=Lax;`;
    document.cookie = `XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainAttr}; Secure; SameSite=None;`;
    document.cookie = `XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainAttr};`;
  });
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers || {});

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    
    if (options.body && typeof options.body === 'string' && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    
    const method = options.method?.toUpperCase() || 'GET';
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const liveCsrfToken = getCsrfToken();
      if (liveCsrfToken) {
        headers.set('X-XSRF-TOKEN', liveCsrfToken);
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include", 
    };

    const response = await fetch(`${API_URL}${url}`, config);
    
    if (response.status === 401 || response.status === 403) {
      setIsAuthenticated(false);
      setUsername(null);
      localStorage.removeItem("username");
      clearCookies();
    }

    return response;
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authFetch('/api/auth/refresh', { method: "POST" });

        if (response.ok) {
          const result: AuthResponse = await response.json().catch(() => ({}));
          const fetchedName = result?.data?.username || result?.username || localStorage.getItem("username");
          
          setIsAuthenticated(true);
          if (fetchedName) {
            setUsername(fetchedName);
            localStorage.setItem("username", fetchedName);
          }
        } else {
          setIsAuthenticated(false);
          setUsername(null);
          localStorage.removeItem("username");
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", 
      });

      if (response.ok) {
        const result: AuthResponse = await response.json().catch(() => ({}));
        const user = result?.data?.username || result?.username;
        
        setIsAuthenticated(true);
        if (user) {
          setUsername(user);
          localStorage.setItem("username", user); 
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const loginGoogle = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json().catch(() => ({}));
        const user = data?.data?.username || data?.username;
        
        setIsAuthenticated(true);
        if (user) {
          setUsername(user);
          localStorage.setItem("username", user);
        }
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authFetch('/api/auth/logout', { method: "POST" });
    } catch (error) {
    } finally {
      setIsAuthenticated(false);
      setUsername(null);
      localStorage.removeItem("username");
      clearCookies();
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, loginGoogle, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}