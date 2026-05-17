"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, ShieldCheck, Moon, Sparkles, ArrowRight, HeartPulse, Sparkle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFCFB] text-[#3D2B1F] relative overflow-hidden selection:bg-[#C6A49A]/20">
      {/* Emotional Ambient Lighting Glows */}
      <div className="glow-warm top-[-10%] left-[-5%]" />
      <div className="glow-sage top-[30%] right-[-5%]" />
      <div className="glow-coffee bottom-[10%] left-[20%]" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-[#F3EEEA]/60 transition-all duration-300">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F3EEEA] text-[#8D7B68] group-hover:bg-[#3D2B1F] group-hover:text-white transition-all duration-300 shadow-sm">
            <Coffee className="h-6 w-6" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#3D2B1F]">CaffAware</span>
        </div>
        <Link href="/login">
          <Button variant="ghost" className="interactive-btn-secondary px-6 py-5 rounded-2xl font-bold text-sm shadow-sm group">
            <span>{t.landing.signIn}</span>
            <ArrowRight className="h-4 w-4 ml-2 text-[#C6A49A] group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-16 sm:py-24 md:py-36 lg:py-48 text-center z-10">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-500 slide-in-from-bottom-4">
          <div className="inline-flex items-center gap-2.5 rounded-full glass-pill px-5 py-2 text-xs sm:text-sm font-bold text-[#8D7B68] tracking-wide uppercase shadow-sm">
            <Sparkles className="h-4 w-4 text-[#C6A49A]" />
            <span>{t.landing.badge}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[1.1] sm:leading-[1.08] text-[#3D2B1F]">
            {t.landing.heroTitle}
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-2xl text-[#8D7B68] leading-relaxed px-4 font-medium">
            {t.landing.heroSubtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-6 sm:pt-8 w-full px-4 sm:px-0">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="interactive-btn-primary w-full sm:w-auto h-16 px-10 sm:px-12 rounded-2xl text-base sm:text-lg font-extrabold flex items-center justify-center gap-3 shadow-xl group">
                <span>{t.landing.getStarted}</span>
                <Sparkle className="h-5 w-5 text-[#C6A49A] group-hover:rotate-12 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#C6A49A] px-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{t.landing.disclaimer}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Editorial Grid (Benefits Section) */}
      <section className="relative bg-white/60 backdrop-blur-3xl px-6 py-20 sm:py-28 md:py-36 border-t border-b border-[#F3EEEA] z-10">
        <div className="mx-auto max-w-7xl space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4">
            <h2 className="text-xs sm:text-sm font-bold text-[#C6A49A] tracking-[0.2em] uppercase">{t.landing.benefitsTag}</h2>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#3D2B1F] leading-tight">{t.landing.benefitsTitle}</h3>
          </div>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            <div className="surface-elevated p-8 sm:p-10 rounded-3xl interactive-card flex flex-col justify-between space-y-6 group hover:shadow-2xl hover:border-[#C6A49A]/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5EFE6] text-[#8D7B68] shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="h-7 w-7 text-[#C6A49A]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#3D2B1F]">{t.landing.feature1Title}</h3>
                <p className="text-[#8D7B68] leading-relaxed text-sm sm:text-base font-medium">
                  {t.landing.feature1Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-[#F3EEEA]/60 flex items-center gap-2 text-xs font-bold text-[#8D7B68] uppercase tracking-wider">
                <span>{t.landing.feature1Tag}</span>
              </div>
            </div>

            <div className="surface-elevated p-8 sm:p-10 rounded-3xl interactive-card flex flex-col justify-between space-y-6 group hover:shadow-2xl hover:border-[#C6A49A]/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF5F0] text-[#C6A49A] shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Moon className="h-7 w-7 text-[#C6A49A]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#3D2B1F]">{t.landing.feature3Title}</h3>
                <p className="text-[#8D7B68] leading-relaxed text-sm sm:text-base font-medium">
                  {t.landing.feature3Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-[#F3EEEA]/60 flex items-center gap-2 text-xs font-bold text-[#C6A49A] uppercase tracking-wider">
                <span>{t.landing.feature3Tag}</span>
              </div>
            </div>

            <div className="surface-elevated p-8 sm:p-10 rounded-3xl interactive-card flex flex-col justify-between space-y-6 sm:col-span-2 lg:col-span-1 group hover:shadow-2xl hover:border-[#76A8A1]/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3F1] text-[#76A8A1] shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-7 w-7 text-[#76A8A1]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#3D2B1F]">{t.landing.feature2Title}</h3>
                <p className="text-[#8D7B68] leading-relaxed text-sm sm:text-base font-medium">
                  {t.landing.feature2Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-[#F3EEEA]/60 flex items-center gap-2 text-xs font-bold text-[#76A8A1] uppercase tracking-wider">
                <span>{t.landing.feature2Tag}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (Cinematic Step Rhythm) */}
      <section className="relative px-6 py-20 sm:py-28 md:py-40 bg-[#FAF8F5] z-10">
        <div className="mx-auto max-w-6xl space-y-16 sm:space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#3D2B1F] leading-tight">{t.landing.howTitle}</h2>
            <p className="text-[#8D7B68] text-base sm:text-lg lg:text-xl font-medium leading-relaxed">{t.landing.howSubtitle}</p>
          </div>

          <div className="grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            <div className="surface-elevated p-8 sm:p-10 rounded-3xl space-y-6 interactive-card flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-5xl sm:text-6xl font-black text-[#C6A49A]/30 tracking-tighter group-hover:text-[#C6A49A] transition-colors duration-300">01</div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#3D2B1F]">{t.landing.step1Title}</h4>
                <p className="text-[#8D7B68] leading-relaxed font-medium text-sm sm:text-base">{t.landing.step1Desc}</p>
              </div>
              <div className="h-1.5 w-12 bg-[#C6A49A] rounded-full group-hover:w-full transition-all duration-300" />
            </div>

            <div className="surface-elevated p-8 sm:p-10 rounded-3xl space-y-6 interactive-card flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-5xl sm:text-6xl font-black text-[#8D7B68]/30 tracking-tighter group-hover:text-[#8D7B68] transition-colors duration-300">02</div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#3D2B1F]">{t.landing.step2Title}</h4>
                <p className="text-[#8D7B68] leading-relaxed font-medium text-sm sm:text-base">{t.landing.step2Desc}</p>
              </div>
              <div className="h-1.5 w-12 bg-[#8D7B68] rounded-full group-hover:w-full transition-all duration-300" />
            </div>

            <div className="surface-elevated p-8 sm:p-10 rounded-3xl space-y-6 interactive-card flex flex-col justify-between sm:col-span-2 lg:col-span-1 group hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-4">
                <div className="text-5xl sm:text-6xl font-black text-[#76A8A1]/30 tracking-tighter group-hover:text-[#76A8A1] transition-colors duration-300">03</div>
                <h4 className="text-xl sm:text-2xl font-bold text-[#3D2B1F]">{t.landing.step3Title}</h4>
                <p className="text-[#8D7B68] leading-relaxed font-medium text-sm sm:text-base">{t.landing.step3Desc}</p>
              </div>
              <div className="h-1.5 w-12 bg-[#76A8A1] rounded-full group-hover:w-full transition-all duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Quote/Experience */}
      <section className="relative px-6 py-24 sm:py-32 surface-dark-luxury text-[#FDFCFB] overflow-hidden z-10">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#C6A49A] rounded-full blur-[100px] sm:blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#76A8A1] rounded-full blur-[100px] sm:blur-[150px] opacity-15 pointer-events-none" />
        
        <div className="mx-auto max-w-4xl text-center space-y-8 sm:space-y-10 relative z-10 px-4">
          <HeartPulse className="h-10 w-10 sm:h-12 sm:w-12 text-[#C6A49A] mx-auto animate-pulse" />
          <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.3] sm:leading-[1.2] tracking-tight italic opacity-95">
            "{t.landing.quote}"
          </p>
          <div className="h-px w-16 sm:w-24 bg-[#F3EEEA]/30 mx-auto" />
          <p className="uppercase tracking-[0.3em] text-xs sm:text-sm font-bold text-[#C6A49A]">{t.landing.quoteTag}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-24 sm:py-36 md:py-48 bg-white text-center z-10 border-t border-[#F3EEEA]">
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12 px-4">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-[#3D2B1F] leading-[1.15] sm:leading-[1.1]">
            {t.landing.ctaTitle}
          </h2>
          <p className="text-base sm:text-xl lg:text-2xl text-[#8D7B68] font-medium max-w-2xl mx-auto leading-relaxed">
            {t.landing.ctaSubtitle}
          </p>
          <div className="pt-4 sm:pt-6 w-full px-4 sm:px-0">
            <Link href="/login" className="w-full sm:w-auto inline-block">
              <Button className="interactive-btn-primary w-full sm:w-auto h-16 sm:h-18 px-10 sm:px-14 rounded-2xl text-base sm:text-xl font-extrabold shadow-xl group">
                <span>{t.landing.ctaBtn}</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-3 text-[#C6A49A] group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 sm:py-14 border-t border-[#F3EEEA] bg-[#FDFCFB] text-[#8D7B68] text-xs sm:text-sm text-center z-10 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-6 sm:gap-4">
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-[#C6A49A]" />
          <span className="font-extrabold text-[#3D2B1F]">CaffAware AI</span>
        </div>
        <p className="font-medium px-4 sm:px-0">{t.landing.footerText}</p>
        <div className="flex items-center gap-6 text-xs font-bold text-[#C6A49A]">
          <span>{t.landing.privacy}</span>
          <span>{t.landing.terms}</span>
          <span>{t.landing.security}</span>
        </div>
      </footer>
    </div>
  );
}
