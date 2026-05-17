"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Coffee, Moon, User, Activity, CheckCircle2, ChevronRight, ChevronLeft, Sparkle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { PremiumTimeSelector } from "@/components/dashboard/PremiumTimeSelector";
import { useLanguage } from "@/context/LanguageContext";

type Step = "welcome" | "basics" | "sleep" | "sensitivity" | "calculating" | "success";

export default function OnboardingPage() {
  const { user, setIsOnboarded, refreshUserData } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>("welcome");
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    age: 25,
    weight: 70,
    sleep_time: "23:00",
    sensitivity: "medium" as "low" | "medium" | "high",
    lifestyle: "",
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (step === "welcome") setStep("basics");
    else if (step === "basics") {
      if (!formData.age || !formData.weight || isNaN(formData.age) || isNaN(formData.weight)) {
        alert("Please enter a valid age and weight to continue.");
        return;
      }
      setStep("sleep");
    }
    else if (step === "sleep") setStep("sensitivity");
    else if (step === "sensitivity") handleSubmit();
  };

  const handleBack = () => {
    if (step === "basics") setStep("welcome");
    else if (step === "sleep") setStep("basics");
    else if (step === "sensitivity") setStep("sleep");
  };

  const handleSubmit = async () => {
    setStep("calculating");
    setLoading(true);
    
    // Simulate calculation time for emotional effect
    await new Promise(r => setTimeout(r, 2000));

    try {
      await apiFetch("/api/users/onboarding", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      
      await refreshUserData();
      setStep("success");
      setIsOnboarded(true);
      
      // Short delay before redirecting to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Onboarding failed:", error);
      setStep("sensitivity"); // Go back to try again
    } finally {
      setLoading(false);
    }
  };

  const getSensitivityLabel = (s: "low" | "medium" | "high") => {
    if (s === "low") return t.onboarding.sensLow;
    if (s === "medium") return t.onboarding.sensMed;
    return t.onboarding.sensHigh;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCFB] p-6 text-[#3D2B1F] relative overflow-hidden selection:bg-[#C6A49A]/20">
      {/* Emotional Ambient Lighting Glows */}
      <div className="glow-warm top-[-10%] left-[-5%]" />
      <div className="glow-sage bottom-[-10%] right-[-5%]" />

      <div className="w-full max-w-xl relative z-10 animate-in fade-in duration-500">
        
        {/* Progress Indicator */}
        {step !== "welcome" && step !== "success" && step !== "calculating" && (
          <div className="mb-12 flex justify-center gap-3 animate-in fade-in duration-300">
            {(["basics", "sleep", "sensitivity"] as Step[]).map((s) => (
              <div 
                key={s} 
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  step === s ? "bg-[#3D2B1F] w-16 shadow-sm" : "bg-[#F3EEEA] w-8"
                }`} 
              />
            ))}
          </div>
        )}

        <div className="rounded-[2.5rem] surface-elevated p-8 sm:p-14 shadow-[0_20px_60px_rgba(61,43,31,0.08)] border border-[#E8DFD8]">
          
          {/* Welcome Step */}
          {step === "welcome" && (
            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-700">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#F5EFE6] text-[#8D7B68] shadow-sm group hover:scale-105 transition-transform duration-300">
                <Coffee className="h-10 w-10 text-[#3D2B1F]" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#3D2B1F]">
                  {t.onboarding.welcomeTitle}{user?.displayName?.split(" ")[0] || ""}
                </h1>
                <p className="text-[#8D7B68] text-base sm:text-lg font-medium leading-relaxed">
                  {t.onboarding.welcomeDesc}
                </p>
              </div>
              <Button 
                onClick={handleNext}
                className="interactive-btn-primary w-full h-16 rounded-2xl text-lg font-extrabold flex items-center justify-center gap-3 shadow-xl"
              >
                <span>{t.onboarding.startBtn}</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Basics Step */}
          {step === "basics" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="space-y-2 pb-2 border-b border-[#F3EEEA]/80">
                <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-[#3D2B1F]">
                  <User className="h-7 w-7 text-[#C6A49A]" />
                  <span>{t.onboarding.basicsTitle}</span>
                </h2>
                <p className="text-[#8D7B68] text-sm sm:text-base font-medium">{t.onboarding.basicsDesc}</p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 pt-2">
                <div className="space-y-2.5">
                  <label className="text-xs sm:text-sm font-bold text-[#8D7B68] uppercase tracking-wider block">{t.onboarding.ageLabel}</label>
                  <input 
                    type="number" 
                    value={isNaN(formData.age) ? "" : formData.age}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFormData({ age: val === "" ? NaN : parseInt(val) });
                    }}
                    className="w-full h-14 px-5 rounded-2xl border border-[#E8DFD8] bg-[#FDFCFB] text-lg font-bold text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C6A49A]/30 focus:border-[#C6A49A] transition-all duration-200 shadow-sm"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-xs sm:text-sm font-bold text-[#8D7B68] uppercase tracking-wider block">{t.onboarding.weightLabel}</label>
                  <input 
                    type="number" 
                    value={isNaN(formData.weight) ? "" : formData.weight}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateFormData({ weight: val === "" ? NaN : parseFloat(val) });
                    }}
                    className="w-full h-14 px-5 rounded-2xl border border-[#E8DFD8] bg-[#FDFCFB] text-lg font-bold text-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C6A49A]/30 focus:border-[#C6A49A] transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-[#F3EEEA]/80">
                <Button variant="ghost" onClick={handleBack} className="interactive-btn-secondary h-15 w-15 rounded-2xl">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button onClick={handleNext} className="interactive-btn-primary h-15 flex-1 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg">
                  <span>{t.common.continue}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Sleep Step */}
          {step === "sleep" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="space-y-2 pb-2 border-b border-[#F3EEEA]/80">
                <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-[#3D2B1F]">
                  <Moon className="h-7 w-7 text-[#8D7B68]" />
                  <span>{t.onboarding.restTitle}</span>
                </h2>
                <p className="text-[#8D7B68] text-sm sm:text-base font-medium">{t.onboarding.restDesc}</p>
              </div>
              
              <div className="space-y-6 pt-2">
                <PremiumTimeSelector 
                  value={formData.sleep_time}
                  onChange={(time) => updateFormData({ sleep_time: time })}
                />
                <p className="text-center text-xs sm:text-sm font-extrabold text-[#C6A49A] tracking-wider uppercase">
                  {t.onboarding.restNote}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-[#F3EEEA]/80">
                <Button variant="ghost" onClick={handleBack} className="interactive-btn-secondary h-15 w-15 rounded-2xl">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button onClick={handleNext} className="interactive-btn-primary h-15 flex-1 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg">
                  <span>{t.common.continue}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Sensitivity Step */}
          {step === "sensitivity" && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="space-y-2 pb-2 border-b border-[#F3EEEA]/80">
                <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 text-[#3D2B1F]">
                  <Activity className="h-7 w-7 text-[#76A8A1]" />
                  <span>{t.onboarding.sensTitle}</span>
                </h2>
                <p className="text-[#8D7B68] text-sm sm:text-base font-medium">{t.onboarding.sensDesc}</p>
              </div>
              
              <div className="grid gap-4 pt-2">
                {(["low", "medium", "high"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFormData({ sensitivity: s })}
                    className={`flex items-center justify-between p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                      formData.sensitivity === s 
                        ? "border-[#3D2B1F] bg-[#FAF8F5] shadow-md scale-[1.02]" 
                        : "border-[#E8DFD8] hover:border-[#C6A49A] bg-white hover:bg-[#FAF8F5]/60"
                    }`}
                  >
                    <span className="capitalize font-extrabold text-base sm:text-lg text-[#3D2B1F]">{getSensitivityLabel(s)}</span>
                    {formData.sensitivity === s && <CheckCircle2 className="h-6 w-6 text-[#3D2B1F]" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-6 border-t border-[#F3EEEA]/80">
                <Button variant="ghost" onClick={handleBack} className="interactive-btn-secondary h-15 w-15 rounded-2xl">
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button onClick={handleNext} className="interactive-btn-primary h-15 flex-1 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg">
                  <span>{t.onboarding.personalizeBtn}</span>
                  <Sparkle className="h-5 w-5 text-[#C6A49A]" />
                </Button>
              </div>
            </div>
          )}

          {/* Calculating Step */}
          {step === "calculating" && (
            <div className="py-16 space-y-8 text-center animate-in fade-in duration-1000">
              <div className="relative mx-auto h-28 w-28">
                <div className="absolute inset-0 rounded-full border-4 border-[#F3EEEA]" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#3D2B1F] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkle className="h-10 w-10 text-[#C6A49A] animate-pulse" />
                </div>
              </div>
              <div className="space-y-3 max-w-sm mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-[#3D2B1F]">{t.onboarding.calibratingTitle}</h2>
                <p className="text-[#8D7B68] text-sm sm:text-base font-medium leading-relaxed">{t.onboarding.calibratingDesc}</p>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="py-12 space-y-8 text-center animate-in zoom-in duration-700">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F3F1] text-[#76A8A1] shadow-md animate-bounce">
                <CheckCircle2 className="h-14 w-14" />
              </div>
              <div className="space-y-3 max-w-sm mx-auto">
                <h1 className="text-3xl sm:text-4xl font-black text-[#3D2B1F]">{t.onboarding.successTitle}</h1>
                <p className="text-[#8D7B68] text-base sm:text-lg font-medium leading-relaxed">
                  {t.onboarding.successDesc}
                </p>
              </div>
            </div>
          )}

        </div>
        
        <p className="mt-8 text-center text-xs text-[#C6A49A] font-bold tracking-[0.2em] uppercase">
          {t.onboarding.footerText}
        </p>
      </div>
    </div>
  );
}
