import React from "react";
import { Coffee, AlertCircle, CheckCircle2, Heart, Activity, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DailyIntakeCardProps {
  currentIntake: number;
  dailyLimit: number;
  activeCaffeineMg?: number;
}

export const DailyIntakeCard: React.FC<DailyIntakeCardProps> = ({ 
  currentIntake, 
  dailyLimit,
  activeCaffeineMg = 0 
}) => {
  const { t, language } = useLanguage();
  const limit = dailyLimit || 250;
  const remaining = Math.max(0, limit - currentIntake);
  const percentage = Math.min(100, Math.round((currentIntake / limit) * 100));
  
  const isOverLimit = currentIntake > limit;
  const isNearLimit = currentIntake > limit * 0.85 && !isOverLimit;

  return (
    <div className="rounded-[2.5rem] surface-elevated p-8 sm:p-12 shadow-[0_20px_60px_rgba(61,43,31,0.06)] border border-[#E8DFD8] flex flex-col justify-between space-y-8 transition-all duration-300 hover:shadow-[0_25px_70px_rgba(61,43,31,0.1)] hover:border-[#C6A49A]/40 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#C6A49A]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F3EEEA]/80 pb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#3D2B1F] shadow-sm shrink-0 group hover:scale-105 transition-transform duration-300">
            <Coffee className="h-7 w-7 sm:h-8 sm:w-8 text-[#3D2B1F]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-[#3D2B1F] tracking-tight leading-none">{t.dashboard.dailyIntakeTitle}</h2>
            <p className="text-xs sm:text-sm font-bold text-[#8D7B68] mt-1.5 uppercase tracking-wider">{t.dashboard.dailyIntakeSub}{limit} mg / {language === "id" ? "hari" : "day"}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="self-start sm:self-center w-full sm:w-auto">
          {isOverLimit ? (
            <div className="flex items-center justify-center sm:justify-start gap-2.5 px-5 py-3 rounded-2xl bg-red-50 text-red-600 border border-red-200 text-xs sm:text-sm font-extrabold animate-pulse shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{language === "id" ? "Melebihi Batas • Waktunya Istirahat" : "Over Limit • Time to Rest"}</span>
            </div>
          ) : isNearLimit ? (
            <div className="flex items-center justify-center sm:justify-start gap-2.5 px-5 py-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 text-xs sm:text-sm font-extrabold shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{language === "id" ? "Mendekati Batas • Perbanyak Air" : "Near Limit • Hydrate Next"}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center sm:justify-start gap-2.5 px-5 py-3 rounded-2xl bg-[#E8F3F1] text-[#76A8A1] border border-[#76A8A1]/30 text-xs sm:text-sm font-extrabold shadow-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{language === "id" ? "Zona Optimal • Seimbang" : "Optimal Zone • Balanced"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Numbers Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-8 py-2 divide-x divide-[#F3EEEA]/80 bg-[#FAF8F5] sm:bg-transparent p-4 sm:p-0 rounded-3xl sm:rounded-none border border-[#E8DFD8] sm:border-0 shadow-sm sm:shadow-none relative z-10">
        {/* Current Intake */}
        <div className="space-y-1.5 sm:space-y-2 pr-2 sm:pr-6 text-center sm:text-left">
          <div className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#8D7B68] uppercase">
            <span>{language === "id" ? "Asupan Saat Ini" : "Current Intake"}</span>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#3D2B1F] tracking-tight">{currentIntake}</span>
            <span className="text-xs sm:text-xl font-extrabold text-[#8D7B68]">mg</span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#8D7B68] font-medium leading-relaxed pt-1 hidden sm:block">
            {language === "id" ? "Total kafein yang dikonsumsi hari ini." : "Total caffeine consumed from all logged beverages today."}
          </p>
          <span className="text-[10px] font-bold text-[#8D7B68] block sm:hidden">{language === "id" ? "Asupan hari ini" : "Intake today"}</span>
        </div>

        {/* Remaining Capacity */}
        <div className="space-y-1.5 sm:space-y-2 px-2 sm:px-6 text-center sm:text-left">
          <div className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#8D7B68] uppercase">
            <span>{language === "id" ? "Sisa Kapasitas" : "Remaining Capacity"}</span>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1 sm:gap-2">
            <span className={`text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight ${
              isOverLimit ? "text-red-600" : isNearLimit ? "text-amber-500" : "text-[#76A8A1]"
            }`}>
              {remaining}
            </span>
            <span className="text-xs sm:text-xl font-extrabold text-[#8D7B68]">mg</span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#8D7B68] font-medium leading-relaxed pt-1 hidden sm:block">
            {language === "id" ? "Sisa kapasitas aman sebelum mencapai ambang batas harian." : "Safe allowance remaining before reaching your daily threshold."}
          </p>
          <span className="text-[10px] font-bold text-[#8D7B68] block sm:hidden">{language === "id" ? "Sisa kapasitas" : "Capacity left"}</span>
        </div>

        {/* Active in Body */}
        <div className="space-y-1.5 sm:space-y-2 pl-2 sm:pl-6 text-center sm:text-left">
          <div className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#76A8A1] uppercase flex items-center justify-center sm:justify-start gap-1.5">
            <Activity className="h-3.5 w-3.5 hidden sm:inline" />
            <span>{t.dashboard.activeCaffeine}</span>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#3D2B1F] tracking-tight">{activeCaffeineMg}</span>
            <span className="text-xs sm:text-xl font-extrabold text-[#8D7B68]">mg</span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#8D7B68] font-medium leading-relaxed pt-1 hidden sm:block">
            {language === "id" ? "Estimasi sisa kafein aktif dalam tubuh Anda saat ini." : "Estimated circulating caffeine based on a 5.5h half-life curve."}
          </p>
          <span className="text-[10px] font-bold text-[#76A8A1] block sm:hidden">{language === "id" ? "Aktif di tubuh" : "In body now"}</span>
        </div>
      </div>

      {/* Bottom Progress Section */}
      <div className="space-y-4 pt-4 sm:pt-6 border-t border-[#F3EEEA]/80 relative z-10">
        <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
          <span className="text-[#3D2B1F] flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#C6A49A]" />
            <span>{language === "id" ? "Progres Asupan" : "Intake Progress"}</span>
          </span>
          <span className="text-[#8D7B68] bg-[#F5EFE6] px-3 py-1 rounded-full text-xs font-black">{percentage}% {language === "id" ? "Terkonsumsi" : "Consumed"}</span>
        </div>

        <div className="h-5 sm:h-6 w-full bg-[#F5EFE6] rounded-2xl overflow-hidden p-1.5 shadow-inner border border-[#E8DFD8]">
          <div 
            className={`h-full rounded-xl transition-all duration-1000 ease-out shadow-sm ${
              isOverLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-gradient-to-r from-[#3D2B1F] to-[#5D4037]"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-xs sm:text-sm text-[#8D7B68] text-center font-semibold pt-2 leading-relaxed">
          {isOverLimit 
            ? (language === "id" ? "Anda telah melebihi batas harian. Perbanyak minum air dan hindari kafein lebih lanjut demi tidur yang nyenyak." : "You have exceeded your daily limit. Prioritize water and avoid further caffeine to protect your sleep.") 
            : isNearLimit 
            ? (language === "id" ? "Mendekati batas harian Anda. Pertimbangkan untuk beralih ke teh herbal atau air putih untuk sisa hari ini." : "Approaching your daily limit. Consider switching to herbal tea or water for the rest of the day.") 
            : (language === "id" ? "Anda berada dalam zona metabolisme optimal. Kerja bagus dalam mendengarkan sinyal tubuh Anda." : "You are currently within your optimal processing zone. Great job listening to your body.")}
        </p>
      </div>
    </div>
  );
};
