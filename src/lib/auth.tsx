import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, onUnauthorized, setAuthToken } from "./api";
import { tokenStorage } from "./tokenStorage";

// Replaces next-auth's SessionProvider / useSession / signIn / signOut.
const TOKEN_KEY = "cr_auth_token";

type AuthState = {
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
    await tokenStorage.deleteItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    onUnauthorized(() => {
      signOut();
    });
    tokenStorage.getItem(TOKEN_KEY)
      .then((stored) => {
        setAuthToken(stored);
        setToken(stored);
      })
      .finally(() => setLoading(false));
  }, [signOut]);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api.post("/api/mobile/login", { email, password });
    const newToken: string = res.data.token;
    await tokenStorage.setItem(TOKEN_KEY, newToken);
    setAuthToken(newToken);
    setToken(newToken);
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
