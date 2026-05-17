import React from "react";
import { Moon, Droplets, HeartPulse, Sparkles, Check, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface WellnessCardsProps {
  wellnessProfile: any;
  currentIntake: number;
  intelligenceResult?: any;
}

export const WellnessCards: React.FC<WellnessCardsProps> = ({ 
  wellnessProfile, 
  currentIntake,
  intelligenceResult 
}) => {
  const { t, language } = useLanguage();
  const cutoff = wellnessProfile?.recommended_cutoff || "14:00";
  const limit = wellnessProfile?.daily_limit_mg || 250;
  
  // Fallback calculations if intelligenceResult is missing
  let score = intelligenceResult?.wellnessScore ?? 100;
  if (!intelligenceResult) {
    if (currentIntake > limit) {
      const over = currentIntake - limit;
      score = Math.max(40, 100 - Math.round(over * 0.4));
    }
  }

  const sleepImpactLevel = intelligenceResult?.sleepImpact?.level || (language === "id" ? "Optimal" : "Optimal");
  const sleepImpactColor = intelligenceResult?.sleepImpact?.color || "text-[#76A8A1]";
  const sleepImpactDesc = intelligenceResult?.sleepImpact?.description || (language === "id" ? "Tingkat kafein aktif Anda rendah dan tidak akan mengganggu arsitektur tidur alami." : "Your active caffeine level is low and should not interfere with natural sleep architecture.");
  const clearanceTime = intelligenceResult?.sleepImpact?.estimatedClearanceTime || "N/A";

  const reasons = intelligenceResult?.scoreBreakdown?.reasons || [];
  const bedtime = intelligenceResult?.bedtimeReadiness;
  const timeline = intelligenceResult?.activeCaffeineTimeline;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 4 Main Wellness Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 items-stretch">
        {/* Sleep Cutoff */}
        <div className="surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-6 group">
          <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] group-hover:bg-[#3D2B1F] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
              <Moon className="h-6 w-6" />
            </div>
            <h3 className="font-black text-base sm:text-lg text-[#3D2B1F] line-clamp-1">{t.cards.sleepCutoffTitle}</h3>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3D2B1F] tracking-tight">{cutoff}</p>
            <p className="mt-2 text-xs sm:text-sm text-[#8D7B68] leading-relaxed font-semibold">
              {t.cards.sleepCutoffDesc}
            </p>
          </div>
        </div>

        {/* Hydration Reminder */}
        <div className="surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-6 group">
          <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#E8F3F1] text-[#76A8A1] group-hover:bg-[#76A8A1] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
              <Droplets className="h-6 w-6" />
            </div>
            <h3 className="font-black text-base sm:text-lg text-[#3D2B1F] line-clamp-1">{language === "id" ? "Keseimbangan Hidrasi" : "Hydration Balance"}</h3>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3D2B1F] tracking-tight">{language === "id" ? "Rasio Air 1:1" : "1:1 Water Ratio"}</p>
            <p className="mt-2 text-xs sm:text-sm text-[#8D7B68] leading-relaxed font-semibold">
              {language === "id" ? "Minum satu gelas air untuk setiap minuman berkafein guna menjaga hidrasi seluler." : "Drink one glass of water for every caffeinated beverage to maintain cellular hydration."}
            </p>
          </div>
        </div>

        {/* Wellness Score */}
        <div className="surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-6 group">
          <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#FAF8F5] text-[#C6A49A] group-hover:bg-[#C6A49A] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0 border border-[#E8DFD8]">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="font-black text-base sm:text-lg text-[#3D2B1F] line-clamp-1">{language === "id" ? "Skor Kesejahteraan" : "Wellness Score"}</h3>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3D2B1F] tracking-tight">{score}</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#8D7B68]">/100</span>
            </div>

            {/* Explainable Reasons */}
            <div>
              {reasons.length > 0 ? (
                <div className="mt-3 space-y-1.5 pt-3 border-t border-[#F3EEEA]/80">
                  {reasons.map((reason: string, idx: number) => (
                    <p key={idx} className="text-xs text-[#8D7B68] flex items-start gap-1.5 font-bold leading-relaxed">
                      <Check className="h-4 w-4 text-[#C6A49A] shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs sm:text-sm text-[#8D7B68] leading-relaxed font-semibold">
                  {language === "id" ? "Berdasarkan batas harian personal dan kedisiplinan waktu asupan Anda." : "Based on your personalized daily limit and intake timing discipline."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sleep Impact Preview */}
        <div className="surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-6 group">
          <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#FAF8F5] text-[#3D2B1F] group-hover:bg-[#3D2B1F] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0 border border-[#E8DFD8]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-black text-base sm:text-lg text-[#3D2B1F] line-clamp-1">{language === "id" ? "Dampak Tidur" : "Sleep Impact"}</h3>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <p className={`text-2xl sm:text-3xl font-black tracking-tight ${sleepImpactColor}`}>
                {sleepImpactLevel} {language === "id" ? "Dampak" : "Impact"}
              </p>
              <span className="text-[10px] sm:text-xs font-black text-[#C6A49A] bg-[#FAF8F5] border border-[#E8DFD8] px-3 py-1 rounded-xl shadow-sm">
                {language === "id" ? "Bersih" : "Clear"}: {clearanceTime}
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#8D7B68] leading-relaxed font-semibold">
              {sleepImpactDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Bedtime Readiness & Active Caffeine Timeline Section */}
      <div className="grid gap-5 sm:gap-8 lg:grid-cols-3 items-stretch pt-2">
        {/* Bedtime Readiness Card */}
        <div className="lg:col-span-1 surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${bedtime?.bgColor || "bg-[#E8F3F1]"} ${bedtime?.color || "text-[#76A8A1]"} shadow-sm shrink-0 border border-[#76A8A1]/20`}>
              <Moon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#3D2B1F]">{language === "id" ? "Kesiapan Tidur" : "Bedtime Readiness"}</h3>
              <p className="text-xs text-[#8D7B68] font-bold uppercase tracking-wider mt-0.5">{language === "id" ? "Stimulasi sistem saraf" : "Nervous system stimulation"}</p>
            </div>
          </div>

          <div>
            <p className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${bedtime?.color || "text-[#76A8A1]"}`}>
              {bedtime?.status || (language === "id" ? "Siap untuk Tidur" : "Ready for Sleep")}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-[#8D7B68] leading-relaxed font-semibold">
              {bedtime?.description || (language === "id" ? "Kafein aktif Anda telah melewati ambang batas aman. Sistem saraf Anda dalam kondisi optimal untuk pelepasan melatonin alami." : "Your active caffeine has cleared the sleep threshold. Your nervous system is in an optimal state for natural melatonin release.")}
            </p>
          </div>
        </div>

        {/* Active Caffeine Timeline Card */}
        <div className="lg:col-span-2 surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-[#F3EEEA]/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#FAF8F5] text-[#3D2B1F] shadow-sm shrink-0 border border-[#E8DFD8]">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-[#3D2B1F]">{language === "id" ? "Linimasa Kafein Aktif" : "Active Caffeine Timeline"}</h3>
                <p className="text-xs text-[#8D7B68] font-bold uppercase tracking-wider mt-0.5">{language === "id" ? "Estimasi kurva peluruhan paruh waktu 5.5 jam" : "Estimated 5.5h half-life decay curve"}</p>
              </div>
            </div>
            <span className="text-xs font-black text-[#8D7B68] bg-[#FAF8F5] border border-[#E8DFD8] px-4 py-2 rounded-xl shadow-sm hidden sm:inline uppercase tracking-wider">
              {language === "id" ? "Pencapaian Hari Ini" : "Today's Milestones"}
            </span>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-5 py-1 items-stretch">
            {(timeline || [
              { timeLabel: "08:00", estimatedMg: 180, status: "High" },
              { timeLabel: "13:00", estimatedMg: 90, status: "Moderate" },
              { timeLabel: "18:00", estimatedMg: 45, status: "Mild" },
              { timeLabel: "23:00", estimatedMg: 20, status: "Optimal" }
            ]).map((pt: any, idx: number) => (
              <div key={idx} className="bg-[#FAF8F5] p-3 sm:p-5 rounded-2xl border border-[#E8DFD8] space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left shadow-sm justify-between hover:shadow-md transition-shadow duration-200">
                <span className="text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{pt.timeLabel}</span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-lg sm:text-3xl lg:text-4xl font-black text-[#3D2B1F] tracking-tight">{pt.estimatedMg}</span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-[#8D7B68]">mg</span>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl capitalize shadow-sm border ${
                  pt.status === "High" ? "bg-red-50 text-red-600 border-red-200" :
                  pt.status === "Moderate" ? "bg-orange-50 text-orange-600 border-orange-200" :
                  pt.status === "Mild" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-[#E8F3F1] text-[#76A8A1] border-[#76A8A1]/30"
                }`}>
                  {pt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
