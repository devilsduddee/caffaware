import React from "react";
import { User } from "firebase/auth";
import { User as UserIcon, ShieldAlert, Moon, Sparkles, LogOut, RefreshCw, Activity, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/api";

interface UserProfileProps {
  user: User | null;
  wellnessProfile: any;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, wellnessProfile, onLogout }) => {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const limit = wellnessProfile?.daily_limit_mg || 250;
  const cutoff = wellnessProfile?.recommended_cutoff || "14:00";
  const sensitivity = wellnessProfile?.sensitivity_level || "Moderate";
  const sleepTarget = wellnessProfile?.sleep_time || "22:00";

  const handleLanguageChange = async (lang: "id" | "en") => {
    setLanguage(lang);
    if (user?.uid) {
      try {
        await apiFetch("/api/users/language", {
          method: "PATCH",
          body: JSON.stringify({ language: lang }),
        });
      } catch (err) {
        console.error("Failed to persist language to backend:", err);
      }
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-300 pb-16 sm:pb-24">
      <div className="flex items-center gap-4 border-b border-[#F3EEEA]/80 pb-6 relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] shadow-sm group hover:scale-105 transition-transform duration-300">
          <UserIcon className="h-7 w-7 text-[#3D2B1F]" />
        </div>
        <div>
          <h3 className="font-black text-2xl sm:text-3xl text-[#3D2B1F] tracking-tight leading-none">{t.dashboard.profileHeroTitle}</h3>
          <p className="text-xs sm:text-base text-[#8D7B68] mt-1.5 font-semibold">{t.dashboard.profileHeroSub}</p>
        </div>
      </div>

      {/* User Identity Card */}
      <div className="rounded-[2.5rem] surface-elevated p-8 sm:p-12 shadow-[0_20px_60px_rgba(61,43,31,0.06)] border border-[#E8DFD8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300 hover:shadow-[0_25px_70px_rgba(61,43,31,0.1)] hover:border-[#C6A49A]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A49A]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="flex h-18 w-18 items-center justify-center rounded-[1.5rem] bg-[#3D2B1F] text-white font-black text-3xl shadow-md shrink-0">
            {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight">{user?.displayName || "Wellness User"}</h4>
            <p className="text-xs sm:text-base text-[#8D7B68] font-bold">{user?.email}</p>
            <span className="inline-block bg-[#E8F3F1] text-[#76A8A1] text-[10px] font-extrabold px-3 py-1 rounded-full mt-1 border border-[#76A8A1]/20 uppercase tracking-wider">
              Firebase Authenticated
            </span>
          </div>
        </div>

        <Button
          onClick={onLogout}
          variant="ghost"
          className="text-red-600 hover:text-white hover:bg-red-600 h-16 rounded-2xl flex items-center gap-3 text-base font-extrabold transition-all duration-300 px-8 border border-red-200 shadow-sm w-full sm:w-auto justify-center relative z-10"
        >
          <LogOut className="h-5 w-5" />
          <span>{t.dashboard.logoutBtn}</span>
        </Button>
      </div>

      {/* Platform Settings / Language Selector */}
      <div className="rounded-[2.5rem] surface-elevated p-8 sm:p-12 shadow-[0_20px_60px_rgba(61,43,31,0.06)] border border-[#E8DFD8] space-y-6 transition-all duration-300 hover:shadow-[0_25px_70px_rgba(61,43,31,0.1)] hover:border-[#C6A49A]/40 relative overflow-hidden">
        <div className="flex items-center gap-3.5 border-b border-[#F3EEEA]/80 pb-6 relative z-10">
          <Globe className="h-6 w-6 text-[#C6A49A]" />
          <h4 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight leading-none">{t.dashboard.settingsTitle}</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2 relative z-10">
          <div className="space-y-1.5 max-w-md">
            <h5 className="font-black text-lg text-[#3D2B1F] tracking-tight">{t.dashboard.languageLabel}</h5>
            <p className="text-xs sm:text-sm text-[#8D7B68] font-medium leading-relaxed">{t.dashboard.languageDesc}</p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E8DFD8] shadow-xs w-full sm:w-auto">
            <button
              onClick={() => handleLanguageChange("id")}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-extrabold text-sm transition-all duration-300 ${
                language === "id" ? "bg-[#3D2B1F] text-white shadow-sm scale-[1.02]" : "text-[#8D7B68] hover:text-[#3D2B1F]"
              }`}
            >
              Bahasa Indonesia
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-extrabold text-sm transition-all duration-300 ${
                language === "en" ? "bg-[#3D2B1F] text-white shadow-sm scale-[1.02]" : "text-[#8D7B68] hover:text-[#3D2B1F]"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Wellness Profile Summary */}
      <div className="rounded-[2.5rem] surface-elevated p-8 sm:p-12 shadow-[0_20px_60px_rgba(61,43,31,0.06)] border border-[#E8DFD8] space-y-8 transition-all duration-300 hover:shadow-[0_25px_70px_rgba(61,43,31,0.1)] hover:border-[#C6A49A]/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-[#F3EEEA]/80 pb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <Activity className="h-6 w-6 text-[#76A8A1]" />
            <h4 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight leading-none">{t.profile.bioSection}</h4>
          </div>
          <Button
            onClick={() => router.push("/onboarding")}
            variant="outline"
            className="interactive-btn-secondary h-14 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-extrabold px-6 shadow-sm w-full sm:w-auto justify-center"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t.common.edit}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 relative z-10">
          {/* Daily Limit */}
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-[#F3EEEA]/80 pb-6 sm:pb-0 sm:pr-6 bg-[#FAF8F5] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-[#E8DFD8] sm:border-0 shadow-sm sm:shadow-none">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-[#C6A49A]" />
              <span>{t.cards.dailyLimitTitle}</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#3D2B1F] tracking-tight mt-1">{limit} <span className="text-base font-extrabold text-[#8D7B68]">mg</span></p>
            <p className="text-xs text-[#8D7B68] leading-relaxed pt-1 font-semibold">{t.cards.dailyLimitDesc}</p>
          </div>

          {/* Sleep Cutoff */}
          <div className="space-y-2 border-b sm:border-b-0 lg:border-r border-[#F3EEEA]/80 pb-6 sm:pb-0 sm:pr-6 lg:pl-6 bg-[#FAF8F5] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-[#E8DFD8] sm:border-0 shadow-sm sm:shadow-none">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">
              <Moon className="h-4 w-4 text-[#76A8A1]" />
              <span>{t.cards.sleepCutoffTitle}</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#3D2B1F] tracking-tight mt-1">{cutoff}</p>
            <p className="text-xs text-[#8D7B68] leading-relaxed pt-1 font-semibold">{t.cards.sleepCutoffDesc}</p>
          </div>

          {/* Sensitivity Level */}
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-[#F3EEEA]/80 pb-6 sm:pb-0 sm:pr-6 lg:pl-6 bg-[#FAF8F5] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-[#E8DFD8] sm:border-0 shadow-sm sm:shadow-none">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4 text-amber-50" />
              <span>{t.cards.sensitivityTitle}</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#3D2B1F] tracking-tight capitalize mt-1">{sensitivity}</p>
            <p className="text-xs text-[#8D7B68] leading-relaxed pt-1 font-semibold">{t.cards.sensitivityDesc}</p>
          </div>

          {/* Sleep Target */}
          <div className="space-y-2 lg:pl-6 bg-[#FAF8F5] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-[#E8DFD8] sm:border-0 shadow-sm sm:shadow-none">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">
              <Moon className="h-4 w-4 text-[#3D2B1F]" />
              <span>{t.profile.sleepTime}</span>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#3D2B1F] tracking-tight mt-1">{sleepTarget}</p>
            <p className="text-xs text-[#8D7B68] leading-relaxed pt-1 font-semibold">{t.cards.sleepCutoffDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
