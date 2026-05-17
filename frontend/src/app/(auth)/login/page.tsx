"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Coffee, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { loginWithGoogle, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB] p-4 sm:p-6 relative overflow-hidden selection:bg-[#C6A49A]/20">
      {/* Emotional Ambient Lighting Glows */}
      <div className="glow-warm top-[-10%] left-[-10%]" />
      <div className="glow-sage bottom-[-10%] right-[-10%]" />

      {/* Subtle Back to Landing Navigation */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-12 z-20 animate-in fade-in duration-300">
        <Link 
          href="/"
          className="interactive-btn-secondary flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-[#C6A49A]" />
          <span>{t.common.back}</span>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8 rounded-[2.5rem] surface-elevated p-8 sm:p-12 shadow-[0_20px_60px_rgba(61,43,31,0.08)] border border-[#E8DFD8] animate-in zoom-in-95 duration-500 relative z-10">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] shadow-sm group hover:scale-105 transition-transform duration-300">
            <Coffee className="h-8 w-8 text-[#3D2B1F]" />
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-[#3D2B1F]">
            {t.login.title}
          </h2>
          <p className="text-[#8D7B68] text-sm sm:text-base font-medium leading-relaxed">
            {t.login.subtitle}
          </p>
        </div>

        <div className="mt-8 space-y-6 pt-2">
          <Button
            onClick={loginWithGoogle}
            disabled={loading}
            className="interactive-btn-primary w-full h-15 rounded-2xl font-extrabold text-base sm:text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{t.login.signingIn}</span>
              </span>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-[#C6A49A]" />
                <span>{t.login.signInBtn}</span>
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 text-center pt-6 border-t border-[#F3EEEA]/80">
          <p className="text-xs text-[#C6A49A] leading-relaxed font-bold tracking-wide uppercase">
            Mindful energy tracking • Zero medical advice
          </p>
        </div>
      </div>
    </div>
  );
}
