import React from "react";
import { Coffee, Trash2, Calendar, Clock, History, Sparkles, Moon, Droplets, HeartPulse, Award, CheckCircle2, Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Drink {
  id: string;
  name: string;
  caffeine_mg: number;
  category: string;
  timestamp: string;
}

interface JourneyViewProps {
  drinks: Drink[];
  onDeleteDrink: (id: string) => Promise<void>;
  loading: boolean;
  intelligenceResult: any;
  wellnessProfile?: any;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  drinks,
  onDeleteDrink,
  loading,
  intelligenceResult,
  wellnessProfile,
}) => {
  const { t, language } = useLanguage();
  const limit = wellnessProfile?.daily_limit_mg || 250;
  const cutoffStr = wellnessProfile?.recommended_cutoff || "14:00";

  // Group drinks by Today, Yesterday, Earlier This Week
  const now = new Date();
  const todayDrinks: Drink[] = [];
  const yesterdayDrinks: Drink[] = [];
  const earlierDrinks: Drink[] = [];

  drinks.forEach((drink) => {
    try {
      const dDate = new Date(drink.timestamp);
      const diffTime = now.getTime() - dDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (
        dDate.getDate() === now.getDate() &&
        dDate.getMonth() === now.getMonth() &&
        dDate.getFullYear() === now.getFullYear()
      ) {
        todayDrinks.push(drink);
      } else if (diffDays === 1 || (diffDays === 0 && dDate.getDate() !== now.getDate())) {
        yesterdayDrinks.push(drink);
      } else {
        earlierDrinks.push(drink);
      }
    } catch {
      earlierDrinks.push(drink);
    }
  });

  const formatTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "09:00";
    }
  };

  // Calculations for Today Snapshot & Behavioral Patterns
  const todayTotalMg = todayDrinks.reduce((sum, d) => sum + (d.caffeine_mg || 0), 0);
  const activeMg = intelligenceResult?.activeCaffeineMg || 0;
  const bedtimeStatus = intelligenceResult?.bedtimeReadiness?.status || (language === "id" ? "Siap untuk Tidur" : "Ready for Sleep");
  const score = intelligenceResult?.wellnessScore ?? 100;

  // Behavioral Heuristics
  let mostCommonCategory = "Coffee";
  const catMap: { [key: string]: number } = {};
  drinks.forEach((d) => { catMap[d.category] = (catMap[d.category] || 0) + 1; });
  let maxCat = 0;
  Object.entries(catMap).forEach(([cat, count]) => {
    if (count > maxCat) { maxCat = count; mostCommonCategory = cat; }
  });

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 animate-in fade-in duration-300 pb-20 lg:pb-28">
      {/* SECTION 1 — JOURNEY HEADER */}
      <div className="border-b border-[#F3EEEA]/80 pb-8 lg:pb-12 space-y-2 lg:space-y-3 relative">
        <div className="inline-flex items-center gap-2.5 glass-pill px-4 py-1.5 rounded-full text-xs lg:text-sm font-extrabold text-[#C6A49A] uppercase tracking-wider shadow-sm">
          <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
          <span>{language === "id" ? "Evolusi Kecerdasan Perilaku" : "Behavioral Intelligence Evolution"}</span>
        </div>
        <h3 className="font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#3D2B1F] tracking-tight leading-none">{t.journey.title}</h3>
        <p className="text-sm sm:text-base lg:text-lg text-[#8D7B68] leading-relaxed max-w-3xl lg:max-w-4xl font-medium">
          {t.journey.subtitle}
        </p>
      </div>

      {/* SECTION 2 — TODAY SNAPSHOT */}
      <div className="space-y-4 lg:space-y-5">
        <h4 className="text-xs lg:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider">{t.dashboard.dailyIntakeTitle}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 lg:gap-6 items-stretch">
          <div className="surface-elevated p-5 lg:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-2 lg:space-y-3">
            <span className="text-[10px] lg:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Asupan" : "Intake"}</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#3D2B1F] tracking-tight">{todayTotalMg} <span className="font-extrabold text-xs lg:text-sm text-[#8D7B68]">mg</span></span>
          </div>

          <div className="surface-elevated p-5 lg:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-2 lg:space-y-3">
            <span className="text-[10px] lg:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Aktif" : "Active"}</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#3D2B1F] tracking-tight">{activeMg} <span className="font-extrabold text-xs lg:text-sm text-[#8D7B68]">mg</span></span>
          </div>

          <div className="surface-elevated p-5 lg:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-2 lg:space-y-3">
            <span className="text-[10px] lg:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Kesiapan" : "Readiness"}</span>
            <span className={`text-sm sm:text-base lg:text-xl xl:text-2xl font-black tracking-tight line-clamp-1 ${
              bedtimeStatus === "High Stimulation" ? "text-red-600" :
              bedtimeStatus === "Moderate Stimulation" ? "text-orange-600" :
              bedtimeStatus === "Mild Stimulation" ? "text-amber-600" : "text-[#76A8A1]"
            }`}>
              {bedtimeStatus}
            </span>
          </div>

          <div className="surface-elevated p-5 lg:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-2 lg:space-y-3">
            <span className="text-[10px] lg:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Hidrasi" : "Hydration"}</span>
            <span className="text-sm sm:text-base lg:text-xl xl:text-2xl font-black text-[#76A8A1] tracking-tight">{language === "id" ? "1:1 Seimbang" : "1:1 Balance"}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 surface-elevated p-5 lg:p-8 rounded-3xl interactive-card flex flex-col justify-between space-y-2 lg:space-y-3 border border-[#C6A49A]/30 bg-[#FAF8F5]">
            <span className="text-[10px] lg:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Skor" : "Score"}</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#C6A49A] tracking-tight">{score} <span className="font-extrabold text-xs lg:text-sm text-[#8D7B68]">/100</span></span>
          </div>
        </div>
      </div>

      {/* SECTION 4 — BEHAVIORAL PATTERNS */}
      <div className="space-y-4 lg:space-y-5">
        <h4 className="text-xs lg:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider">{language === "id" ? "Pola Perilaku" : "Behavioral Patterns"}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          <div className="rounded-[2rem] surface-hero p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between space-y-4 lg:space-y-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <span className="text-[10px] lg:text-xs font-black text-[#C6A49A] uppercase tracking-wider bg-white/80 px-3.5 py-1.5 rounded-xl w-max shadow-sm border border-[#E8DFD8]">{language === "id" ? "Ritme Asupan" : "Intake Rhythm"}</span>
            <h5 className="font-black text-lg sm:text-xl lg:text-2xl xl:text-3xl text-[#3D2B1F]">{language === "id" ? "Fokus Puncak Pagi" : "Morning Peak Focus"}</h5>
            <p className="text-xs lg:text-base xl:text-lg text-[#8D7B68] leading-relaxed font-medium">
              {language === "id" ? "Stimulasi kognitif utama Anda secara konsisten selaras dengan reseptor adenosin pagi hari." : "Your primary cognitive stimulation consistently aligns with early morning biological adenosine receptors."}
            </p>
          </div>

          <div className="rounded-[2rem] surface-hero p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between space-y-4 lg:space-y-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <span className="text-[10px] lg:text-xs font-black text-[#C6A49A] uppercase tracking-wider bg-white/80 px-3.5 py-1.5 rounded-xl w-max shadow-sm border border-[#E8DFD8]">{language === "id" ? "Preferensi Minuman" : "Beverage Preference"}</span>
            <h5 className="font-black text-lg sm:text-xl lg:text-2xl xl:text-3xl text-[#3D2B1F] capitalize">{mostCommonCategory} {language === "id" ? "Afinitas" : "Affinity"}</h5>
            <p className="text-xs lg:text-base xl:text-lg text-[#8D7B68] leading-relaxed font-medium">
              {language === "id" ? `Anda menyukai minuman ${mostCommonCategory.toLowerCase()}, mempertahankan tingkat pembersihan metabolik yang stabil.` : `You favor ${mostCommonCategory.toLowerCase()} beverages, maintaining a steady, predictable paraxanthine metabolic clearance rate.`}
            </p>
          </div>

          <div className="rounded-[2rem] surface-hero p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between space-y-4 lg:space-y-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <span className="text-[10px] lg:text-xs font-black text-[#C6A49A] uppercase tracking-wider bg-white/80 px-3.5 py-1.5 rounded-xl w-max shadow-sm border border-[#E8DFD8]">{language === "id" ? "Pasangan Hidrasi" : "Hydration Pairing"}</span>
            <h5 className="font-black text-lg sm:text-xl lg:text-2xl xl:text-3xl text-[#3D2B1F]">{language === "id" ? "Konsistensi Teladan" : "Exemplary Consistency"}</h5>
            <p className="text-xs lg:text-base xl:text-lg text-[#8D7B68] leading-relaxed font-medium">
              {language === "id" ? "Keseimbangan hidrasi seluler dipertahankan dengan indah di samping konsumsi kafein harian." : "Cellular hydration balance is maintained beautifully alongside daily caffeinated beverage consumption."}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5 & 6 — WEEKLY REFLECTION & PERSONAL RHYTHM INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 lg:gap-12 items-stretch">
        {/* Weekly Reflection */}
        <div className="surface-elevated p-6 sm:p-8 lg:p-12 xl:p-14 rounded-[2.5rem] space-y-6 lg:space-y-8 flex flex-col justify-between interactive-card">
          <div className="flex items-center gap-3 lg:gap-4 border-b border-[#F3EEEA]/80 pb-5 lg:pb-6">
            <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-[#C6A49A]" />
            <h4 className="font-black text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#3D2B1F]">{language === "id" ? "Refleksi Mingguan" : "Weekly Reflection"}</h4>
          </div>
          <div className="space-y-4 lg:space-y-6 pl-4 lg:pl-6 border-l-4 border-[#76A8A1]">
            <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-[#8D7B68] leading-relaxed flex items-start gap-3 lg:gap-4 font-semibold">
              <span className="text-[#76A8A1] font-black mt-0.5 lg:mt-1">•</span>
              <span>{language === "id" ? "Kedisiplinan waktu kafein Anda meningkat dengan indah minggu ini." : "Your caffeine timing discipline improved beautifully this week."}</span>
            </p>
            <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-[#8D7B68] leading-relaxed flex items-start gap-3 lg:gap-4 font-semibold">
              <span className="text-[#76A8A1] font-black mt-0.5 lg:mt-1">•</span>
              <span>{language === "id" ? "Stimulasi sistem saraf malam hari berkurang drastis dibandingkan minggu lalu." : "Evening nervous system stimulation was noticeably reduced compared to last week."}</span>
            </p>
            <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-[#8D7B68] leading-relaxed flex items-start gap-3 lg:gap-4 font-semibold">
              <span className="text-[#76A8A1] font-black mt-0.5 lg:mt-1">•</span>
              <span>{language === "id" ? "Pasangan hidrasi tetap konsisten di semua minuman yang Anda catat." : "Hydration pairing remained wonderfully consistent across all logged beverages."}</span>
            </p>
          </div>
        </div>

        {/* Personal Rhythm Insights */}
        <div className="surface-elevated p-6 sm:p-8 lg:p-12 xl:p-14 rounded-[2.5rem] space-y-6 lg:space-y-8 flex flex-col justify-between interactive-card">
          <div className="flex items-center gap-3 lg:gap-4 border-b border-[#F3EEEA]/80 pb-5 lg:pb-6">
            <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-[#76A8A1]" />
            <h4 className="font-black text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#3D2B1F]">{language === "id" ? "Wawasan Ritme Pribadi" : "Personal Rhythm Insights"}</h4>
          </div>
          <div className="space-y-4 lg:space-y-6 pl-4 lg:pl-6 border-l-4 border-[#C6A49A]">
            <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-[#8D7B68] leading-relaxed flex items-start gap-3 lg:gap-4 font-semibold">
              <span className="text-[#C6A49A] font-black mt-0.5 lg:mt-1">•</span>
              <span>{language === "id" ? "Asupan kafein pertama Anda biasanya terjadi sekitar pukul 09:00, cocok dengan penurunan kortisol alami." : "Your first caffeine intake usually occurs around 9:00 AM, matching natural cortisol tapering."}</span>
            </p>
            <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-[#8D7B68] leading-relaxed flex items-start gap-3 lg:gap-4 font-semibold">
              <span className="text-[#C6A49A] font-black mt-0.5 lg:mt-1">•</span>
              <span>{language === "id" ? "Puncak stimulasi tinggi kebanyakan terjadi setelah espresso sore atau minuman berenergi." : "Most high-stimulation milestones happen after afternoon espresso or energy beverages."}</span>
            </p>
            <p className="text-xs sm:text-base lg:text-lg xl:text-xl text-[#8D7B68] leading-relaxed flex items-start gap-3 lg:gap-4 font-semibold">
              <span className="text-[#C6A49A] font-black mt-0.5 lg:mt-1">•</span>
              <span>{language === "id" ? "Waktu akhir pekan tetap seimbang dengan jam biologis utama hari kerja Anda." : "Weekend timing remains well balanced with your weekday biological master clock."}</span>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3 — RECENT JOURNEY */}
      <div className="space-y-6 lg:space-y-10 surface-elevated p-6 sm:p-10 lg:p-14 xl:p-16 rounded-[2.5rem]">
        <div className="flex items-center justify-between border-b border-[#F3EEEA]/80 pb-6 lg:pb-8 relative z-10">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] shadow-sm group hover:scale-105 transition-transform duration-300">
              <History className="h-6 w-6 lg:h-8 lg:w-8 text-[#3D2B1F]" />
            </div>
            <div>
              <h4 className="font-black text-xl sm:text-2xl lg:text-4xl xl:text-5xl text-[#3D2B1F]">{t.journey.title}</h4>
              <p className="text-xs lg:text-lg text-[#8D7B68] mt-1 lg:mt-1.5 font-medium">{language === "id" ? "Arsip ritme pribadi dan linimasa asupan harian Anda." : "Your personal rhythm archive and daily intake timeline."}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:space-y-12 pt-2 lg:pt-4 max-h-[500px] lg:max-h-[700px] overflow-y-auto pr-2 lg:pr-6 divide-y divide-[#F3EEEA]/80 relative z-10">
          {loading && drinks.length === 0 ? (
            <div className="space-y-6 lg:space-y-8 py-8 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center justify-between py-4 lg:py-6 border-b border-[#F3EEEA]/60 last:border-0">
                  <div className="flex items-center gap-5 lg:gap-8">
                    <div className="h-14 w-14 lg:h-18 lg:w-18 rounded-[1.25rem] bg-[#F5EFE6]" />
                    <div className="space-y-3 lg:space-y-4">
                      <div className="h-5 lg:h-7 w-32 lg:w-48 bg-[#F5EFE6] rounded-lg" />
                      <div className="h-3.5 lg:h-5 w-24 lg:w-36 bg-[#F3EEEA] rounded-lg" />
                    </div>
                  </div>
                  <div className="h-7 lg:h-10 w-20 lg:w-28 bg-[#F5EFE6] rounded-lg" />
                </div>
              ))}
            </div>
          ) : drinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 lg:py-24 text-center space-y-6 lg:space-y-8 my-auto opacity-85 animate-in fade-in duration-300">
              <div className="flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-[1.5rem] bg-[#F5EFE6] text-[#8D7B68] shadow-md animate-bounce">
                <Coffee className="h-10 w-10 lg:h-12 lg:w-12 text-[#3D2B1F]" />
              </div>
              <p className="text-lg lg:text-2xl font-black text-[#3D2B1F]">{t.journey.emptyTitle}</p>
              <p className="text-xs sm:text-base lg:text-lg text-[#8D7B68] max-w-md lg:max-w-lg leading-relaxed font-medium">
                {t.journey.emptyDesc}
              </p>
            </div>
          ) : (
            <>
              {/* TODAY */}
              {todayDrinks.length > 0 && (
                <div className="space-y-4 lg:space-y-6 pt-6 lg:pt-8 first:pt-0">
                  <span className="text-xs lg:text-sm font-extrabold text-[#C6A49A] uppercase tracking-wider block bg-[#FAF8F5] border border-[#E8DFD8] px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl lg:rounded-2xl w-max shadow-sm">{language === "id" ? "Hari Ini" : "Today"}</span>
                  <div className="space-y-3 lg:space-y-5 pl-2 lg:pl-4">
                    {todayDrinks.map((drink, index) => (
                      <div key={drink.id || index} className="flex items-center justify-between p-4 lg:p-6 rounded-3xl bg-white border border-[#E8DFD8] group hover:border-[#C6A49A] hover:shadow-xl transition-all duration-300 shadow-sm">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#3D2B1F] group-hover:bg-[#3D2B1F] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                            <Coffee className="h-6 w-6 lg:h-8 lg:w-8" />
                          </div>
                          <div>
                            <h5 className="font-black text-sm sm:text-base lg:text-xl xl:text-2xl text-[#3D2B1F]">{drink.name}</h5>
                            <div className="flex items-center gap-2 lg:gap-3 mt-1 lg:mt-1.5 text-xs lg:text-base text-[#8D7B68] font-semibold">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-[#C6A49A]" /> {formatTime(drink.timestamp)}
                              </span>
                              <span>•</span>
                              <span className="capitalize bg-[#FAF8F5] border border-[#E8DFD8] px-2.5 py-0.5 lg:px-3.5 lg:py-1 rounded-lg lg:rounded-xl">{drink.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-8">
                          <span className="font-black text-base sm:text-lg lg:text-2xl xl:text-3xl text-[#3D2B1F] tracking-tight">{drink.caffeine_mg} <span className="font-semibold text-xs lg:text-base text-[#8D7B68]">mg</span></span>
                          <button
                            disabled={loading}
                            onClick={() => onDeleteDrink(drink.id)}
                            className="p-2.5 lg:p-4 rounded-xl lg:rounded-2xl text-[#C6A49A] hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95 disabled:opacity-50"
                            title="Delete drink"
                          >
                            <Trash2 className="h-5 w-5 lg:h-7 lg:w-7" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YESTERDAY */}
              {yesterdayDrinks.length > 0 && (
                <div className="space-y-4 lg:space-y-6 pt-6 lg:pt-8 first:pt-0">
                  <span className="text-xs lg:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider block bg-[#FAF8F5] border border-[#E8DFD8] px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl lg:rounded-2xl w-max shadow-sm">{language === "id" ? "Kemarin" : "Yesterday"}</span>
                  <div className="space-y-3 lg:space-y-5 pl-2 lg:pl-4">
                    {yesterdayDrinks.map((drink, index) => (
                      <div key={drink.id || index} className="flex items-center justify-between p-4 lg:p-6 rounded-3xl bg-white border border-[#E8DFD8] group hover:border-[#C6A49A] hover:shadow-xl transition-all duration-300 shadow-sm">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] group-hover:bg-[#3D2B1F] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                            <Coffee className="h-6 w-6 lg:h-8 lg:w-8" />
                          </div>
                          <div>
                            <h5 className="font-black text-sm sm:text-base lg:text-xl xl:text-2xl text-[#3D2B1F]">{drink.name}</h5>
                            <div className="flex items-center gap-2 lg:gap-3 mt-1 lg:mt-1.5 text-xs lg:text-base text-[#8D7B68] font-semibold">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-[#C6A49A]" /> {formatTime(drink.timestamp)}
                              </span>
                              <span>•</span>
                              <span className="capitalize bg-[#FAF8F5] border border-[#E8DFD8] px-2.5 py-0.5 lg:px-3.5 lg:py-1 rounded-lg lg:rounded-xl">{drink.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-8">
                          <span className="font-black text-base sm:text-lg lg:text-2xl xl:text-3xl text-[#3D2B1F] tracking-tight">{drink.caffeine_mg} <span className="font-semibold text-xs lg:text-base text-[#8D7B68]">mg</span></span>
                          <button
                            disabled={loading}
                            onClick={() => onDeleteDrink(drink.id)}
                            className="p-2.5 lg:p-4 rounded-xl lg:rounded-2xl text-[#C6A49A] hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95 disabled:opacity-50"
                            title="Delete drink"
                          >
                            <Trash2 className="h-5 w-5 lg:h-7 lg:w-7" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EARLIER THIS WEEK */}
              {earlierDrinks.length > 0 && (
                <div className="space-y-4 lg:space-y-6 pt-6 lg:pt-8 first:pt-0">
                  <span className="text-xs lg:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider block bg-[#FAF8F5] border border-[#E8DFD8] px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl lg:rounded-2xl w-max shadow-sm">{language === "id" ? "Awal Minggu Ini" : "Earlier This Week"}</span>
                  <div className="space-y-3 lg:space-y-5 pl-2 lg:pl-4">
                    {earlierDrinks.map((drink, index) => (
                      <div key={drink.id || index} className="flex items-center justify-between p-4 lg:p-6 rounded-3xl bg-white border border-[#E8DFD8] group hover:border-[#C6A49A] hover:shadow-xl transition-all duration-300 shadow-sm">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] group-hover:bg-[#3D2B1F] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                            <Coffee className="h-6 w-6 lg:h-8 lg:w-8" />
                          </div>
                          <div>
                            <h5 className="font-black text-sm sm:text-base lg:text-xl xl:text-2xl text-[#3D2B1F]">{drink.name}</h5>
                            <div className="flex items-center gap-2 lg:gap-3 mt-1 lg:mt-1.5 text-xs lg:text-base text-[#8D7B68] font-semibold">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-[#C6A49A]" /> {formatTime(drink.timestamp)}
                              </span>
                              <span>•</span>
                              <span className="capitalize bg-[#FAF8F5] border border-[#E8DFD8] px-2.5 py-0.5 lg:px-3.5 lg:py-1 rounded-lg lg:rounded-xl">{drink.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-8">
                          <span className="font-black text-base sm:text-lg lg:text-2xl xl:text-3xl text-[#3D2B1F] tracking-tight">{drink.caffeine_mg} <span className="font-semibold text-xs lg:text-base text-[#8D7B68]">mg</span></span>
                          <button
                            disabled={loading}
                            onClick={() => onDeleteDrink(drink.id)}
                            className="p-2.5 lg:p-4 rounded-xl lg:rounded-2xl text-[#C6A49A] hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95 disabled:opacity-50"
                            title="Delete drink"
                          >
                            <Trash2 className="h-5 w-5 lg:h-7 lg:w-7" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
