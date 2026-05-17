import React, { useState } from "react";
import { Moon, Sparkles, Droplets, HeartPulse, Clock, Activity, Award, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Info, Flame } from "lucide-react";
import { TrendVisualization } from "./TrendVisualization";
import { PersonalizedInsights } from "./PersonalizedInsights";
import { useLanguage } from "@/context/LanguageContext";

interface MobileInsightsViewProps {
  intelligenceResult: any;
  wellnessProfile?: any;
  currentIntake: number;
}

export const MobileInsightsView: React.FC<MobileInsightsViewProps> = ({
  intelligenceResult,
  wellnessProfile,
  currentIntake,
}) => {
  const { t, language } = useLanguage();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [expandedPattern, setExpandedPattern] = useState<number | null>(null);
  const [expandedRecs, setExpandedRecs] = useState(false);

  const cutoff = wellnessProfile?.recommended_cutoff || "14:00";
  const limit = wellnessProfile?.daily_limit_mg || 250;
  const score = intelligenceResult?.wellnessScore ?? 100;

  const bedtime = intelligenceResult?.bedtimeReadiness;
  const dailySummary = intelligenceResult?.adaptiveAI?.dailySummary;
  const timeline = intelligenceResult?.activeCaffeineTimeline;
  const behavioralPatterns = intelligenceResult?.adaptiveAI?.behavioralPatterns || [];
  const smartRecommendations = intelligenceResult?.adaptiveAI?.smartRecommendations || [];
  const consistencyStreaks = intelligenceResult?.adaptiveAI?.consistencyStreaks || [];
  const insights = intelligenceResult?.insights || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* SECTION 1: HERO INSIGHT */}
      <div className={`rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border ${
        bedtime?.status === "High Stimulation" ? "bg-red-50/90 border-red-200" :
        bedtime?.status === "Moderate Stimulation" ? "bg-orange-50/90 border-orange-200" :
        bedtime?.status === "Mild Stimulation" ? "bg-amber-50/90 border-amber-200" : "bg-gradient-to-br from-[#E8F3F1] to-[#D8EBE7] border-[#76A8A1]/30"
      } flex flex-col justify-between space-y-5 relative overflow-hidden`}>
        <div className="flex items-center gap-4 border-b border-black/5 pb-4 relative z-10">
          <div className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] shadow-md shrink-0 ${
            bedtime?.status === "High Stimulation" ? "bg-red-600 text-white" :
            bedtime?.status === "Moderate Stimulation" ? "bg-orange-600 text-white" :
            bedtime?.status === "Mild Stimulation" ? "bg-amber-600 text-white" : "bg-[#76A8A1] text-white"
          }`}>
            <Moon className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-black/60">{language === "id" ? "Status Kesejahteraan Utama" : "Primary Wellness State"}</span>
            <h3 className={`font-black text-2xl tracking-tight mt-0.5 ${
              bedtime?.status === "High Stimulation" ? "text-red-900" :
              bedtime?.status === "Moderate Stimulation" ? "text-orange-900" :
              bedtime?.status === "Mild Stimulation" ? "text-amber-900" : "text-[#2D4A45]"
            }`}>
              {bedtime?.status || (language === "id" ? "Siap untuk Tidur" : "Ready for Sleep")}
            </h3>
          </div>
        </div>
        <p className={`text-sm sm:text-base leading-relaxed font-bold relative z-10 ${
          bedtime?.status === "High Stimulation" ? "text-red-950" :
          bedtime?.status === "Moderate Stimulation" ? "text-orange-950" :
          bedtime?.status === "Mild Stimulation" ? "text-amber-950" : "text-[#2D4A45]"
        }`}>
          {bedtime?.description || (language === "id" ? "Kafein aktif Anda telah melewati ambang batas aman. Sistem saraf Anda dalam kondisi optimal untuk pelepasan melatonin alami." : "Your active caffeine has cleared the sleep threshold. Your nervous system is in an optimal state for natural melatonin release.")}
        </p>
      </div>

      {/* SECTION 2: AI DAILY SUMMARY */}
      {dailySummary && (
        <div className="rounded-[2.5rem] surface-hero p-8 shadow-[0_20px_60px_rgba(61,43,31,0.06)] border border-[#E8DFD8] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C6A49A]/15 rounded-full blur-[60px] pointer-events-none" />

          <div className="flex items-center gap-4 border-b border-[#E8DFD8]/80 pb-4 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#3D2B1F] text-white shadow-sm shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-xl text-[#3D2B1F] tracking-tight">{language === "id" ? "Refleksi Harian AI" : "AI Daily Reflection"}</h3>
              <p className="text-xs text-[#8D7B68] font-bold uppercase tracking-wider">{language === "id" ? "Sintesis perilaku adaptif" : "Adaptive behavioral synthesis"}</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h4 className="font-black text-lg sm:text-xl text-[#3D2B1F] tracking-tight leading-snug">{dailySummary.headline}</h4>
            <div className="space-y-2.5 pl-3 border-l-3 border-[#C6A49A]">
              {dailySummary.observations.map((obs: string, idx: number) => (
                <p key={idx} className="text-xs sm:text-sm text-[#8D7B68] leading-relaxed font-semibold flex items-start gap-2">
                  <span className="text-[#C6A49A] font-black mt-0.5">•</span>
                  <span>{obs}</span>
                </p>
              ))}
            </div>
            <div className="pt-4 border-t border-[#E8DFD8]/80 mt-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#E8DFD8] shadow-sm">
              <p className="text-xs sm:text-sm text-[#3D2B1F] italic font-bold leading-relaxed">
                "{dailySummary.reflectionPrompt}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: QUICK WELLNESS METRICS */}
      <div className="grid grid-cols-3 gap-3 items-stretch">
        {/* Sleep Cutoff Chip */}
        <div className="surface-elevated p-5 rounded-3xl interactive-card flex flex-col items-center justify-center text-center space-y-1.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EFE6] text-[#8D7B68] mb-1 shadow-xs">
            <Moon className="h-5 w-5" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-[#3D2B1F] tracking-tight">{cutoff}</span>
          <span className="text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Batas" : "Cutoff"}</span>
        </div>

        {/* Hydration Chip */}
        <div className="surface-elevated p-5 rounded-3xl interactive-card flex flex-col items-center justify-center text-center space-y-1.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3F1] text-[#76A8A1] mb-1 shadow-xs">
            <Droplets className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-xl font-black text-[#3D2B1F] tracking-tight">{language === "id" ? "Rasio 1:1" : "1:1 Ratio"}</span>
          <span className="text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Hidrasi" : "Hydration"}</span>
        </div>

        {/* Wellness Score Chip */}
        <div className="surface-elevated p-5 rounded-3xl interactive-card flex flex-col items-center justify-center text-center space-y-1.5 border border-[#C6A49A]/30 bg-[#FAF8F5]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EFE6] text-[#C6A49A] mb-1 shadow-xs border border-[#E8DFD8]">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#3D2B1F] tracking-tight">{score}</span>
            <span className="text-[10px] font-extrabold text-[#8D7B68]">/100</span>
          </div>
          <span className="text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Skor" : "Score"}</span>
        </div>
      </div>

      {/* SECTION 4: PROGRESSIVE DISCLOSURE */}
      <div className="pt-6 border-t border-[#F3EEEA]/80">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between p-5 rounded-3xl bg-[#FAF8F5] border border-[#C6A49A]/40 hover:bg-[#F5EFE6] text-[#3D2B1F] font-black text-base sm:text-lg transition-all duration-300 active:scale-98 shadow-sm group"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#3D2B1F] text-[#C6A49A] shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <span>{language === "id" ? "Analisis Kesejahteraan Lanjutan" : "Advanced Wellness Analysis"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#8D7B68] font-extrabold uppercase tracking-wider">
            <span>{isAdvancedOpen ? (language === "id" ? "Tutup" : "Hide") : (language === "id" ? "Eksplor" : "Explore")}</span>
            {isAdvancedOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>

        {/* Collapsible / Expandable Advanced Insights */}
        {isAdvancedOpen && (
          <div className="mt-8 space-y-10 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* A. Active Caffeine Timeline */}
            <div className="space-y-4 surface-elevated p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
                <Clock className="h-6 w-6 text-[#3D2B1F]" />
                <h4 className="font-black text-lg sm:text-xl text-[#3D2B1F]">{language === "id" ? "Linimasa Kafein Aktif" : "Active Caffeine Timeline"}</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#8D7B68] font-bold uppercase tracking-wider">{language === "id" ? "Estimasi peluruhan paruh waktu 5.5 jam" : "Estimated 5.5h half-life decay milestones"}</p>
              <div className="grid grid-cols-4 gap-3 pt-2">
                {(timeline || [
                  { timeLabel: "08:00", estimatedMg: 180, status: "High" },
                  { timeLabel: "13:00", estimatedMg: 90, status: "Moderate" },
                  { timeLabel: "18:00", estimatedMg: 45, status: "Mild" },
                  { timeLabel: "23:00", estimatedMg: 20, status: "Optimal" }
                ]).map((pt: any, idx: number) => (
                  <div key={idx} className="bg-[#FAF8F5] p-3 sm:p-4 rounded-2xl border border-[#E8DFD8] space-y-1.5 flex flex-col items-center text-center shadow-xs justify-between hover:shadow-md transition-shadow duration-200">
                    <span className="text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{pt.timeLabel}</span>
                    <div className="flex items-baseline gap-1 my-1">
                      <span className="text-base sm:text-xl font-black text-[#3D2B1F] tracking-tight">{pt.estimatedMg}</span>
                      <span className="text-[10px] font-extrabold text-[#8D7B68]">mg</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg capitalize shadow-xs border ${
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

            {/* B. Weekly Trends & Intake Rhythms */}
            <div className="space-y-4 surface-elevated p-6 sm:p-8 rounded-3xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
                <Activity className="h-6 w-6 text-[#76A8A1]" />
                <h4 className="font-black text-lg sm:text-xl text-[#3D2B1F]">{language === "id" ? "Tren & Ritme Mingguan" : "Weekly Trends & Rhythms"}</h4>
              </div>
              <div className="-mx-2 pt-2">
                <TrendVisualization 
                  weeklyTrends={intelligenceResult.weeklyTrends}
                  metricsSummary={intelligenceResult.metricsSummary}
                  dailyLimit={limit}
                />
              </div>
            </div>

            {/* C. Behavioral Pattern Analysis */}
            <div className="space-y-4 surface-elevated p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
                <Clock className="h-6 w-6 text-[#C6A49A]" />
                <h4 className="font-black text-lg sm:text-xl text-[#3D2B1F]">{language === "id" ? "Analisis Pola Perilaku" : "Behavioral Pattern Analysis"}</h4>
              </div>
              <div className="space-y-3 pt-2">
                {behavioralPatterns.map((pattern: any, idx: number) => {
                  const isItemExpanded = expandedPattern === idx;
                  return (
                    <div key={idx} className="bg-[#FAF8F5] rounded-2xl border border-[#E8DFD8] overflow-hidden transition-all duration-300 shadow-sm">
                      <button
                        onClick={() => setExpandedPattern(isItemExpanded ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F5EFE6] transition-colors duration-300 gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full shrink-0 shadow-xs ${
                            pattern.status === "Action Needed" ? "bg-amber-600" :
                            pattern.status === "Active" ? "bg-orange-600" :
                            pattern.status === "Improving" ? "bg-[#76A8A1]" : "bg-[#8D7B68]"
                          }`} />
                          <span className="font-black text-sm sm:text-base text-[#3D2B1F] line-clamp-1">{pattern.patternName}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider shadow-xs ${
                            pattern.status === "Action Needed" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                            pattern.status === "Active" ? "bg-orange-50 text-orange-600 border border-orange-200" :
                            pattern.status === "Improving" ? "bg-[#E8F3F1] text-[#76A8A1] border border-[#76A8A1]/30" : "bg-[#F5EFE6] text-[#8D7B68]"
                          }`}>
                            {pattern.status}
                          </span>
                          {isItemExpanded ? <ChevronUp className="h-4 w-4 text-[#8D7B68]" /> : <ChevronDown className="h-4 w-4 text-[#8D7B68]" />}
                        </div>
                      </button>
                      {isItemExpanded && (
                         <div className="p-5 pt-0 text-xs sm:text-sm text-[#8D7B68] leading-relaxed border-t border-[#E8DFD8] bg-white font-semibold animate-in fade-in duration-300">
                          {pattern.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* D. Smart Recommendations */}
            <div className="space-y-4 surface-elevated p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
                <Sparkles className="h-6 w-6 text-[#76A8A1]" />
                <h4 className="font-black text-lg sm:text-xl text-[#3D2B1F]">{language === "id" ? "Rekomendasi Cerdas" : "Smart Recommendations"}</h4>
              </div>
              <div className="space-y-4 pt-2">
                {smartRecommendations.length > 0 && (
                  <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5EFE6] p-6 rounded-2xl border border-[#E8DFD8] flex items-start gap-4 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#3D2B1F] text-[#C6A49A] shadow-sm shrink-0 mt-0.5">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="font-black text-sm sm:text-base text-[#3D2B1F]">{smartRecommendations[0].title}</h5>
                      <p className="text-xs sm:text-sm text-[#8D7B68] leading-relaxed font-semibold">{smartRecommendations[0].suggestion}</p>
                    </div>
                  </div>
                )}

                {smartRecommendations.length > 1 && (
                  <div className="space-y-3 pt-2 border-t border-[#F3EEEA]/80">
                    <button
                      onClick={() => setExpandedRecs(!expandedRecs)}
                      className="w-full flex items-center justify-between py-2.5 text-xs sm:text-sm font-black text-[#C6A49A] hover:text-[#3D2B1F] transition-colors duration-300 uppercase tracking-wider"
                    >
                      <span>{expandedRecs ? (language === "id" ? "Sembunyikan saran sekunder" : "Hide secondary suggestions") : (language === "id" ? `Lihat ${smartRecommendations.length - 1} saran lainnya` : `View ${smartRecommendations.length - 1} more suggestions`)}</span>
                      {expandedRecs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {expandedRecs && (
                      <div className="space-y-3 pt-2 animate-in fade-in duration-300">
                        {smartRecommendations.slice(1).map((rec: any) => (
                          <div key={rec.id} className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8DFD8] flex items-start gap-4 shadow-xs hover:shadow-md transition-shadow duration-200">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EFE6] text-[#3D2B1F] shadow-xs shrink-0 mt-0.5 border border-[#E8DFD8]">
                              <Sparkles className="h-5 w-5 text-[#C6A49A]" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="font-black text-xs sm:text-sm text-[#3D2B1F]">{rec.title}</h5>
                              <p className="text-xs text-[#8D7B68] leading-relaxed font-semibold">{rec.suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* E. Gentle Consistency System (Streaks) */}
            <div className="space-y-4 surface-elevated p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
                <Award className="h-6 w-6 text-[#C6A49A]" />
                <h4 className="font-black text-lg sm:text-xl text-[#3D2B1F]">{language === "id" ? "Sistem Konsistensi Lembut" : "Gentle Consistency System"}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {consistencyStreaks.map((streak: any, idx: number) => (
                  <div key={idx} className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8DFD8] shadow-sm flex flex-col justify-between space-y-3 text-left hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-2 border-b border-[#F3EEEA]/80 pb-2.5">
                      <Flame className={`h-5 w-5 ${streak.isAchieved ? "text-[#76A8A1]" : "text-[#C6A49A]"}`} />
                      <h5 className="font-black text-xs sm:text-sm text-[#3D2B1F] line-clamp-1">{streak.streakName}</h5>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#3D2B1F] tracking-tight">{streak.count}</span>
                        <span className="text-xs font-extrabold text-[#8D7B68]">{streak.unit}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#8D7B68] font-semibold leading-snug">{streak.statusText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* F. Contextual Guidance */}
            {insights.length > 0 && (
              <div className="space-y-4 surface-elevated p-6 sm:p-8 rounded-3xl">
                <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
                  <Sparkles className="h-6 w-6 text-[#C6A49A]" />
                  <h4 className="font-black text-lg sm:text-xl text-[#3D2B1F]">{language === "id" ? "Panduan Kontekstual" : "Contextual Guidance"}</h4>
                </div>
                <div className="pt-2">
                  <PersonalizedInsights insights={insights} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
