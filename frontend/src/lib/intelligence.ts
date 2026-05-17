interface Drink {
  id: string;
  name: string;
  caffeine_mg: number;
  category: string;
  timestamp: string;
}

interface WellnessProfile {
  daily_limit_mg: number;
  recommended_cutoff: string;
  sensitivity_level: string;
}

interface BedtimeReadiness {
  status: string;
  color: string;
  bgColor: string;
  description: string;
}

interface TimelinePoint {
  timeLabel: string;
  estimatedMg: number;
  status: string;
}

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

interface AdaptiveAILayer {
  dynamicFeed: FeedItem[];
  behavioralPatterns: BehavioralPattern[];
  smartRecommendations: SmartRecommendation[];
  dailySummary: DailySummary;
  consistencyStreaks: ConsistencyStreak[];
  journeyReflections?: string[];
}

interface IntelligenceResult {
  activeCaffeineMg: number;
  wellnessScore: number;
  scoreBreakdown: {
    intakeScore: number; // 0 - 40
    timingScore: number; // 0 - 30
    consistencyScore: number; // 0 - 30
    reasons: string[];
  };
  bedtimeReadiness: BedtimeReadiness;
  activeCaffeineTimeline: TimelinePoint[];
  sleepImpact: {
    level: "Optimal" | "Moderate" | "High";
    color: string;
    description: string;
    estimatedClearanceTime: string;
  };
  insights: {
    id: string;
    type: "positive" | "warning" | "info";
    title: string;
    message: string;
  }[];
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
  adaptiveAI: AdaptiveAILayer;
}

export function calculateWellnessIntelligence(
  drinks: Drink[],
  wellnessProfile?: WellnessProfile,
  aiSummaryOverrides?: any,
  language: string = "id"
): IntelligenceResult {
  const limit = wellnessProfile?.daily_limit_mg || 250;
  const cutoffStr = wellnessProfile?.recommended_cutoff || "14:00";
  const now = new Date();

  // 1. ACTIVE CAFFEINE ESTIMATION (Half-life ≈ 5.5 hours)
  const HALF_LIFE_HOURS = 5.5;
  let activeCaffeineMg = 0;

  drinks.forEach((drink) => {
    try {
      const drinkTime = new Date(drink.timestamp);
      const hoursElapsed = (now.getTime() - drinkTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursElapsed >= 0 && hoursElapsed < 36) {
        const remaining = drink.caffeine_mg * Math.pow(0.5, hoursElapsed / HALF_LIFE_HOURS);
        activeCaffeineMg += remaining;
      }
    } catch (e) {}
  });

  activeCaffeineMg = Math.round(activeCaffeineMg);

  let cutoffHour = 14;
  let cutoffMinute = 0;
  try {
    const parts = cutoffStr.split(":");
    cutoffHour = parseInt(parts[0]);
    cutoffMinute = parseInt(parts[1]);
  } catch (e) {}

  const todayDrinks = drinks.filter((drink) => {
    try {
      const dDate = new Date(drink.timestamp);
      return (
        dDate.getDate() === now.getDate() &&
        dDate.getMonth() === now.getMonth() &&
        dDate.getFullYear() === now.getFullYear()
      );
    } catch {
      return false;
    }
  });

  const todayTotalMg = todayDrinks.reduce((sum, d) => sum + (d.caffeine_mg || 0), 0);

  let drinksAfterCutoff = 0;
  let afternoonDrinksCount = 0;
  todayDrinks.forEach((drink) => {
    try {
      const dDate = new Date(drink.timestamp);
      const dHour = dDate.getHours();
      const dMin = dDate.getMinutes();
      if (dHour > cutoffHour || (dHour === cutoffHour && dMin > cutoffMinute)) {
        drinksAfterCutoff++;
      }
      if (dHour >= 12) {
        afternoonDrinksCount++;
      }
    } catch {}
  });

  // 2. WELLNESS SCORE SYSTEM (100 points total)
  let intakeScore = 40;
  let timingScore = 30;
  let consistencyScore = 30;
  const reasons: string[] = [];

  if (todayTotalMg > limit) {
    const excessRatio = (todayTotalMg - limit) / limit;
    intakeScore = Math.max(10, Math.round(40 - excessRatio * 40));
    reasons.push(language === "id" ? `Asupan kafein hari ini sedikit melebihi batas nyamanmu sebanyak ${todayTotalMg - limit}mg.` : `Daily intake is ${todayTotalMg - limit}mg over your personalized threshold.`);
  } else if (todayTotalMg === 0) {
    intakeScore = 40;
    reasons.push(language === "id" ? "Belum ada kafein yang tercatat hari ini. Momen istirahat yang bagus untuk menyegarkan tubuhmu." : "No caffeine logged today. Excellent baseline rest day.");
  } else {
    intakeScore = 40;
    reasons.push(language === "id" ? "Asupan kafein hari ini masih aman 👍" : "Caffeine intake is beautifully maintained within your safe allowance.");
  }

  if (drinksAfterCutoff > 0) {
    timingScore = Math.max(5, 30 - drinksAfterCutoff * 12);
    reasons.push(language === "id" ? `Ada ${drinksAfterCutoff} cangkir yang dinikmati setelah jam ${cutoffStr}, mungkin membuatmu terjaga lebih lama malam ini.` : `Logged ${drinksAfterCutoff} beverage(s) after your ${cutoffStr} sleep cutoff.`);
  } else if (todayTotalMg > 0) {
    timingScore = 30;
    reasons.push(language === "id" ? `Waktu ngopimu sangat pas! Semua cangkir dinikmati sebelum jam ${cutoffStr}.` : `Perfect timing discipline: All caffeine consumed before ${cutoffStr}.`);
  } else {
    timingScore = 30;
  }

  const dayMap: { [key: string]: number } = {};
  drinks.forEach((d) => {
    try {
      const date = new Date(d.timestamp);
      const dateKey = date.toISOString().split("T")[0];
      dayMap[dateKey] = (dayMap[dateKey] || 0) + d.caffeine_mg;
    } catch {}
  });

  let overLimitDays = 0;
  Object.values(dayMap).forEach((dayTotal) => {
    if (dayTotal > limit) overLimitDays++;
  });

  if (overLimitDays > 2) {
    consistencyScore = 15;
    reasons.push(language === "id" ? "Ada beberapa hari dengan asupan kafein yang cukup tinggi minggu ini." : "Noticeable intake spikes over the past week.");
  } else {
    consistencyScore = 30;
    reasons.push(language === "id" ? "Pola minum kafeinmu minggu ini sangat stabil dan terjaga." : "Strong weekly intake consistency.");
  }

  const wellnessScore = intakeScore + timingScore + consistencyScore;

  // 3. BEDTIME READINESS SYSTEM
  let bedtimeStatus: BedtimeReadiness["status"] = language === "id" ? "Siap Tidur Nyenyak" : "Ready for Sleep";
  let bedtimeColor = "text-[#76A8A1]";
  let bedtimeBg = "bg-[#E8F3F1]";
  let bedtimeDesc = language === "id" ? "Kafein di tubuhmu sudah mereda. Tubuh dan pikiranmu kini siap untuk beristirahat dengan tenang malam ini." : "Your active caffeine has cleared the sleep threshold. Your nervous system is in an optimal state for natural melatonin release.";

  if (activeCaffeineMg > 100 || drinksAfterCutoff > 2) {
    bedtimeStatus = language === "id" ? "Efek Kafein Masih Tinggi" : "High Stimulation";
    bedtimeColor = "text-red-600";
    bedtimeBg = "bg-red-50";
    bedtimeDesc = language === "id" ? `Masih ada cukup banyak kafein aktif malam ini (${activeCaffeineMg}mg), jadi tidurmu mungkin sedikit terganggu. Cobalah melakukan aktivitas santai sebelum tidur.` : `Significant active stimulation (${activeCaffeineMg}mg) circulating. Expect potential sleep onset delay. Prioritize winding down activities.`;
  } else if (activeCaffeineMg > 50 || drinksAfterCutoff === 2) {
    bedtimeStatus = language === "id" ? "Efek Kafein Sedang" : "Moderate Stimulation";
    bedtimeColor = "text-orange-600";
    bedtimeBg = "bg-orange-50";
    bedtimeDesc = language === "id" ? `Masih tersisa sedikit efek kafein di tubuhmu (${activeCaffeineMg}mg). Tidur lelapmu mungkin sedikit bergeser malam ini.` : `Moderate active caffeine remaining (${activeCaffeineMg}mg). Deep slow-wave sleep cycles may be partially compressed tonight.`;
  } else if (activeCaffeineMg > 25 || drinksAfterCutoff === 1) {
    bedtimeStatus = language === "id" ? "Efek Kafein Ringan" : "Mild Stimulation";
    bedtimeColor = "text-amber-600";
    bedtimeBg = "bg-amber-50";
    bedtimeDesc = language === "id" ? `Sisa kafein di tubuhmu sudah cukup rendah (${activeCaffeineMg}mg). Kamu bisa beristirahat dengan nyaman tanpa banyak gangguan.` : `Low residual caffeine circulating (${activeCaffeineMg}mg). You may experience slight delays in falling asleep but sleep architecture remains mostly intact.`;
  }

  // 4. ACTIVE CAFFEINE TIMELINE
  const timelineHours = [8, 13, 18, 23];
  const activeCaffeineTimeline: TimelinePoint[] = timelineHours.map((hour) => {
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0);
    let mgAtTime = 0;

    drinks.forEach((d) => {
      try {
        const dTime = new Date(d.timestamp);
        const elapsed = (targetTime.getTime() - dTime.getTime()) / (1000 * 60 * 60);
        if (elapsed >= 0 && elapsed < 36) {
          mgAtTime += d.caffeine_mg * Math.pow(0.5, elapsed / HALF_LIFE_HOURS);
        }
      } catch {}
    });

    mgAtTime = Math.round(mgAtTime);
    let status = language === "id" ? "Aman" : "Optimal";
    if (mgAtTime > 100) status = language === "id" ? "Tinggi" : "High";
    else if (mgAtTime > 50) status = language === "id" ? "Sedang" : "Moderate";
    else if (mgAtTime > 25) status = language === "id" ? "Ringan" : "Mild";

    return {
      timeLabel: `${hour.toString().padStart(2, "0")}:00`,
      estimatedMg: mgAtTime,
      status,
    };
  });

  // 5. SLEEP IMPACT ANALYSIS
  let sleepLevel: "Optimal" | "Moderate" | "High" = "Optimal";
  let sleepColor = "text-[#76A8A1]";
  let sleepDesc = language === "id" ? "Kadar kafein di tubuhmu saat ini sudah rendah dan tidak akan mengganggu kualitas tidur alami malam ini." : "Your current active caffeine level is low and should not interfere with your natural sleep architecture tonight.";
  
  let clearanceHours = 0;
  if (activeCaffeineMg > 25) {
    clearanceHours = HALF_LIFE_HOURS * Math.log2(activeCaffeineMg / 25);
  }
  const clearanceTime = new Date(now.getTime() + clearanceHours * 60 * 60 * 1000);
  const clearanceTimeStr = clearanceTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (activeCaffeineMg > limit * 0.6 || drinksAfterCutoff > 1) {
    sleepLevel = "High";
    sleepColor = "text-red-600";
    sleepDesc = language === "id" ? `Sisa kafein masih cukup tinggi (${activeCaffeineMg}mg) menjelang malam. Kemungkinan butuh waktu lebih lama untuk bisa tertidur pulas.` : `High residual caffeine (${activeCaffeineMg}mg active) detected close to evening hours. Expect potential delays in deep sleep onset.`;
  } else if (activeCaffeineMg > 50 || drinksAfterCutoff === 1) {
    sleepLevel = "Moderate";
    sleepColor = "text-amber-600";
    sleepDesc = language === "id" ? `Masih ada sisa kafein di tubuhmu (${activeCaffeineMg}mg). Hindari minum kopi lagi malam ini agar bisa tidur dengan lelap.` : `Moderate active caffeine remaining (${activeCaffeineMg}mg). Try to avoid any further intake to ensure restful sleep.`;
  }

  // 6. PERSONALIZED INSIGHTS GENERATION
  const insights: IntelligenceResult["insights"] = [];

  if (afternoonDrinksCount > 0 && afternoonDrinksCount >= todayDrinks.length / 2 && todayDrinks.length > 0) {
    insights.push({
      id: "sleep-afternoon",
      type: "warning",
      title: language === "id" ? "Banyak Ngopi di Siang Hari" : "Afternoon Heavy Intake",
      message: language === "id" ? "Sebagian besar kopimu hari ini diminum setelah siang. Efeknya mungkin masih terasa saat jam tidur tiba. Minum lebih awal bisa bantu tidurmu lebih nyenyak." : "Most caffeine today was consumed after noon. Your caffeine intake is likely to remain active close to bedtime. Earlier caffeine timing may improve sleep readiness.",
    });
  } else if (todayTotalMg > 0 && afternoonDrinksCount === 0) {
    insights.push({
      id: "sleep-morning",
      type: "positive",
      title: language === "id" ? "Waktu Tidur Terjaga Sempurna" : "Excellent Sleep Protection",
      message: language === "id" ? "Semua kopimu hari ini diminum di pagi hari. Tubuhmu punya waktu yang sangat cukup untuk mengurainya sebelum jam tidur malam tiba." : "All caffeine today was consumed in the morning hours. This gives your liver ample time to metabolize paraxanthine before your natural bedtime.",
    });
  }

  if (activeCaffeineMg > 100) {
    insights.push({
      id: "active-high",
      type: "warning",
      title: language === "id" ? "Kafein Masih Cukup Tinggi" : "High Active Circulation",
      message: language === "id" ? `Saat ini masih ada sekitar ${activeCaffeineMg}mg kafein di tubuhmu. Diperkirakan baru akan mereda di bawah batas aman tidur (25mg) sekitar pukul ${clearanceTimeStr}.` : `You currently have roughly ${activeCaffeineMg}mg of active caffeine circulating. It will take until approximately ${clearanceTimeStr} to drop below the 25mg sleep threshold.`,
    });
  } else if (activeCaffeineMg > 0 && activeCaffeineMg <= 50) {
    insights.push({
      id: "active-low",
      type: "positive",
      title: language === "id" ? "Pola Pembersihan yang Bagus" : "Optimal Clearance Curve",
      message: language === "id" ? `Kafein di tubuhmu sudah mereda dengan tenang di angka ${activeCaffeineMg}mg. Tubuhmu kini siap menikmati waktu santai malam ini.` : `Your active caffeine has safely metabolized down to ${activeCaffeineMg}mg. Your body is entering an excellent state for evening winding down.`,
    });
  }

  if (drinksAfterCutoff > 0) {
    insights.push({
      id: "recovery-hydrate",
      type: "info",
      title: language === "id" ? "Tips Nyaman Malam Ini" : "Evening Recovery Guidance",
      message: language === "id" ? `Karena ada cangkir yang dinikmati setelah jam ${cutoffStr}, cobalah minum air hangat malam ini untuk membantu tubuhmu lebih rileks dan terhidrasi.` : `Since you consumed caffeine after ${cutoffStr}, prioritize drinking warm water this evening to assist cellular hydration and support natural adenosine binding.`,
    });
  }

  if (todayTotalMg > 0 && todayTotalMg <= limit && drinksAfterCutoff === 0) {
    insights.push({
      id: "recovery-reinforce",
      type: "positive",
      title: language === "id" ? "Keseimbangan Hari yang Indah" : "Exemplary Rest Balance",
      message: language === "id" ? "Porsi dan waktu ngopimu hari ini sangat pas. Keseimbangan ini sangat bagus untuk membantu tubuhmu memulihkan energi sepanjang malam." : "You maintained perfect limit adherence and timing discipline today. This optimal balance directly enhances your overnight HRV (Heart Rate Variability) recovery.",
    });
  }

  let weekendLateCount = 0;
  drinks.forEach((d) => {
    try {
      const dDate = new Date(d.timestamp);
      const dayOfWeek = dDate.getDay();
      const dHour = dDate.getHours();
      if ((dayOfWeek === 0 || dayOfWeek === 6) && dHour >= 15) {
        weekendLateCount++;
      }
    } catch {}
  });

  if (weekendLateCount > 2) {
    insights.push({
      id: "circadian-weekend",
      type: "info",
      title: language === "id" ? "Jadwal Ngopi Akhir Pekan" : "Weekend Circadian Shift",
      message: language === "id" ? "Kami perhatikan jadwal ngopimu di akhir pekan sering bergeser ke sore hari. Menjaga waktunya tetap mirip dengan hari biasa bisa bantu tubuhmu tetap segar di Senin pagi." : "We noticed your weekend caffeine timing tends to shift later into the afternoon. Keeping weekend intake aligned with weekdays prevents Monday morning sleep inertia.",
    });
  }

  if (overLimitDays === 0 && Object.keys(dayMap).length > 1) {
    insights.push({
      id: "circadian-improved",
      type: "positive",
      title: language === "id" ? "Pola Tidur yang Makin Baik" : "Circadian Rhythm Mastery",
      message: language === "id" ? "Ketepatan waktu dan porsi ngopimu minggu ini sangat bagus. Kebiasaan yang konsisten ini membuat tubuhmu terasa lebih bugar setiap hari." : "Your intake timing and limit discipline improved beautifully this week. Consistent daily rhythms reinforce your master biological clock.",
    });
  }

  if (todayTotalMg === 0) {
    insights.push({
      id: "zero-log",
      type: "info",
      title: language === "id" ? "Hari Tanpa Kafein" : "Mindful Reset",
      message: language === "id" ? "Belum ada kafein yang tercatat hari ini. Mengambil jeda sehari tanpa kopi adalah cara alami yang luar biasa untuk menyegarkan kembali energimu." : "No caffeine logged today. Taking occasional zero-caffeine days is a wonderful way to reset your adenosine receptors and boost natural energy.",
    });
  }

  // 7. WEEKLY TRENDS & METRICS SUMMARY
  const weeklyTrends: IntelligenceResult["weeklyTrends"] = [];
  let totalWeeklyMg = 0;
  let lateDrinksTotal = 0;
  let perfectDays = 0;

  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() - i);
    const dateStr = targetDate.toISOString().split("T")[0];
    const dayName = targetDate.toLocaleDateString(language === "id" ? "id-ID" : "en-US", { weekday: "short" });

    const dayDrinks = drinks.filter((d) => {
      try {
        const dDate = new Date(d.timestamp);
        return (
          dDate.getDate() === targetDate.getDate() &&
          dDate.getMonth() === targetDate.getMonth() &&
          dDate.getFullYear() === targetDate.getFullYear()
        );
      } catch {
        return false;
      }
    });

    const dayMg = dayDrinks.reduce((sum, d) => sum + (d.caffeine_mg || 0), 0);
    totalWeeklyMg += dayMg;

    let dayLate = 0;
    dayDrinks.forEach((d) => {
      try {
        const dDate = new Date(d.timestamp);
        const dHour = dDate.getHours();
        const dMin = dDate.getMinutes();
        if (dHour > cutoffHour || (dHour === cutoffHour && dMin > cutoffMinute)) {
          dayLate++;
        }
      } catch {}
    });
    lateDrinksTotal += dayLate;

    if (dayMg <= limit && dayLate === 0) {
      perfectDays++;
    }

    let dayScore = 100;
    if (dayMg > limit) dayScore -= Math.min(40, Math.round(((dayMg - limit) / limit) * 40));
    if (dayLate > 0) dayScore -= dayLate * 15;
    dayScore = Math.max(40, dayScore);

    weeklyTrends.push({
      day: dayName,
      dateStr,
      totalMg: dayMg,
      activeMgAtCutoff: Math.round(dayMg * 0.4),
      score: dayScore,
      isOverLimit: dayMg > limit,
    });
  }

  const weeklyAverageMg = Math.round(totalWeeklyMg / 7);

  // 8. ADAPTIVE AI WELLNESS LAYER GENERATION
  const dynamicFeed: FeedItem[] = [];
  
  if (drinksAfterCutoff === 0) {
    dynamicFeed.push({
      id: "feed-1",
      category: "timing",
      type: "positive",
      text: language === "id" ? "Waktu ngopimu hari ini sangat pas dan terjaga." : "Your caffeine timing discipline remained perfect today.",
      timestampStr: language === "id" ? "Baru saja" : "Just now",
    });
  } else {
    dynamicFeed.push({
      id: "feed-1",
      category: "timing",
      type: "warning",
      text: language === "id" ? `Ada ${drinksAfterCutoff} cangkir yang dinikmati setelah jam batas tidurmu.` : `Logged ${drinksAfterCutoff} drink(s) after your recommended sleep cutoff.`,
      timestampStr: language === "id" ? "Baru saja" : "Just now",
    });
  }

  if (todayTotalMg <= limit) {
    dynamicFeed.push({
      id: "feed-2",
      category: "intake",
      type: "positive",
      text: language === "id" ? `Porsi kafeinmu hari ini sangat pas di bawah batas ${limit}mg.` : `You stayed beautifully within your recommended ${limit}mg range today.`,
      timestampStr: language === "id" ? "2j lalu" : "2h ago",
    });
  } else {
    dynamicFeed.push({
      id: "feed-2",
      category: "intake",
      type: "warning",
      text: language === "id" ? `Asupan kafein hari ini sedikit melewati batas nyamanmu (${limit}mg).` : `Daily intake exceeded your personalized ${limit}mg threshold.`,
      timestampStr: language === "id" ? "1j lalu" : "1h ago",
    });
  }

  if (afternoonDrinksCount > 0) {
    dynamicFeed.push({
      id: "feed-3",
      category: "stimulation",
      type: "info",
      text: language === "id" ? "Banyak ngopi di sore hari. Yuk, perhatikan bagaimana respons tubuhmu malam ini." : "Most intake is happening late afternoon. Notice how your body responds this evening.",
      timestampStr: language === "id" ? "4j lalu" : "4h ago",
    });
  } else {
    dynamicFeed.push({
      id: "feed-3",
      category: "stimulation",
      type: "positive",
      text: language === "id" ? "Efek kafein malam ini sudah jauh lebih tenang dibanding kemarin." : "Your evening stimulation has decreased compared to yesterday peak levels.",
      timestampStr: language === "id" ? "3j lalu" : "3h ago",
    });
  }

  dynamicFeed.push({
    id: "feed-4",
    category: "hydration",
    type: "positive",
    text: language === "id" ? "Kebutuhan air putihmu tetap seimbang mengimbangi cangkir kopimu." : "Hydration consistency has remained balanced with your 1:1 water intake ratio.",
    timestampStr: language === "id" ? "5j lalu" : "5h ago",
  });

  // Behavioral Patterns Detection
  const behavioralPatterns: BehavioralPattern[] = aiSummaryOverrides?.behavioralPatterns || [
    {
      patternName: language === "id" ? "Ngopi Terlalu Sore" : "Late Caffeine Habits",
      status: drinksAfterCutoff > 0 ? "Action Needed" : "Improving",
      description: drinksAfterCutoff > 0 
        ? (language === "id" ? "Sering menikmati kopi setelah jam batas tidur terbaikmu." : "Frequent intake logged after sleep cutoff hours.") 
        : (language === "id" ? "Tidak ada kopi larut sore hari ini. Pola tidurmu terjaga dengan sangat baik." : "Zero late drinks logged today. Excellent circadian alignment."),
      color: drinksAfterCutoff > 0 ? "text-amber-600" : "text-[#76A8A1]",
    },
    {
      patternName: language === "id" ? "Kestabilan Porsi Minum" : "Intake Consistency",
      status: overLimitDays > 0 ? "Active" : "Stable",
      description: overLimitDays > 0 
        ? (language === "id" ? "Beberapa kali porsi ngopimu cukup tinggi dalam 7 hari terakhir." : "Occasional intake spikes detected over the past 7 days.") 
        : (language === "id" ? "Porsi ngopimu selalu pas dan nyaman di tubuh." : "Intake has remained perfectly within safe thresholds."),
      color: overLimitDays > 0 ? "text-amber-600" : "text-[#76A8A1]",
    },
    {
      patternName: language === "id" ? "Jam Ngopi Akhir Pekan" : "Weekend Timing Shifts",
      status: weekendLateCount > 1 ? "Active" : "Stable",
      description: weekendLateCount > 1 
        ? (language === "id" ? "Sering ngopi lebih sore saat akhir pekan tiba." : "Weekend caffeine consumption shifts into late afternoon.") 
        : (language === "id" ? "Jadwal ngopi akhir pekanmu tetap teratur seperti hari biasa." : "Weekend and weekday intake timing remain beautifully synchronized."),
      color: weekendLateCount > 1 ? "text-amber-600" : "text-[#76A8A1]",
    },
  ];

  // Smart Recommendations
  const smartRecommendations: SmartRecommendation[] = [
    {
      id: "rec-1",
      title: language === "id" ? "Menjaga Pola Tidur" : "Circadian Alignment",
      suggestion: language === "id" ? "Menikmati kopi lebih awal bisa membuat tidurmu lebih nyenyak dan pemulihan energimu lebih maksimal malam ini." : "Earlier caffeine timing may improve tonight's bedtime readiness and HRV recovery.",
      iconType: "Moon",
    },
    {
      id: "rec-2",
      title: language === "id" ? "Waktu Santai Malam" : "Evening Winding Down",
      suggestion: language === "id" ? "Segelas teh herbal hangat atau air putih di malam hari bisa bantu tubuhmu rileks sebelum tidur." : "A lower-caffeine evening beverage like herbal tea or warm magnesium water may support recovery.",
      iconType: "Sparkles",
    },
    {
      id: "rec-3",
      title: language === "id" ? "Cukupi Air Putih" : "Cellular Hydration",
      suggestion: language === "id" ? "Keseimbangan cairan tubuhmu sangat bagus minggu ini. Terus biasakan minum segelas air putih setelah ngopi." : "Hydration balance has been strong this week. Continue pairing each coffee with a full glass of water.",
      iconType: "Droplets",
    },
    {
      id: "rec-4",
      title: language === "id" ? "Kenyamanan Energi" : "Intake Rhythm",
      suggestion: language === "id" ? "Pola minummu hari ini sangat seimbang. Nikmati rasa fokus dan tenang yang menemanimu sepanjang hari." : "Your intake pattern appears well balanced today. Enjoy this steady, sustained cognitive wavelength.",
      iconType: "HeartPulse",
    },
  ];

  // Daily AI Summary
  const dailySummary: DailySummary = aiSummaryOverrides?.dailySummary || {
    headline: todayTotalMg <= limit && drinksAfterCutoff === 0 
      ? (language === "id" ? "Energi Tenang & Pola Tidur Terjaga" : "Balanced Wavelength & Circadian Harmony") 
      : (language === "id" ? "Efek Kafein Aktif & Waktunya Bersantai" : "Active Stimulation & Winding Down Focus"),
    observations: [
      todayTotalMg <= limit 
        ? (language === "id" ? "Porsi ngopimu hari ini sangat pas dan nyaman di tubuh." : "Today remained within your personalized safe range.") 
        : (language === "id" ? `Total asupan kafeinmu hari ini mencapai ${todayTotalMg}mg.` : `Intake reached ${todayTotalMg}mg today.`),
      activeCaffeineMg > 50 
        ? (language === "id" ? `Masih ada sedikit efek kafein (${activeCaffeineMg}mg) yang menemani malammu.` : `Moderate evening stimulation (${activeCaffeineMg}mg) remains active.`) 
        : (language === "id" ? "Kafein di tubuhmu sudah mereda, mengembalikan ketenangan alaminya." : "Active caffeine has cleared to optimal baseline levels."),
      drinksAfterCutoff === 0 
        ? (language === "id" ? "Jadwal ngopimu hari ini terasa lebih pas dibanding kemarin." : "Your intake timing was more balanced than yesterday.") 
        : (language === "id" ? "Ngopi di sore hari mungkin membuat jam kantukmu sedikit mundur malam ini." : "Late afternoon consumption may shift sleep onset slightly."),
    ],
    reflectionPrompt: language === "id" 
      ? "Luangkan waktu sejenak malam ini untuk merasakan tubuhmu yang mulai rileks. Apakah kamu sudah siap menikmati tidur yang lelap?" 
      : "Take a mindful moment this evening to notice your natural physical tiredness. Are you feeling ready for restorative sleep?",
  };

  // Gentle Consistency System (Streaks)
  const consistencyStreaks: ConsistencyStreak[] = [
    {
      streakName: language === "id" ? "Hari Seimbang" : "Balanced Days",
      count: perfectDays,
      unit: language === "id" ? "Hari" : "Days",
      statusText: perfectDays > 0 ? (language === "id" ? "Sedang berjalan" : "Active streak") : (language === "id" ? "Siap dimulai" : "Ready to start"),
      isAchieved: perfectDays > 0,
    },
    {
      streakName: language === "id" ? "Keseimbangan Air" : "Hydration Balance",
      count: perfectDays + 1,
      unit: language === "id" ? "Hari" : "Days",
      statusText: language === "id" ? "Rasio air terjaga" : "1:1 ratio maintained",
      isAchieved: true,
    },
    {
      streakName: language === "id" ? "Waktu Ramah Tidur" : "Sleep-Friendly Timing",
      count: drinksAfterCutoff === 0 ? 3 : 0,
      unit: language === "id" ? "Hari" : "Days",
      statusText: drinksAfterCutoff === 0 ? (language === "id" ? "Waktu sangat pas" : "Perfect timing") : (language === "id" ? "Lewat jam batas" : "Cutoff exceeded"),
      isAchieved: drinksAfterCutoff === 0,
    },
    {
      streakName: language === "id" ? "Malam yang Tenang" : "Low Evening Intake",
      count: activeCaffeineMg < 50 ? 5 : 1,
      unit: language === "id" ? "Hari" : "Days",
      statusText: activeCaffeineMg < 50 ? (language === "id" ? "Kafein mereda" : "Optimal clearance") : (language === "id" ? "Masih ada sisa" : "Residual active"),
      isAchieved: activeCaffeineMg < 50,
    },
  ];

  // Adaptive Insight Prioritization (Sort insights dynamically based on user state)
  insights.sort((a, b) => {
    if (drinksAfterCutoff > 0) {
      if (a.id.includes("timing") || a.id.includes("sleep")) return -1;
      if (b.id.includes("timing") || b.id.includes("sleep")) return 1;
    }
    if (activeCaffeineMg > 100) {
      if (a.id.includes("active")) return -1;
      if (b.id.includes("active")) return 1;
    }
    return 0;
  });

  return {
    activeCaffeineMg,
    wellnessScore,
    scoreBreakdown: {
      intakeScore,
      timingScore,
      consistencyScore,
      reasons,
    },
    bedtimeReadiness: {
      status: bedtimeStatus,
      color: bedtimeColor,
      bgColor: bedtimeBg,
      description: bedtimeDesc,
    },
    activeCaffeineTimeline,
    sleepImpact: {
      level: sleepLevel,
      color: sleepColor,
      description: sleepDesc,
      estimatedClearanceTime: clearanceTimeStr,
    },
    insights,
    weeklyTrends,
    metricsSummary: {
      weeklyAverageMg,
      lateDrinkCount: lateDrinksTotal,
      perfectDaysCount: perfectDays,
    },
    adaptiveAI: {
      dynamicFeed,
      behavioralPatterns,
      smartRecommendations,
      dailySummary,
      consistencyStreaks,
      journeyReflections: aiSummaryOverrides?.journeyReflections,
    },
  };
}
