import * as authService from "@/services/auth.service";
import { User } from "@/types/api.types";
import { useRouter } from "expo-router";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextType {
  user: User | null;
  callerId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, callerId: number, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [callerId, setCallerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Declare checkAuthStatus BEFORE using it in useEffect
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await authService.getAuthToken();
      if (token) {
        // Token exists, but we'd need to fetch the user profile
        // For now, assume user is authenticated
        console.log("[AuthContext] Token found, user is authenticated");
      }
    } catch (error) {
      console.error("[AuthContext] Failed to check auth status:", error);
    }
  }, []);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(
    async (userData: User, id: number, token: string) => {
      try {
        setIsLoading(true);
        console.log("[AuthContext] Login called with:", {
          userId: userData.id,
          callerId: id,
          hasToken: !!token
        });
        
        // Token is already saved in verifyOtp, just set context
        setUser(userData);
        setCallerId(id);
        
        console.log("[AuthContext] Login successful, user context updated");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      // Call API logout
      await authService.logout();
    } catch (error) {
      console.error("[AuthContext] Logout API failed:", error);
      // Still clear local state even if API call fails
    } finally {
      // Clear local state
      setUser(null);
      setCallerId(null);
      setIsLoading(false);
      // Route to login screen
      router.replace("/(auth)/login");
    }
  }, [router]);

  const value: AuthContextType = {
    user,
    callerId,
    isAuthenticated: !!user && !!callerId,
    isLoading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
