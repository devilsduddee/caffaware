import React from "react";
import { Sparkles, Activity, Clock, Droplets, HeartPulse, Moon, CheckCircle2, AlertCircle, Info, Flame, Award, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FeedItem {
  id: string;
  category: "timing" | "intake" | "hydration" | "stimulation" | "streak";
  type: "positive" | "warning" | "info";
  text: string;
  timestampStr: string;
}

interface BehavioralPattern {
  patternName: string;
  status: "Active" | "Improving" | "Stable" | "Action Needed";
  description: string;
  color: string;
}

interface SmartRecommendation {
  id: string;
  title: string;
  suggestion: string;
  iconType: string;
}

interface DailySummary {
  headline: string;
  observations: string[];
  reflectionPrompt: string;
}

interface ConsistencyStreak {
  streakName: string;
  count: number;
  unit: string;
  statusText: string;
  isAchieved: boolean;
}

interface AdaptiveAILayerProps {
  adaptiveAI: {
    dynamicFeed: FeedItem[];
    behavioralPatterns: BehavioralPattern[];
    smartRecommendations: SmartRecommendation[];
    dailySummary: DailySummary;
    consistencyStreaks: ConsistencyStreak[];
  };
  compact?: boolean;
}

export const AdaptiveAILayer: React.FC<AdaptiveAILayerProps> = ({ adaptiveAI, compact = false }) => {
  const { t, language } = useLanguage();
  const { dynamicFeed, behavioralPatterns, smartRecommendations, dailySummary, consistencyStreaks } = adaptiveAI;

  const renderFeedIcon = (category: string, type: string) => {
    if (type === "positive") return <CheckCircle2 className="h-5 w-5 text-[#76A8A1]" />;
    if (type === "warning") return <AlertCircle className="h-5 w-5 text-amber-600" />;
    return <Info className="h-5 w-5 text-[#C6A49A]" />;
  };

  const renderRecIcon = (iconType: string) => {
    if (iconType === "Moon") return <Moon className="h-6 w-6 text-[#76A8A1]" />;
    if (iconType === "Sparkles") return <Sparkles className="h-6 w-6 text-[#C6A49A]" />;
    if (iconType === "Droplets") return <Droplets className="h-6 w-6 text-[#76A8A1]" />;
    return <HeartPulse className="h-6 w-6 text-[#C6A49A]" />;
  };

  if (compact) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Daily AI Summary Card */}
        <div className="rounded-[2.5rem] surface-hero p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A49A]/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex items-center gap-4 border-b border-[#E8DFD8]/80 pb-5 mb-6 relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#3D2B1F] text-white shadow-md shrink-0 group hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-7 w-7 text-[#C6A49A]" />
            </div>
            <div>
              <h3 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight leading-none">{language === "id" ? "Rangkuman Harian AI" : "Daily AI Summary"}</h3>
              <p className="text-xs sm:text-sm text-[#8D7B68] mt-1.5 font-bold uppercase tracking-wider">{language === "id" ? "Sintesis kesejahteraan reflektif" : "Reflective wellness synthesis"}</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <h4 className="font-black text-xl sm:text-3xl text-[#3D2B1F] tracking-tight leading-snug">{dailySummary.headline}</h4>
            <div className="space-y-3 pl-4 border-l-4 border-[#C6A49A]">
              {dailySummary.observations.map((obs, idx) => (
                <p key={idx} className="text-sm sm:text-base text-[#8D7B68] leading-relaxed font-semibold flex items-start gap-3">
                  <span className="text-[#C6A49A] font-black mt-0.5">•</span>
                  <span>{obs}</span>
                </p>
              ))}
            </div>
            <div className="pt-6 border-t border-[#E8DFD8]/80 mt-6 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#E8DFD8] shadow-sm">
              <p className="text-sm sm:text-base text-[#3D2B1F] italic font-bold leading-relaxed">
                "{dailySummary.reflectionPrompt}"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300 pt-4">
      {/* 1. Daily AI Summary */}
      <div className="rounded-[2.5rem] surface-hero p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A49A]/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-4 border-b border-[#E8DFD8]/80 pb-5 mb-6 relative z-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#3D2B1F] text-white shadow-md shrink-0 group hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-7 w-7 text-[#C6A49A]" />
          </div>
          <div>
            <h3 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight leading-none">{language === "id" ? "Rangkuman Harian AI" : "Daily AI Summary"}</h3>
            <p className="text-xs sm:text-sm text-[#8D7B68] mt-1.5 font-bold uppercase tracking-wider">{language === "id" ? "Sintesis kesejahteraan reflektif" : "Reflective wellness synthesis"}</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <h4 className="font-black text-xl sm:text-3xl text-[#3D2B1F] tracking-tight leading-snug">{dailySummary.headline}</h4>
          <div className="space-y-3 pl-4 border-l-4 border-[#C6A49A]">
            {dailySummary.observations.map((obs, idx) => (
              <p key={idx} className="text-sm sm:text-base text-[#8D7B68] leading-relaxed font-semibold flex items-start gap-3">
                <span className="text-[#C6A49A] font-black mt-0.5">•</span>
                <span>{obs}</span>
              </p>
            ))}
          </div>
          <div className="pt-6 border-t border-[#E8DFD8]/80 mt-6 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#E8DFD8] shadow-sm">
            <p className="text-sm sm:text-base text-[#3D2B1F] italic font-bold leading-relaxed">
              "{dailySummary.reflectionPrompt}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Wellness Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
          <Activity className="h-6 w-6 text-[#76A8A1]" />
          <h3 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight">{language === "id" ? "Umpan Kesejahteraan Dinamis" : "Dynamic Wellness Feed"}</h3>
        </div>
        <div className="space-y-4">
          {dynamicFeed.map((item) => (
            <div key={item.id} className="flex items-center justify-between surface-elevated p-5 sm:p-6 rounded-3xl interactive-card gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-[1.25rem] shrink-0 shadow-sm ${
                  item.type === "positive" ? "bg-[#E8F3F1]" : item.type === "warning" ? "bg-amber-50" : "bg-[#FAF8F5]"
                }`}>
                  {renderFeedIcon(item.category, item.type)}
                </div>
                <p className="text-xs sm:text-base font-bold text-[#3D2B1F] leading-snug">{item.text}</p>
              </div>
              <span className="text-[10px] sm:text-xs font-black text-[#C6A49A] bg-[#FAF8F5] border border-[#E8DFD8] px-3.5 py-1.5 rounded-xl shrink-0 shadow-sm uppercase tracking-wider">
                {item.timestampStr}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Behavioral Pattern Detection */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
          <Clock className="h-6 w-6 text-[#C6A49A]" />
          <h3 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight">{language === "id" ? "Analisis Pola Perilaku" : "Behavioral Pattern Analysis"}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 items-stretch">
          {behavioralPatterns.map((pattern, idx) => (
            <div key={idx} className="surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between border-b border-[#F3EEEA]/80 pb-4 gap-2">
                <h4 className="font-black text-base sm:text-lg text-[#3D2B1F] line-clamp-1">{pattern.patternName}</h4>
                <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-xl shadow-sm uppercase tracking-wider shrink-0 ${
                  pattern.status === "Action Needed" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                  pattern.status === "Active" ? "bg-orange-50 text-orange-600 border border-orange-200" :
                  pattern.status === "Improving" ? "bg-[#E8F3F1] text-[#76A8A1] border border-[#76A8A1]/30" : "bg-[#FAF8F5] text-[#8D7B68] border border-[#E8DFD8]"
                }`}>
                  {pattern.status}
                </span>
              </div>
              <p className="text-xs sm:text-base text-[#8D7B68] leading-relaxed font-semibold">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Smart Wellness Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
          <Sparkles className="h-6 w-6 text-[#76A8A1]" />
          <h3 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight">{language === "id" ? "Rekomendasi Cerdas" : "Smart Recommendations"}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 items-stretch">
          {smartRecommendations.map((rec) => (
            <div key={rec.id} className="surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex items-start gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#FAF8F5] border border-[#E8DFD8] text-[#3D2B1F] shadow-sm shrink-0 mt-0.5">
                {renderRecIcon(rec.iconType)}
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-base sm:text-lg text-[#3D2B1F]">{rec.title}</h4>
                <p className="text-xs sm:text-base text-[#8D7B68] leading-relaxed font-semibold">{rec.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Gentle Consistency System (Streaks) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
          <Award className="h-6 w-6 text-[#C6A49A]" />
          <h3 className="font-black text-xl sm:text-2xl text-[#3D2B1F] tracking-tight">{language === "id" ? "Sistem Konsistensi Lembut" : "Gentle Consistency System"}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 items-stretch">
          {consistencyStreaks.map((streak, idx) => (
            <div key={idx} className="surface-elevated p-5 sm:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 border-b border-[#F3EEEA]/80 pb-3 sm:pb-4">
                <Flame className={`h-5 w-5 sm:h-6 sm:w-6 ${streak.isAchieved ? "text-[#76A8A1]" : "text-[#C6A49A]"}`} />
                <h4 className="font-black text-xs sm:text-base text-[#3D2B1F] line-clamp-1">{streak.streakName}</h4>
              </div>
              <div className="my-1 sm:my-3">
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#3D2B1F] tracking-tight">{streak.count}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#8D7B68]">{streak.unit}</span>
                </div>
                <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-[#8D7B68] font-bold leading-snug">{streak.statusText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
