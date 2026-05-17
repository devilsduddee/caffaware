import { apiFetch } from "./api";

export interface EstimationResult {
  name: string;
  estimatedMg: number;
  category: string;
  explanation: string;
  confidenceLevel?: string;
  servingSize?: string;
}

export async function estimateCustomDrink(input: string, language?: string): Promise<EstimationResult> {
  const text = input.toLowerCase().trim();
  if (!text) {
    return {
      name: language === "id" ? "Minuman Kustom" : "Custom Beverage",
      estimatedMg: 80,
      category: "Coffee",
      explanation: language === "id" ? "Perkiraan dasar untuk minuman yang belum spesifik." : "Default baseline estimation for unspecified beverage.",
      confidenceLevel: "Low confidence",
      servingSize: language === "id" ? "Sedang" : "Medium",
    };
  }

  try {
    const data = await apiFetch("/api/ai/parse-drink", {
      method: "POST",
      body: JSON.stringify({ text: input, language }),
    });

    if (data && data.result) {
      return {
        name: data.result.name || input,
        estimatedMg: data.result.estimatedMg || 90,
        category: data.result.category || "Coffee",
        explanation: data.result.explanation || (language === "id" ? `Diperkirakan berdasarkan ${input}.` : `Estimated based on ${input}.`),
        confidenceLevel: data.result.confidence_level || "Moderate confidence",
        servingSize: data.result.serving_size || (language === "id" ? "Sedang (Standar)" : "Medium (Standard)"),
      };
    }
  } catch (err) {
    console.warn("Gemini API fallback to rule-based estimation:", err);
  }

  // FALLBACK SYSTEM: CRITICAL DETERMINISTIC RULE-BASED ESTIMATION
  // 1. BASE DRINK TYPES & BASELINE MG
  let baseMg = 90; // Default coffee baseline
  let category = "Coffee";
  let matchedBase = language === "id" ? "Kopi Standar" : "Standard Coffee";

  if (text.includes("espresso") || text.includes("shot")) {
    baseMg = 63;
    category = "Coffee";
    matchedBase = "Espresso";
  } else if (text.includes("cold brew")) {
    baseMg = 155;
    category = "Coffee";
    matchedBase = "Cold Brew";
  } else if (text.includes("americano") || text.includes("long black")) {
    baseMg = 95;
    category = "Coffee";
    matchedBase = "Americano";
  } else if (text.includes("latte") || text.includes("cappuccino") || text.includes("flat white")) {
    baseMg = 77;
    category = "Coffee";
    matchedBase = text.includes("latte") ? "Latte" : text.includes("cappuccino") ? "Cappuccino" : "Flat White";
  } else if (text.includes("kopi susu") || text.includes("milk coffee") || text.includes("kopi")) {
    baseMg = 90;
    category = "Coffee";
    matchedBase = language === "id" ? "Kopi Susu" : "Milk Coffee (Kopi Susu)";
  } else if (text.includes("matcha") || text.includes("green tea")) {
    baseMg = 70;
    category = "Tea";
    matchedBase = language === "id" ? "Matcha / Teh Hijau" : "Matcha / Green Tea";
  } else if (text.includes("thai tea") || text.includes("black tea") || text.includes("earl grey") || text.includes("tea") || text.includes("teh")) {
    baseMg = 45;
    category = "Tea";
    matchedBase = language === "id" ? "Teh" : "Tea";
  } else if (text.includes("monster") || text.includes("red bull") || text.includes("energy")) {
    baseMg = 160;
    category = "Energy";
    matchedBase = text.includes("monster") ? "Monster Energy" : text.includes("red bull") ? "Red Bull" : (language === "id" ? "Minuman Energi" : "Energy Drink");
  } else if (text.includes("decaf")) {
    baseMg = 10;
    category = "Coffee";
    matchedBase = language === "id" ? "Kopi Decaf" : "Decaf Coffee";
  }

  // 2. SIZE MODIFIERS
  let sizeMultiplier = 1.0;
  let sizeLabel = language === "id" ? "Sedang (Standar)" : "Medium (Standard)";

  if (text.includes("small") || text.includes("short") || text.includes("piccolo") || text.includes("cup") || text.includes("kecil")) {
    sizeMultiplier = 0.85;
    sizeLabel = language === "id" ? "Kecil" : "Small";
  } else if (text.includes("large") || text.includes("grande") || text.includes("jumbo") || text.includes("venti") || text.includes("big") || text.includes("besar")) {
    sizeMultiplier = 1.35;
    sizeLabel = text.includes("jumbo") ? "Jumbo" : text.includes("venti") ? "Venti" : (language === "id" ? "Besar" : "Large");
  }

  // 3. SHOT / EXTRA MODIFIERS
  let extraMg = 0;
  let extraLabel = "";

  if (text.includes("double shot") || text.includes("2 shots") || text.includes("doppio")) {
    if (matchedBase !== "Espresso") {
      extraMg = 63; // Add an extra shot to base
      extraLabel = language === "id" ? " + Tambahan Espresso (+63mg)" : " + Extra Espresso Shot (+63mg)";
    } else {
      // If base was espresso, double shot means 2x base
      baseMg = 126;
      matchedBase = "Double Espresso";
    }
  } else if (text.includes("extra shot") || text.includes("triple shot") || text.includes("add shot") || text.includes("tambah shot")) {
    extraMg = text.includes("triple shot") ? 126 : 63;
    extraLabel = text.includes("triple shot") ? (language === "id" ? " + 2 Tambahan Shots (+126mg)" : " + 2 Extra Shots (+126mg)") : (language === "id" ? " + Tambahan Espresso (+63mg)" : " + Extra Espresso Shot (+63mg)");
  } else if (text.includes("half caff")) {
    sizeMultiplier *= 0.5;
    extraLabel = language === "id" ? " (Pengurangan Half Caff)" : " (Half Caff reduction)";
  }

  // Calculate final estimated Mg
  const calculatedMg = Math.round(baseMg * sizeMultiplier) + extraMg;
  const finalMg = Math.max(5, calculatedMg); // ensure at least 5mg

  // Build clean explainable reasoning string
  let explanation = language === "id" ? `Perkiraan Sistem: Basis ${matchedBase} (~${baseMg}mg)` : `Rule-based Fallback: Base: ${matchedBase} (~${baseMg}mg)`;
  if (sizeMultiplier !== 1.0) {
    explanation += language === "id" ? ` × ukuran ${sizeLabel} (${sizeMultiplier}x)` : ` × ${sizeLabel} size (${sizeMultiplier}x)`;
  }
  if (extraLabel) {
    explanation += extraLabel;
  }
  explanation += language === "id" ? ` = sekitar ${finalMg}mg kafein.` : ` = ~${finalMg}mg total estimated caffeine.`;

  // Format display name beautifully
  const formattedName = input
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    name: formattedName || (language === "id" ? "Minuman Kustom" : "Custom Beverage"),
    estimatedMg: finalMg,
    category,
    explanation,
    confidenceLevel: "Moderate confidence",
    servingSize: sizeLabel,
  };
}
