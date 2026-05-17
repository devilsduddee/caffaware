import React from "react";
import { BarChart3, TrendingUp, Award, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TrendVisualizationProps {
  weeklyTrends: {
    day: string;
    dateStr: string;
    totalMg: number;
    activeMgAtCutoff: number;
    score: number;
    isOverLimit: boolean;
  }[];
  metricsSummary: {
    weeklyAverageMg: number;
    lateDrinkCount: number;
    perfectDaysCount: number;
  };
  dailyLimit: number;
}

export const TrendVisualization: React.FC<TrendVisualizationProps> = ({
  weeklyTrends,
  metricsSummary,
  dailyLimit,
}) => {
  const { t, language } = useLanguage();
  const limit = dailyLimit || 250;
  
  // Find max value for chart scaling
  const maxMg = Math.max(limit * 1.2, ...weeklyTrends.map((t) => t.totalMg));

  return (
    <div className="rounded-[2.5rem] surface-elevated p-6 sm:p-10 shadow-[0_20px_60px_rgba(61,43,31,0.06)] border border-[#E8DFD8] space-y-8 transition-all duration-300 hover:shadow-[0_25px_70px_rgba(61,43,31,0.1)] hover:border-[#C6A49A]/40 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A49A]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F3EEEA]/80 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] shadow-sm shrink-0 group hover:scale-105 transition-transform duration-300">
            <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-[#3D2B1F]" />
          </div>
          <div>
            <h3 className="font-black text-xl sm:text-3xl text-[#3D2B1F] tracking-tight leading-none">{t.trend.title}</h3>
            <p className="text-xs sm:text-sm text-[#8D7B68] mt-1.5 font-semibold">{t.trend.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E8DFD8] px-4 py-2 rounded-2xl text-xs font-extrabold text-[#8D7B68] self-start sm:self-center shadow-sm uppercase tracking-wider">
          <TrendingUp className="h-4 w-4 text-[#C6A49A]" />
          <span>{language === "id" ? "Analisis 7 Hari" : "7-Day Analysis"}</span>
        </div>
      </div>

      {/* Top Summary Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-8 py-2 border-b border-[#F3EEEA]/80 pb-6 divide-x divide-[#F3EEEA]/80 bg-[#FAF8F5] sm:bg-transparent p-4 sm:p-0 rounded-3xl sm:rounded-none border border-[#E8DFD8] sm:border-0 shadow-sm sm:shadow-none relative z-10">
        {/* Weekly Average */}
        <div className="space-y-1.5 pr-2 sm:pr-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5 text-[#C6A49A] hidden sm:inline" />
            <span>{t.trend.avgIntake}</span>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="text-2xl sm:text-5xl font-black text-[#3D2B1F] tracking-tight">{metricsSummary.weeklyAverageMg}</span>
            <span className="text-[10px] sm:text-base font-extrabold text-[#8D7B68]">mg/{language === "id" ? "hari" : "d"}</span>
          </div>
          <span className="text-[10px] font-bold text-[#8D7B68] block sm:hidden">{language === "id" ? "Per hari" : "Per day"}</span>
        </div>

        {/* Late Drinks */}
        <div className="space-y-1.5 px-2 sm:px-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5 text-[#76A8A1] hidden sm:inline" />
            <span>{language === "id" ? "Minuman Larut" : "Late Drinks"}</span>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="text-2xl sm:text-5xl font-black text-[#3D2B1F] tracking-tight">{metricsSummary.lateDrinkCount}</span>
            <span className="text-[10px] sm:text-base font-extrabold text-[#8D7B68]">{language === "id" ? "gelas" : "bevs"}</span>
          </div>
          <span className="text-[10px] font-bold text-[#8D7B68] block sm:hidden">{language === "id" ? "Lewat batas" : "After cutoff"}</span>
        </div>

        {/* Balanced Days */}
        <div className="space-y-1.5 pl-2 sm:pl-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">
            <Award className="h-3.5 w-3.5 text-[#C6A49A] hidden sm:inline" />
            <span>{language === "id" ? "Hari Seimbang" : "Balanced"}</span>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="text-2xl sm:text-5xl font-black text-[#3D2B1F] tracking-tight">{metricsSummary.perfectDaysCount}</span>
            <span className="text-[10px] sm:text-base font-extrabold text-[#8D7B68]">/7{language === "id" ? "h" : "d"}</span>
          </div>
          <span className="text-[10px] font-bold text-[#8D7B68] block sm:hidden">{language === "id" ? "Dalam batas" : "Within limit"}</span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="space-y-6 pt-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#8D7B68]">
          <span>{language === "id" ? `ASUPAN VS BATAS (${limit} MG)` : `DAILY INTAKE VS LIMIT (${limit} MG)`}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#3D2B1F]" /> {language === "id" ? "Bawah Batas" : "Under Limit"}</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /> {language === "id" ? "Atas Batas" : "Over Limit"}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 sm:gap-8 h-56 sm:h-64 items-end pt-8 border-b border-[#F3EEEA]/80 relative z-10">
          {/* Limit Reference Line */}
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-[#C6A49A] z-10 pointer-events-none flex items-center justify-end pr-4"
            style={{ bottom: `${(limit / maxMg) * 100}%` }}
          >
            <span className="bg-[#FAF8F5] border border-[#E8DFD8] px-3 py-1 text-xs font-extrabold text-[#C6A49A] rounded-xl shadow-sm uppercase tracking-wider">{language === "id" ? "Batas" : "Limit"}: {limit}mg</span>
          </div>

          {weeklyTrends.map((trend, idx) => {
            const heightPercent = Math.min(100, Math.max(8, (trend.totalMg / maxMg) * 100));
            return (
              <div key={trend.dateStr || idx} className="flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-12 bg-[#3D2B1F] text-white text-xs font-black py-2 px-4 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 pointer-events-none whitespace-nowrap">
                  {trend.totalMg} mg • {language === "id" ? "Skor" : "Score"}: {trend.score}
                </div>

                {/* Bar Value */}
                <span className="text-xs sm:text-sm font-black text-[#3D2B1F] mb-1.5 group-hover:scale-110 transition-transform duration-200">
                  {trend.totalMg}
                </span>

                {/* Bar */}
                <div 
                  className={`w-full rounded-t-2xl transition-all duration-700 group-hover:opacity-85 shadow-md ${
                    trend.isOverLimit ? "bg-red-500" : "bg-[#3D2B1F]"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                {/* Day Label */}
                <span className="mt-2.5 text-xs sm:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider">
                  {trend.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
