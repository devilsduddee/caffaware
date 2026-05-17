import React from "react";
import { User } from "firebase/auth";
import { Sun, Moon, Sunset, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardHeroProps {
  user: User | null;
  wellnessProfile: any;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ user }) => {
  const { t, language } = useLanguage();
  const firstName = user?.displayName?.split(" ")[0] || "";

  const getGreeting = () => {
    const hour = new Date().getHours();
    const isId = language === "id";
    if (hour < 12) return { text: isId ? "Selamat pagi" : "Good morning", icon: Sun, color: "text-[#8D7B68]" };
    if (hour < 18) return { text: isId ? "Selamat siang" : "Good afternoon", icon: Sunset, color: "text-[#C6A49A]" };
    return { text: isId ? "Selamat malam" : "Good evening", icon: Moon, color: "text-[#76A8A1]" };
  };

  const { text, icon: GreetingIcon, color } = getGreeting();

  return (
    <div className="py-4 sm:py-6 relative overflow-hidden">
      <div className="space-y-2.5 animate-in fade-in duration-500">
        <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider text-[#8D7B68] uppercase shadow-sm">
          <GreetingIcon className={`h-4 w-4 ${color}`} />
          <span>{text}</span>
          <span>•</span>
          <Sparkles className="h-3 w-3 text-[#C6A49A]" />
          <span className="text-[#C6A49A] lowercase font-semibold tracking-normal">{language === "id" ? "ritme sadar aktif" : "mindful rhythm active"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#3D2B1F] leading-[1.1]">
          {t.dashboard.heroGreeting}{firstName}
        </h1>
        <p className="text-[#8D7B68] text-base sm:text-lg lg:text-xl max-w-3xl font-medium leading-relaxed">
          {t.dashboard.heroSubtitle}
        </p>
      </div>
    </div>
  );
};
