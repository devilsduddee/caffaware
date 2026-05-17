import React, { useState } from "react";
import { Coffee, CupSoda, Plus, Sparkles } from "lucide-react";
import { CustomDrinkModal } from "./CustomDrinkModal";
import { useLanguage } from "@/context/LanguageContext";

interface QuickAddSectionProps {
  onAddDrink: (name: string, mg: number, category: string) => Promise<void>;
  loading: boolean;
}

const PRESETS = [
  { name: "Espresso", mg: 63, category: "Coffee", icon: Coffee },
  { name: "Latte", mg: 77, category: "Coffee", icon: Coffee },
  { name: "Americano", mg: 95, category: "Coffee", icon: Coffee },
  { name: "Cappuccino", mg: 63, category: "Coffee", icon: Coffee },
  { name: "Green Tea", mg: 38, category: "Tea", icon: Coffee },
  { name: "Matcha", mg: 70, category: "Tea", icon: Coffee },
  { name: "Energy Drink", mg: 160, category: "Energy", icon: CupSoda },
];

export const QuickAddSection: React.FC<QuickAddSectionProps> = ({ onAddDrink, loading }) => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="rounded-[2.5rem] surface-elevated p-6 sm:p-10 shadow-[0_20px_60px_rgba(61,43,31,0.06)] border border-[#E8DFD8] space-y-6 sm:space-y-8 transition-all duration-300 hover:shadow-[0_25px_70px_rgba(61,43,31,0.1)] hover:border-[#C6A49A]/40 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F3EEEA]/80 pb-5">
        <div>
          <h3 className="font-black text-xl sm:text-3xl text-[#3D2B1F] tracking-tight">{t.dashboard.quickAddTitle}</h3>
          <p className="text-xs sm:text-base text-[#8D7B68] mt-1 font-medium">{t.dashboard.quickAddSub}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="interactive-btn-primary px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 shadow-md"
          >
            <Sparkles className="h-4 w-4 text-[#C6A49A]" />
            <span>+ {t.dashboard.customDrinkBtn}</span>
          </button>
        </div>
      </div>

      {/* Denser, Mobile-Optimized Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-5 items-stretch relative z-10">
        {/* Custom AI Button Card */}
        <button
          disabled={loading}
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-between p-4 sm:p-6 rounded-3xl border border-[#C6A49A]/60 bg-[#FAF8F5] hover:border-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-white transition-all duration-300 group active:scale-95 disabled:opacity-50 relative overflow-hidden shadow-sm hover:shadow-xl"
        >
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-[#3D2B1F] text-[#C6A49A] group-hover:bg-white group-hover:text-[#3D2B1F] transition-colors duration-300 shadow-sm shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="mt-3 flex flex-col items-center">
            <span className="font-black text-xs sm:text-base text-[#3D2B1F] group-hover:text-white text-center line-clamp-1">{t.dashboard.customDrinkBtn}</span>
            <span className="mt-1 text-[10px] sm:text-xs font-bold text-[#C6A49A] group-hover:text-[#C6A49A] flex items-center gap-1 uppercase tracking-wider">
              {language === "id" ? "Bantuan AI" : "AI Assisted"}
            </span>
          </div>
        </button>

        {/* Presets */}
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.name}
              disabled={loading}
              onClick={() => onAddDrink(preset.name, preset.mg, preset.category)}
              className="flex flex-col items-center justify-between p-4 sm:p-6 rounded-3xl border border-[#E8DFD8] bg-white hover:border-[#C6A49A] hover:bg-[#FAF8F5] hover:shadow-xl transition-all duration-300 group active:scale-95 disabled:opacity-50 relative overflow-hidden shadow-sm"
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] group-hover:bg-[#3D2B1F] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-3 flex flex-col items-center">
                <span className="font-extrabold text-xs sm:text-base text-[#3D2B1F] text-center line-clamp-1">{preset.name}</span>
                <span className="mt-1 text-[10px] sm:text-xs font-bold text-[#C6A49A] flex items-center gap-1 group-hover:text-[#8D7B68] uppercase tracking-wider">
                  <Plus className="h-3 w-3" /> {preset.mg} mg
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Drink AI Modal */}
      <CustomDrinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onAddDrink}
        loading={loading}
      />
    </div>
  );
};
