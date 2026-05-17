"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Coffee, LogOut, Activity, Home, Sparkles, History as HistoryIcon, User as UserIcon, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DailyIntakeCard } from "@/components/dashboard/DailyIntakeCard";
import { QuickAddSection } from "@/components/dashboard/QuickAddSection";
import { PersonalizedInsights } from "@/components/dashboard/PersonalizedInsights";
import { WellnessCards } from "@/components/dashboard/WellnessCards";
import { TrendVisualization } from "@/components/dashboard/TrendVisualization";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { AdaptiveAILayer } from "@/components/dashboard/AdaptiveAILayer";
import { MobileInsightsView } from "@/components/dashboard/MobileInsightsView";
import { JourneyView } from "@/components/dashboard/JourneyView";

import { calculateWellnessIntelligence } from "@/lib/intelligence";
import { useLanguage } from "@/context/LanguageContext";

interface Drink {
  id: string;
  name: string;
  caffeine_mg: number;
  category: string;
  timestamp: string;
}

export default function DashboardPage() {
  const { user, logout, userData } = useAuth();
  const { t, language } = useLanguage();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loadingDrinks, setLoadingDrinks] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "insights" | "journey" | "profile">("home");
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<any>(null);

  useEffect(() => {
    fetchDrinks();
  }, [user]);

  useEffect(() => {
    if (drinks.length > 0 && user) {
      fetchAiSummary();
    }
  }, [drinks, user, language]);

  const fetchAiSummary = async () => {
    try {
      const data = await apiFetch("/api/ai/wellness-summary", {
        method: "POST",
        body: JSON.stringify({
          drinks: drinks.slice(0, 15),
          profile: userData?.wellness_profile,
          language: language,
        }),
      });
      if (data && data.result) {
        setAiSummary(data.result);
      }
    } catch (err) {
      console.warn("Gemini AI summary fallback:", err);
    }
  };

  const fetchDrinks = async () => {
    if (!user) return;
    setError(null);
    try {
      const data = await apiFetch("/api/drinks");
      setDrinks(data.drinks || []);
    } catch (err) {
      console.error("Failed to fetch drinks:", err);
      setError(t.dashboard.errorBanner);
    } finally {
      setLoadingDrinks(false);
    }
  };

  const handleAddDrink = async (name: string, mg: number, category: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/api/drinks", {
        method: "POST",
        body: JSON.stringify({
          name,
          caffeine_mg: mg,
          category,
        }),
      });
      if (data.drink) {
        setDrinks((prev) => [data.drink, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add drink:", err);
      setError(t.dashboard.errorBanner);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDrink = async (id: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await apiFetch(`/api/drinks/${id}`, {
        method: "DELETE",
      });
      setDrinks((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete drink:", err);
      setError(t.dashboard.errorBanner);
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate today's intake
  const todayDrinks = drinks.filter((drink) => {
    try {
      const date = new Date(drink.timestamp);
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } catch {
      return true;
    }
  });

  const currentIntake = todayDrinks.reduce((sum, d) => sum + (d.caffeine_mg || 0), 0);

  // Compute Wellness Intelligence & Adaptive AI Layer
  const intelligenceResult = calculateWellnessIntelligence(drinks, userData?.wellness_profile, aiSummary, language);

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-[#FDFCFB] relative overflow-hidden selection:bg-[#C6A49A]/20">
        {/* Emotional Ambient Glows */}
        <div className="glow-warm top-[-5%] left-[-5%]" />
        <div className="glow-sage top-[40%] right-[-5%]" />

        {/* Top Header & Desktop Navigation */}
        <header className="sticky top-0 z-40 bg-[#FDFCFB]/85 backdrop-blur-md border-b border-[#E8DFD8]/80 px-6 py-4 md:px-12 flex items-center justify-between shadow-xs transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] shadow-sm group hover:scale-105 transition-transform duration-300">
              <Coffee className="h-6 w-6 text-[#3D2B1F]" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#3D2B1F]">CaffAware</span>
          </div>

          {/* Desktop Tab Bar */}
          <nav className="hidden md:flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E8DFD8] shadow-xs">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-300 ${
                activeTab === "home" ? "bg-white text-[#3D2B1F] shadow-sm scale-[1.02]" : "text-[#8D7B68] hover:text-[#3D2B1F]"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>{t.dashboard.tabHome}</span>
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-300 ${
                activeTab === "insights" ? "bg-white text-[#3D2B1F] shadow-sm scale-[1.02]" : "text-[#8D7B68] hover:text-[#3D2B1F]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.dashboard.tabInsights}</span>
            </button>
            <button
              onClick={() => setActiveTab("journey")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-300 ${
                activeTab === "journey" ? "bg-white text-[#3D2B1F] shadow-sm scale-[1.02]" : "text-[#8D7B68] hover:text-[#3D2B1F]"
              }`}
            >
              <HistoryIcon className="h-4 w-4" />
              <span>{t.dashboard.tabJourney}</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-300 ${
                activeTab === "profile" ? "bg-white text-[#3D2B1F] shadow-sm scale-[1.02]" : "text-[#8D7B68] hover:text-[#3D2B1F]"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>{t.dashboard.tabProfile}</span>
            </button>
          </nav>

          {/* Desktop Sign Out Button */}
          <div className="hidden md:block">
            <Button 
              variant="ghost" 
              onClick={logout}
              className="text-[#C6A49A] hover:text-[#3D2B1F] hover:bg-[#FAF8F5] rounded-2xl flex items-center gap-2 text-sm font-extrabold transition-all duration-300 px-5 py-2.5 border border-transparent hover:border-[#E8DFD8]"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.dashboard.logoutBtn}</span>
            </Button>
          </div>
          
          {/* Mobile Profile Indicator */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setActiveTab("profile")}
              className="flex h-10 w-10 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#3D2B1F] font-black text-sm shadow-sm border border-[#E8DFD8]"
            >
              {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
            </button>
          </div>
        </header>

        {/* Calm Error Banner */}
        {error && (
          <div className="mx-auto w-full max-w-7xl px-6 pt-6 md:px-12 relative z-20">
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 rounded-3xl shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-3.5">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="text-xs sm:text-sm font-extrabold">{error}</span>
              </div>
              <button 
                onClick={() => { setError(null); fetchDrinks(); }} 
                className="bg-white hover:bg-amber-100 text-amber-900 font-extrabold text-xs px-4 py-2 rounded-xl border border-amber-200 transition-colors duration-200 shadow-sm"
              >
                {t.common.retry}
              </button>
            </div>
          </div>
        )}

        {/* Main Dashboard Surfaces / Skeleton Loading */}
        {loadingDrinks ? (
          <div className="flex-1 mx-auto w-full max-w-7xl px-6 py-16 md:px-12 flex flex-col items-center justify-center space-y-6 min-h-[60vh] animate-in fade-in duration-300 relative z-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#F5EFE6] text-[#8D7B68] animate-spin shadow-md">
              <Coffee className="h-10 w-10 text-[#3D2B1F]" />
            </div>
            <div className="space-y-2 text-center max-w-sm">
              <h3 className="font-black text-2xl text-[#3D2B1F] tracking-tight">{t.dashboard.calibratingState}</h3>
              <p className="text-xs sm:text-sm text-[#8D7B68] font-medium">{t.dashboard.calibratingSub}</p>
            </div>
          </div>
        ) : (
          <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8 md:px-12 pb-28 md:pb-16 relative z-10">
            {/* 1. HOME TAB */}
            {activeTab === "home" && (
              <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300">
                <section className="space-y-8">
                  <DashboardHero 
                    user={user} 
                    wellnessProfile={userData?.wellness_profile} 
                  />
                  <DailyIntakeCard 
                    currentIntake={currentIntake} 
                    dailyLimit={userData?.wellness_profile?.daily_limit_mg || 250} 
                    activeCaffeineMg={intelligenceResult.activeCaffeineMg}
                  />
                </section>

                {/* Adaptive AI Daily Summary Preview */}
                <section>
                  <AdaptiveAILayer adaptiveAI={intelligenceResult.adaptiveAI} compact={true} />
                </section>

                <section>
                  <QuickAddSection 
                    onAddDrink={handleAddDrink} 
                    loading={actionLoading || loadingDrinks} 
                  />
                </section>

                {/* Small Wellness Insight Preview */}
                {intelligenceResult.insights.length > 0 && (
                  <section className="pt-2 border-t border-[#F3EEEA]/80 pt-10">
                    <div className="flex items-center gap-3 pb-6 mb-2">
                      <Sparkles className="h-6 w-6 text-[#C6A49A]" />
                      <h3 className="font-black text-2xl text-[#3D2B1F] tracking-tight">{t.dashboard.guidanceTitle}</h3>
                    </div>
                    <PersonalizedInsights 
                      insights={intelligenceResult.insights.slice(0, 2)} 
                    />
                  </section>
                )}
              </div>
            )}

            {/* 2. INSIGHTS TAB */}
            {activeTab === "insights" && (
              <div className="animate-in fade-in duration-300">
                <div className="border-b border-[#F3EEEA]/80 pb-8 hidden md:block mb-8">
                  <h3 className="font-black text-3xl text-[#3D2B1F] tracking-tight">{t.dashboard.insightsHeroTitle}</h3>
                  <p className="text-xs sm:text-base text-[#8D7B68] mt-1.5 font-medium">{t.dashboard.insightsHeroSub}</p>
                </div>

                {/* DESKTOP / TABLET VIEW (Rich Multi-Card Analytics) */}
                <div className="hidden md:space-y-16 md:block">
                  <section>
                    <TrendVisualization 
                      weeklyTrends={intelligenceResult.weeklyTrends}
                      metricsSummary={intelligenceResult.metricsSummary}
                      dailyLimit={userData?.wellness_profile?.daily_limit_mg || 250}
                    />
                  </section>

                  <section className="space-y-8 pt-4">
                    <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-5">
                      <Activity className="h-6 w-6 text-[#76A8A1]" />
                      <h3 className="font-black text-2xl text-[#3D2B1F] tracking-tight">{t.dashboard.metricsTitle}</h3>
                    </div>
                    <WellnessCards 
                      wellnessProfile={userData?.wellness_profile} 
                      currentIntake={currentIntake} 
                      intelligenceResult={intelligenceResult}
                    />
                  </section>

                  <section className="pt-4 border-t border-[#F3EEEA]/80">
                    <AdaptiveAILayer adaptiveAI={intelligenceResult.adaptiveAI} />
                  </section>

                  <section className="pt-4 border-t border-[#F3EEEA]/80 pt-8">
                    <div className="flex items-center gap-3 pb-6 mb-2">
                      <Sparkles className="h-6 w-6 text-[#C6A49A]" />
                      <h3 className="font-black text-2xl text-[#3D2B1F] tracking-tight">{t.dashboard.guidanceTitle}</h3>
                    </div>
                    <PersonalizedInsights 
                      insights={intelligenceResult.insights} 
                    />
                  </section>
                </div>

                {/* MOBILE VIEW (Calm Adaptive Reflection Experience) */}
                <div className="block md:hidden">
                  <MobileInsightsView 
                    intelligenceResult={intelligenceResult}
                    wellnessProfile={userData?.wellness_profile}
                    currentIntake={currentIntake}
                  />
                </div>
               </div>
            )}

            {/* 3. JOURNEY TAB */}
            {activeTab === "journey" && (
              <div className="animate-in fade-in duration-300">
                <JourneyView 
                  drinks={drinks} 
                  onDeleteDrink={handleDeleteDrink} 
                  loading={actionLoading || loadingDrinks} 
                  intelligenceResult={intelligenceResult}
                  wellnessProfile={userData?.wellness_profile}
                />
              </div>
            )}

            {/* 4. PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in duration-300">
                <UserProfile 
                  user={user} 
                  wellnessProfile={userData?.wellness_profile} 
                  onLogout={logout} 
                />
              </div>
            )}
          </main>
        )}

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#E8DFD8] px-4 py-2.5 flex items-center justify-around shadow-[0_-10px_30px_rgba(61,43,31,0.08)] md:hidden animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === "home" ? "text-[#3D2B1F] bg-[#FAF8F5] border border-[#E8DFD8] font-black scale-105 shadow-xs" : "text-[#C6A49A] hover:text-[#8D7B68] font-bold"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[11px] tracking-tight">{t.dashboard.tabHome}</span>
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === "insights" ? "text-[#3D2B1F] bg-[#FAF8F5] border border-[#E8DFD8] font-black scale-105 shadow-xs" : "text-[#C6A49A] hover:text-[#8D7B68] font-bold"
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-[11px] tracking-tight">{t.dashboard.tabInsights}</span>
          </button>
          <button
            onClick={() => setActiveTab("journey")}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === "journey" ? "text-[#3D2B1F] bg-[#FAF8F5] border border-[#E8DFD8] font-black scale-105 shadow-xs" : "text-[#C6A49A] hover:text-[#8D7B68] font-bold"
            }`}
          >
            <HistoryIcon className="h-5 w-5" />
            <span className="text-[11px] tracking-tight">{t.dashboard.tabJourney}</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
              activeTab === "profile" ? "text-[#3D2B1F] bg-[#FAF8F5] border border-[#E8DFD8] font-black scale-105 shadow-xs" : "text-[#C6A49A] hover:text-[#8D7B68] font-bold"
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span className="text-[11px] tracking-tight">{t.dashboard.tabProfile}</span>
          </button>
        </nav>

        {/* Footer */}
        <footer className="px-6 py-10 border-t border-[#F3EEEA]/80 text-[#C6A49A] text-xs text-center mt-auto hidden md:block relative z-10">
          <p className="font-extrabold tracking-wider uppercase">{t.dashboard.footerText}</p>
        </footer>
      </div>
    </AuthGuard>
  );
}
