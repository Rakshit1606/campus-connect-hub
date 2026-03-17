import React, { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "student" | "faculty";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = {
  student: { id: "s1", name: "Arjun Mehta", email: "arjun.mehta@campus.edu", role: "student" as UserRole },
  faculty: { id: "f1", name: "Dr. Priya Sharma", email: "priya.sharma@campus.edu", role: "faculty" as UserRole },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // Mock login - accept any non-empty credentials
    if (username && password) {
      setUser(mockUsers[role]);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
