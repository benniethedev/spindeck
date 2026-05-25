"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface DJUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  isDJ: boolean;
  djStatus?: "pending" | "approved" | "rejected";
  venueType?: string;
  yearsDJing?: string;
  instagram?: string;
  genre?: string;
  bio?: string;
  createdAt?: string;
}

interface DJContextType {
  user: DJUser | null;
  isAuthenticated: boolean;
  isDJApproved: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshDJStatus: (email: string) => Promise<boolean>;
}

const DJContext = createContext<DJContextType | undefined>(undefined);

function loadStoredUser(): DJUser | null {
  if (typeof window === "undefined") return null;
  try {
    const userData = localStorage.getItem("spinrec_user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

export function DJProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DJUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("spinrec_token");
    const userData = loadStoredUser();
    if (token && userData) {
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const djUser: DJUser = {
          ...data.user,
          isDJ: true,
          djStatus: "approved",
        };
        localStorage.setItem("spinrec_token", data.token);
        localStorage.setItem("spinrec_user", JSON.stringify(djUser));
        setUser(djUser);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const logout = useCallback(() => {
    localStorage.removeItem("spinrec_token");
    localStorage.removeItem("spinrec_user");
    setUser(null);
  }, []);

  const refreshDJStatus = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { listRecords } = await import("@/lib/storeai");
      const { records } = await listRecords({ key_prefix: `dj:${email}` });
      if (records && records.length > 0) {
        const data = records[0].data as Record<string, unknown>;
        const status = (data.status as string) || "pending";
        const djUser: DJUser = {
          ...user,
          id: (data.id as string) || user?.id || "",
          email: (data.email as string) || email,
          name: (data.djName as string) || user?.name || "",
          djStatus: status as "pending" | "approved" | "rejected",
          isDJ: status === "approved",
          instagram: (data.instagram as string) || user?.instagram,
          genre: (data.genre as string) || user?.genre,
          venueType: (data.venueType as string) || user?.venueType,
          yearsDJing: (data.yearsDJing as string) || user?.yearsDJing,
          bio: (data.bio as string) || user?.bio,
          createdAt: (data.createdAt as string) || user?.createdAt,
          plan: (user?.plan || "free"),
        };
        localStorage.setItem("spinrec_user", JSON.stringify(djUser));
        setUser(djUser);
        return status === "approved";
      }
    } catch {
      // ignore
    }
    return false;
  }, [user]);

  return (
    <DJContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDJApproved: user?.djStatus === "approved",
        isLoading,
        login,
        logout,
        refreshDJStatus,
      }}
    >
      {children}
    </DJContext.Provider>
  );
}

export function useDJ() {
  const context = useContext(DJContext);
  if (context === undefined) {
    throw new Error("useDJ must be used within a DJProvider");
  }
  return context;
}
