import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: string | null;
  id: string | null; // Optional: if you want to store user ID
  token: string | null;
  login: (user: string, token: string, id: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null); // Optional: if you want to store user ID

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedId = localStorage.getItem("id"); // Optional: if you want to store user ID
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setId(savedId); // Optional: if you want to store user ID
    }
  }, []);

  const login = (token: string, user: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    localStorage.setItem("id", user); // Assuming user is a string, you might want to change this if you have a separate ID
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, id, login, logout, isLoggedIn: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
