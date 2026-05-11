export type WellnessColorTone = {
  accent: string;
  softAccent: string;
  solidSoftAccent: string;
};

export const WELLNESS_COLORS = {
  sleep: {
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
    solidSoftAccent: "#e5f2fb",
  },
  exercise: {
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
    solidSoftAccent: "#dbecea",
  },
  diet: {
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
    solidSoftAccent: "#f8eede",
  },
  lifestyle: {
    accent: "var(--accent-strong)",
    softAccent: "var(--accent-soft)",
    solidSoftAccent: "#fbe4dd",
  },
} as const satisfies Record<string, WellnessColorTone>;

export const HEALTH_SUMMARY_CATEGORY_COLORS = {
  수면: WELLNESS_COLORS.sleep,
  "운동 회복": WELLNESS_COLORS.exercise,
  식단: WELLNESS_COLORS.diet,
  "생활 습관": WELLNESS_COLORS.lifestyle,
} as const;

export const TIME_SLOT_BADGE_COLORS = {
  Morning: {
    accent: "#D96C4F",
    softAccent: "#FBE4DD",
  },
  Midday: {
    accent: "#8B68B5",
    softAccent: "#EEE6F6",
  },
  Evening: {
    accent: "#9A6B46",
    softAccent: "#F1E3D7",
  },
} as const;
