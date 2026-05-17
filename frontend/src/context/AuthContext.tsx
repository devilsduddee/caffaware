"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isOnboarded: boolean | null;
  setIsOnboarded: (value: boolean | null) => void;
  userData: any | null;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  isOnboarded: null,
  setIsOnboarded: () => {},
  userData: null,
  refreshUserData: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { setLanguage } = useLanguage();

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setIsOnboarded(true);
        if (data?.language && (data.language === "id" || data.language === "en")) {
          setLanguage(data.language);
        }
      } else {
        setUserData(null);
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if onboarding is complete
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const exists = userDoc.exists();
          setIsOnboarded(exists);
          if (exists) {
            const data = userDoc.data();
            setUserData(data);
            if (data?.language && (data.language === "id" || data.language === "en")) {
              setLanguage(data.language);
            }
          }

          // Handle redirection logic if we are on landing or login page
          if (pathname === "/" || pathname === "/login") {
            if (exists) {
              router.push("/dashboard");
            } else {
              router.push("/onboarding");
            }
          }
        } catch (error) {
          console.error("Error fetching user doc:", error);
        }
      } else {
        setIsOnboarded(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router, setLanguage]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isOnboarded, setIsOnboarded, userData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
