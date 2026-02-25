"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "@/lib/data/users";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string, newPassword: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  // Update loading state based on session status
  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        return result?.ok ?? false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const resetPassword = (email: string, newPassword: string): boolean => {
    // This is just for demo - in real app, would call API
    // For now, kept as placeholder since it's tied to fake JSON DB
    console.warn("resetPassword called but not fully integrated with NextAuth");
    return false;
  };

  // Convert session user to User format
  const user: User | null =
    session?.user && status === "authenticated"
      ? ({
          id: session.user.id || "",
          email: session.user.email || "",
          name: session.user.name || "",
          phone: (session.user as any).phone || "",
          role: (session.user as any).role || "DRIVER",
        } as User)
      : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: status === "authenticated",
        login,
        logout,
        resetPassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
