import React, { useEffect, useRef, useState } from "react";
import { Moon, Sparkles, Check, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PremiumTimeSelectorProps {
  value: string; // "HH:MM" format, e.g. "23:00"
  onChange: (time: string) => void;
}

const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export const PremiumTimeSelector: React.FC<PremiumTimeSelectorProps> = ({ value, onChange }) => {
  const { t } = useLanguage();
  const [hours, setHours] = useState<number>(23);
  const [minutes, setMinutes] = useState<number>(0);

  const PRESETS = [
    { label: "21:00", sub: "9 PM", value: "21:00", tag: t.timeSelector.presets.earlyWind, desc: t.timeSelector.presets.descEarly },
    { label: "22:00", sub: "10 PM", value: "22:00", tag: t.timeSelector.presets.circadianAnchor, desc: t.timeSelector.presets.descCircadian },
    { label: "23:00", sub: "11 PM", value: "23:00", tag: t.timeSelector.presets.standardAdult, desc: t.timeSelector.presets.descStandard },
    { label: "00:00", sub: "12 AM", value: "00:00", tag: t.timeSelector.presets.midnightRest, desc: t.timeSelector.presets.descMidnight },
  ];

  // Sync state when value prop changes externally
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        setHours(h);
        setMinutes(m);
      }
    }
  }, [value]);

  const hourContainerRef = useRef<HTMLDivElement>(null);
  const minuteContainerRef = useRef<HTMLDivElement>(null);
  const presetsContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getFormattedTime = (h: number, m: number) => {
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const format12Hour = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const mm = m.toString().padStart(2, "0");
    return `${displayH}:${mm} ${period}`;
  };

  const updateTime = (newH: number, newM: number) => {
    const cleanH = (newH + 24) % 24;
    const cleanM = (newM + 60) % 60;
    setHours(cleanH);
    setMinutes(cleanM);
    onChange(getFormattedTime(cleanH, cleanM));
  };

  // Scroll Helpers (Item height is 48px)
  const scrollToHour = (h: number, smooth = true) => {
    if (!hourContainerRef.current) return;
    isProgrammaticScroll.current = true;
    hourContainerRef.current.scrollTo({
      top: h * 48,
      behavior: smooth ? "smooth" : "auto",
    });
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 400);
  };

  const scrollToMinute = (m: number, smooth = true) => {
    if (!minuteContainerRef.current) return;
    isProgrammaticScroll.current = true;
    let index = MINUTE_OPTIONS.indexOf(m);
    if (index === -1) {
      let closestDiff = 999;
      MINUTE_OPTIONS.forEach((opt, idx) => {
        const diff = Math.abs(opt - m);
        if (diff < closestDiff) {
          closestDiff = diff;
          index = idx;
        }
      });
    }
    minuteContainerRef.current.scrollTo({
      top: index * 48,
      behavior: smooth ? "smooth" : "auto",
    });
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 400);
  };

  // Initial scroll positioning on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToHour(hours, false);
      scrollToMinute(minutes, false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll event handlers for native wheel snapping
  const handleHourScroll = () => {
    if (isProgrammaticScroll.current) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!hourContainerRef.current) return;
      const scrollTop = hourContainerRef.current.scrollTop;
      const index = Math.round(scrollTop / 48);
      const newH = Math.min(23, Math.max(0, index));
      if (newH !== hours) {
        setHours(newH);
        onChange(getFormattedTime(newH, minutes));
      }
    }, 150);
  };

  const handleMinuteScroll = () => {
    if (isProgrammaticScroll.current) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!minuteContainerRef.current) return;
      const scrollTop = minuteContainerRef.current.scrollTop;
      const index = Math.round(scrollTop / 48);
      const validIndex = Math.min(MINUTE_OPTIONS.length - 1, Math.max(0, index));
      const newM = MINUTE_OPTIONS[validIndex];
      if (newM !== minutes) {
        setMinutes(newM);
        onChange(getFormattedTime(hours, newM));
      }
    }, 150);
  };

  // Tactile Button Handlers
  const handlePresetClick = (presetValue: string) => {
    const [h, m] = presetValue.split(":").map(Number);
    updateTime(h, m);
    scrollToHour(h, true);
    scrollToMinute(m, true);
  };

  const handleStepMinute = (delta: number) => {
    const newM = (minutes + delta + 60) % 60;
    updateTime(hours, newM);
    scrollToMinute(newM, true);
  };

  const handleSelectHourClick = (h: number) => {
    updateTime(h, minutes);
    scrollToHour(h, true);
  };

  const handleSelectMinuteClick = (m: number) => {
    updateTime(hours, m);
    scrollToMinute(m, true);
  };

  // Horizontal Presets Scroll Helpers for Desktop
  const scrollPresets = (direction: "left" | "right") => {
    if (!presetsContainerRef.current) return;
    const scrollAmount = direction === "left" ? -180 : 180;
    presetsContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handlePresetsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollBy({ left: e.deltaY, behavior: "smooth" });
    }
  };

  // Dynamic biological description matching
  const currentPreset = PRESETS.find((p) => p.value === value);
  const biologicalDesc = currentPreset?.desc || t.timeSelector.presets.defaultBioDesc;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300 w-full max-w-md mx-auto">
      {/* 1. UNIFIED HERO TIME DISPLAY & COMPACT WHEEL HUB */}
      <div className="surface-elevated p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-[#E8DFD8] shadow-sm space-y-4 sm:space-y-6 relative overflow-hidden group hover:border-[#C6A49A]/50 transition-all duration-300">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C6A49A]/10 rounded-full blur-[50px] pointer-events-none" />

        {/* Hero Time Display Header */}
        <div className="flex items-center justify-between border-b border-[#F3EEEA]/80 pb-4 sm:pb-6 relative z-10">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[1rem] sm:rounded-[1.25rem] bg-[#3D2B1F] text-[#C6A49A] shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-[#FAF8F5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-2 w-2 rounded-full bg-[#76A8A1] animate-pulse shadow-xs" />
                <span className="text-[10px] sm:text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider">{t.timeSelector.activeSleepTarget}</span>
              </div>
              <h3 className="font-black text-2xl sm:text-4xl text-[#3D2B1F] tracking-tight mt-0.5">
                {format12Hour(hours, minutes)}
              </h3>
            </div>
          </div>

          <div className="text-right bg-[#FAF8F5] border border-[#E8DFD8] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[#8D7B68] block uppercase tracking-wider">{t.timeSelector.bioClock}</span>
            <span className="text-sm sm:text-lg font-black text-[#3D2B1F]">{getFormattedTime(hours, minutes)}</span>
          </div>
        </div>

        {/* Dual Touch-Optimized Compact Scroll Wheels (h-36 / 144px) */}
        <div className="bg-[#FAF8F5] border border-[#E8DFD8] rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-6 shadow-inner relative overflow-hidden z-10">
          {/* Central Glassmorphism Highlight Overlay (h-12 / 48px) */}
          <div className="absolute top-[52px] sm:top-[72px] left-3 right-3 sm:left-4 sm:right-4 h-12 bg-[#C6A49A]/15 border-y-2 border-[#C6A49A]/40 rounded-xl pointer-events-none shadow-xs z-10 backdrop-blur-[1px]" />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-20">
            {/* HOURS WHEEL */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[#8D7B68] uppercase tracking-wider mb-1.5 sm:mb-2">{t.timeSelector.hour}</span>
              <div 
                ref={hourContainerRef}
                onScroll={handleHourScroll}
                className="w-full h-36 overflow-y-auto scrollbar-none snap-y snap-mandatory py-[48px] px-1 sm:px-2 space-y-0 relative border-y border-[#E8DFD8]/60 bg-white/50 rounded-xl sm:rounded-2xl shadow-xs"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => {
                  const isSelected = h === hours;
                  return (
                    <div
                      key={h}
                      onClick={() => handleSelectHourClick(h)}
                      className={`h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 select-none ${
                        isSelected 
                          ? "text-xl sm:text-3xl font-black text-[#3D2B1F] scale-110" 
                          : "text-sm sm:text-lg font-bold text-[#8D7B68]/50 hover:text-[#8D7B68]"
                      }`}
                    >
                      {h.toString().padStart(2, "0")}
                      {isSelected && <span className="text-[9px] sm:text-[10px] font-extrabold text-[#C6A49A] ml-1 absolute right-2 sm:right-3 hidden sm:inline">h</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MINUTES WHEEL */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[#8D7B68] uppercase tracking-wider mb-1.5 sm:mb-2">{t.timeSelector.minute}</span>
              <div 
                ref={minuteContainerRef}
                onScroll={handleMinuteScroll}
                className="w-full h-36 overflow-y-auto scrollbar-none snap-y snap-mandatory py-[48px] px-1 sm:px-2 space-y-0 relative border-y border-[#E8DFD8]/60 bg-white/50 rounded-xl sm:rounded-2xl shadow-xs"
              >
                {MINUTE_OPTIONS.map((m) => {
                  const isSelected = m === minutes;
                  return (
                    <div
                      key={m}
                      onClick={() => handleSelectMinuteClick(m)}
                      className={`h-12 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 select-none ${
                        isSelected 
                          ? "text-xl sm:text-3xl font-black text-[#3D2B1F] scale-110" 
                          : "text-sm sm:text-lg font-bold text-[#8D7B68]/50 hover:text-[#8D7B68]"
                      }`}
                    >
                      {m.toString().padStart(2, "0")}
                      {isSelected && <span className="text-[9px] sm:text-[10px] font-extrabold text-[#C6A49A] ml-1 absolute right-2 sm:right-3 hidden sm:inline">m</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sleek Micro-Adjustment Stepper Bar */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#E8DFD8]/80 flex items-center justify-between gap-2 sm:gap-3 relative z-20">
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[#8D7B68] uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#C6A49A]" />
              <span>{t.timeSelector.microStep}</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E8DFD8] shadow-xs">
              <button
                onClick={() => handleStepMinute(-15)}
                className="px-2 py-1 sm:px-2.5 rounded-lg hover:bg-[#FAF8F5] text-[11px] sm:text-xs font-extrabold text-[#3D2B1F] transition-all duration-200 active:scale-95"
              >
                -15m
              </button>
              <button
                onClick={() => handleStepMinute(-1)}
                className="px-2 py-1 sm:px-2.5 rounded-lg hover:bg-[#FAF8F5] text-[11px] sm:text-xs font-extrabold text-[#3D2B1F] transition-all duration-200 active:scale-95"
              >
                -1m
              </button>
              <button
                onClick={() => handleStepMinute(1)}
                className="px-2 py-1 sm:px-2.5 rounded-lg hover:bg-[#FAF8F5] text-[11px] sm:text-xs font-extrabold text-[#3D2B1F] transition-all duration-200 active:scale-95"
              >
                +1m
              </button>
              <button
                onClick={() => handleStepMinute(15)}
                className="px-2 py-1 sm:px-2.5 rounded-lg hover:bg-[#FAF8F5] text-[11px] sm:text-xs font-extrabold text-[#3D2B1F] transition-all duration-200 active:scale-95"
              >
                +15m
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIGHTWEIGHT BIOLOGICAL ANCHOR PILLS (HORIZONTALLY SCROLLABLE WITH DESKTOP CONTROLS) */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#C6A49A]" />
            <span>{t.timeSelector.bioAnchor}</span>
          </label>

          {/* Desktop Left/Right Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xl p-0.5 shadow-xs">
            <button
              onClick={() => scrollPresets("left")}
              className="p-1 hover:bg-white rounded-lg text-[#8D7B68] hover:text-[#3D2B1F] transition-colors duration-200"
              title="Scroll Left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollPresets("right")}
              className="p-1 hover:bg-white rounded-lg text-[#8D7B68] hover:text-[#3D2B1F] transition-colors duration-200"
              title="Scroll Right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div 
          ref={presetsContainerRef}
          onWheel={handlePresetsWheel}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
        >
          {PRESETS.map((preset) => {
            const isSelected = value === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={`flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border transition-all duration-300 snap-start shrink-0 ${
                  isSelected 
                    ? "bg-[#3D2B1F] border-[#3D2B1F] text-white shadow-sm scale-[1.02]" 
                    : "bg-white border-[#E8DFD8] hover:border-[#C6A49A] text-[#3D2B1F] hover:bg-[#FAF8F5] shadow-xs"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#76A8A1]" />}
                <div className="text-left">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-xs sm:text-sm tracking-tight">{preset.label}</span>
                    <span className={`text-[9px] sm:text-[10px] font-extrabold ${isSelected ? "text-[#E8DFD8]" : "text-[#8D7B68]"}`}>({preset.sub})</span>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-bold block ${isSelected ? "text-[#76A8A1]" : "text-[#8D7B68]"}`}>
                    {preset.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SUPPORTING BIOLOGICAL EXPLANATION */}
      <div className="bg-[#FAF8F5] border border-[#E8DFD8] p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-xs flex items-start gap-2.5 sm:gap-3">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-white text-[#C6A49A] shadow-xs shrink-0 mt-0.5 border border-[#E8DFD8]">
          <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#3D2B1F]" />
        </div>
        <p className="text-[11px] sm:text-sm text-[#8D7B68] leading-relaxed font-semibold">
          {biologicalDesc}
        </p>
      </div>
    </div>
  );
};
