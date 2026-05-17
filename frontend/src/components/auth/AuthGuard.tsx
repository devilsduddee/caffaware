"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard is a wrapper component that protects routes.
 * It checks if the user is authenticated and if they have completed onboarding.
 * If not authenticated, it redirects to the landing page.
 * If not onboarded, it redirects to the onboarding page.
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading, isOnboarded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (isOnboarded === false) {
        // If we definitely know they are NOT onboarded
        router.push("/onboarding");
      }
    }
  }, [user, loading, isOnboarded, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FDFCFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3D2B1F] border-t-transparent" />
          <p className="text-[#8D7B68] font-medium animate-pulse">Finding your calm...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
