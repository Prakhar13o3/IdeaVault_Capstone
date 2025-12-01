import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (tok, userObj) => {
    setToken(tok);
    localStorage.setItem("token", tok);
    if (userObj) {
      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    // keep token & user in sync if localStorage changes elsewhere
    const tok = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (tok && !token) setToken(tok);
    if (u && !user) {
      try { setUser(JSON.parse(u)); } catch (e) { /* ignore */ }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
