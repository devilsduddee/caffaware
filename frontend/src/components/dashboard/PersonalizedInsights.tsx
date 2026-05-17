import React from "react";
import { CheckCircle2, AlertCircle, Sparkles, MessageSquareHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Insight {
  id: string;
  type: "positive" | "warning" | "info";
  title: string;
  message: string;
}

interface PersonalizedInsightsProps {
  insights: Insight[];
}

export const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ insights }) => {
  const { t, language } = useLanguage();
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-[#F3EEEA]/80 pb-4">
        <MessageSquareHeart className="h-6 w-6 text-[#C6A49A]" />
        <h3 className="font-black text-xl sm:text-3xl text-[#3D2B1F] tracking-tight">{t.dashboard.guidanceTitle}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-stretch">
        {insights.map((insight) => {
          let Icon = Sparkles;
          let bgClass = "bg-[#FAF8F5] text-[#8D7B68] border border-[#E8DFD8]";
          let borderClass = "border-[#E8DFD8]";

          if (insight.type === "positive") {
            Icon = CheckCircle2;
            bgClass = "bg-[#E8F3F1] text-[#76A8A1] border border-[#76A8A1]/20";
            borderClass = "border-[#76A8A1]/30";
          } else if (insight.type === "warning") {
            Icon = AlertCircle;
            bgClass = "bg-amber-50 text-amber-600 border border-amber-200";
            borderClass = "border-amber-200";
          }

          return (
            <div 
              key={insight.id} 
              className={`surface-elevated p-6 sm:p-8 rounded-3xl interactive-card flex items-start gap-5`}
            >
              <div className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-[1.25rem] ${bgClass} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                <Icon className="h-7 w-7 text-current" />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="font-black text-base sm:text-xl text-[#3D2B1F] tracking-tight">{insight.title}</h4>
                <p className="text-xs sm:text-base text-[#8D7B68] leading-relaxed font-semibold">{insight.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
