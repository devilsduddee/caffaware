import React, { useState } from "react";
import { X, Sparkles, Coffee, Check, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { estimateCustomDrink, EstimationResult } from "@/lib/drinkEstimation";
import { useLanguage } from "@/context/LanguageContext";

interface CustomDrinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, mg: number, category: string) => Promise<void>;
  loading: boolean;
}

const EXAMPLES = [
  "Es kopi susu gula aren medium",
  "Large iced americano",
  "Matcha latte less sugar",
  "Monster energy drink",
  "Double shot cappuccino",
  "Thai tea jumbo",
];

export const CustomDrinkModal: React.FC<CustomDrinkModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const { t, language } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [estimation, setEstimation] = useState<EstimationResult | null>(null);

  if (!isOpen) return null;

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const result = await estimateCustomDrink(inputText, language);
    setEstimation(result);
  };

  const handleExampleClick = async (example: string) => {
    setInputText(example);
    const result = await estimateCustomDrink(example, language);
    setEstimation(result);
  };

  const handleConfirmAdd = async () => {
    if (!estimation) return;
    await onConfirm(estimation.name, estimation.estimatedMg, estimation.category);
    // Reset state after success
    setInputText("");
    setEstimation(null);
    onClose();
  };

  const handleModalClose = () => {
    setInputText("");
    setEstimation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#3D2B1F]/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] surface-elevated p-8 sm:p-12 pb-20 sm:pb-12 shadow-[0_30px_80px_rgba(0,0,0,0.2)] border border-[#E8DFD8] space-y-8 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto mb-[env(safe-area-inset-bottom)] relative overflow-hidden">
        {/* Ambient Modal Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6A49A]/15 rounded-full blur-[80px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#F3EEEA]/80 pb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#F5EFE6] text-[#8D7B68] shadow-sm group hover:scale-105 transition-transform duration-300">
              <Sparkles className="h-7 w-7 text-[#C6A49A]" />
            </div>
            <div>
              <h3 className="font-black text-2xl sm:text-3xl text-[#3D2B1F] tracking-tight leading-none">{t.modals.customDrinkTitle}</h3>
              <p className="text-xs sm:text-sm text-[#8D7B68] mt-1.5 font-medium">{t.modals.customDrinkSub}</p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EFE6] text-[#8D7B68] hover:bg-[#3D2B1F] hover:text-white transition-colors duration-300 shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Input Area (If not estimated yet) */}
        {!estimation ? (
          <form onSubmit={handleEstimate} className="space-y-8 animate-in fade-in duration-300 relative z-10">
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider block">
                {t.modals.drinkNameLabel}
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.modals.inputPlaceholder}
                className="w-full h-16 rounded-2xl border border-[#E8DFD8] bg-[#FDFCFB] px-5 text-base sm:text-xl text-[#3D2B1F] placeholder-[#C6A49A] focus:border-[#C6A49A] focus:outline-none focus:ring-2 focus:ring-[#C6A49A]/30 transition-all duration-200 shadow-sm font-semibold"
                autoFocus
              />
            </div>

            {/* Quick Examples for Inspiration */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#C6A49A]" />
                <span>{language === "id" ? "Coba contoh alami berikut:" : "Try natural examples:"}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs font-bold bg-[#FAF8F5] border border-[#E8DFD8] text-[#8D7B68] hover:bg-[#3D2B1F] hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!inputText.trim()}
              className="interactive-btn-primary w-full h-16 rounded-2xl font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5 text-[#C6A49A]" />
              <span>{t.modals.parsingAI}</span>
            </Button>
          </form>
        ) : (
          /* Step 2: Confirmation Card */
          <div className="space-y-8 animate-in fade-in duration-300 pt-2 relative z-10">
            <div className="rounded-3xl bg-[#FAF8F5] p-8 border border-[#E8DFD8] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#F3EEEA]/80 pb-4">
                <span className="text-xs sm:text-sm font-extrabold text-[#8D7B68] uppercase tracking-wider">{t.modals.drinkMgLabel}</span>
                <span className="bg-[#E8F3F1] text-[#76A8A1] text-xs font-extrabold px-4 py-1.5 rounded-xl shadow-sm capitalize border border-[#76A8A1]/20">
                  {estimation.category} {language === "id" ? "Minuman" : "Beverage"}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-6xl sm:text-7xl font-black text-[#3D2B1F] tracking-tight">~{estimation.estimatedMg}</span>
                <span className="text-2xl font-extrabold text-[#8D7B68]">mg</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#F3EEEA]/80">
                <span className="text-xs font-extrabold text-[#8D7B68] uppercase tracking-wider block">{language === "id" ? "Nama Terinterpretasi" : "Interpreted Name"}</span>
                <p className="text-lg sm:text-xl font-black text-[#3D2B1F]">{estimation.name}</p>
              </div>

              {/* Explainable Reasoning */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] space-y-2 shadow-sm">
                <span className="text-[11px] font-extrabold text-[#8D7B68] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#C6A49A]" />
                  <span>{language === "id" ? "Rincian Estimasi AI" : "AI Hybrid Estimation Breakdown"}</span>
                </span>
                <p className="text-xs sm:text-sm text-[#3D2B1F] font-semibold leading-relaxed">
                  {estimation.explanation}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-2">
              <Button
                onClick={handleConfirmAdd}
                disabled={loading}
                className="interactive-btn-primary w-full h-16 rounded-2xl font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Check className="h-6 w-6 text-[#76A8A1]" />
                <span>{t.modals.addDrinkBtn}</span>
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setEstimation(null)}
                  variant="outline"
                  disabled={loading}
                  className="interactive-btn-secondary h-14 rounded-2xl font-bold text-sm shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>{t.common.edit}</span>
                </Button>
                <Button
                  onClick={handleModalClose}
                  variant="ghost"
                  disabled={loading}
                  className="text-[#C6A49A] hover:text-[#3D2B1F] hover:bg-[#F3EEEA] h-14 rounded-2xl font-bold text-sm transition-all duration-200"
                >
                  {t.common.cancel}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
