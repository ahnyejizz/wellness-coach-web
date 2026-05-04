"use client";

import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";

export type GoalKey = "sleep-reset" | "fat-loss" | "muscle-tone" | "steady-energy";
export type FocusKey = "sleep" | "exercise" | "diet";
export type MealPatternKey = "balanced" | "protein-forward" | "gentle-balance";
export type BriefMetricKey = "sleep" | "exercise" | "diet";
export type BriefCompletionState = "" | "done" | "not-yet";
export type BriefRecoveryState = "" | "good" | "steady" | "low";

export type SleepBriefDetails = {
  sleepPrepRoutine: BriefCompletionState;
  screenOffTime: string;
  morningSunlight: BriefCompletionState;
  totalSleepDuration: string;
};

export type ExerciseBriefDetails = {
  strengthSessions: string;
  activeCalories: string;
  recoveryStatus: BriefRecoveryState;
  walkSessions: string;
};

export type DietBriefDetails = {
  proteinIntake: string;
  waterIntake: string;
  snackFrequency: string;
  lateNightSnackFrequency: string;
};

export type BriefDetails = {
  sleep: SleepBriefDetails;
  exercise: ExerciseBriefDetails;
  diet: DietBriefDetails;
};

export type PlanProfile = {
  name: string;
  goal: GoalKey;
  focus: FocusKey;
  bedtime: string;
  workoutDays: number;
  proteinTarget: number;
  waterTarget: number;
  mealPattern: MealPatternKey;
};

type WellnessPersistedState = {
  profile: PlanProfile;
  briefDetails: BriefDetails;
  activeFocus: FocusKey;
  lastSavedAt: string | null;
};

type UpdatePlanProfile = <Key extends keyof PlanProfile>(key: Key, value: PlanProfile[Key]) => void;
type UpdateBriefDetails = <Key extends BriefMetricKey>(key: Key, value: BriefDetails[Key]) => void;

type WellnessStore = WellnessPersistedState & {
  hasHydrated: boolean;
  setHydrated: (value: boolean) => void;
  updateProfile: UpdatePlanProfile;
  saveBriefDetails: UpdateBriefDetails;
  setActiveFocus: (focus: FocusKey) => void;
  saveProfile: () => void;
  resetProfile: () => void;
};

const STORAGE_KEY = "motive-care-planner-v1";
const MAX_BRIEF_TEXT_LENGTH = 24;

export const defaultPlanProfile: PlanProfile = {
  name: "",
  goal: "steady-energy",
  focus: "sleep",
  bedtime: "23:10",
  workoutDays: 4,
  proteinTarget: 110,
  waterTarget: 2.1,
  mealPattern: "balanced",
};

export const defaultBriefDetails: BriefDetails = {
  sleep: {
    sleepPrepRoutine: "",
    screenOffTime: "",
    morningSunlight: "",
    totalSleepDuration: "",
  },
  exercise: {
    strengthSessions: "",
    activeCalories: "",
    recoveryStatus: "",
    walkSessions: "",
  },
  diet: {
    proteinIntake: "",
    waterIntake: "",
    snackFrequency: "",
    lateNightSnackFrequency: "",
  },
};

const defaultPersistedState: WellnessPersistedState = {
  profile: defaultPlanProfile,
  briefDetails: defaultBriefDetails,
  activeFocus: defaultPlanProfile.focus,
  lastSavedAt: null,
};

const goalLabels = {
  "sleep-reset": "수면 리셋",
  "fat-loss": "체지방 감량",
  "muscle-tone": "탄탄한 몸 만들기",
  "steady-energy": "하루 에너지 안정화",
} satisfies Record<GoalKey, string>;

const focusLabels = {
  sleep: "수면",
  exercise: "운동",
  diet: "식단",
} satisfies Record<FocusKey, string>;

const mealPatternLabels = {
  balanced: "균형 식사",
  "protein-forward": "단백질 우선 식사",
  "gentle-balance": "부담 없는 식사",
} satisfies Record<MealPatternKey, string>;

function isGoalKey(value: unknown): value is GoalKey {
  return typeof value === "string" && value in goalLabels;
}

function isFocusKey(value: unknown): value is FocusKey {
  return typeof value === "string" && value in focusLabels;
}

function isMealPatternKey(value: unknown): value is MealPatternKey {
  return typeof value === "string" && value in mealPatternLabels;
}

export function clampWorkoutDays(value: number) {
  return Math.min(6, Math.max(2, value));
}

export function clampProteinTarget(value: number) {
  return Math.min(180, Math.max(60, value));
}

export function clampWaterTarget(value: number) {
  return Math.min(4, Math.max(1, value));
}

export function normalizePlanProfile(value: Partial<PlanProfile> | null | undefined): PlanProfile {
  const normalizedName =
    typeof value?.name === "string" && value.name.trim() ? value.name.trim() : defaultPlanProfile.name;

  return {
    name: normalizedName,
    goal: isGoalKey(value?.goal) ? value.goal : defaultPlanProfile.goal,
    focus: isFocusKey(value?.focus) ? value.focus : defaultPlanProfile.focus,
    bedtime: typeof value?.bedtime === "string" && value.bedtime ? value.bedtime : defaultPlanProfile.bedtime,
    workoutDays: clampWorkoutDays(
      Number.isFinite(value?.workoutDays) ? Number(value?.workoutDays) : defaultPlanProfile.workoutDays,
    ),
    proteinTarget: clampProteinTarget(
      Number.isFinite(value?.proteinTarget) ? Number(value?.proteinTarget) : defaultPlanProfile.proteinTarget,
    ),
    waterTarget: clampWaterTarget(
      Number.isFinite(value?.waterTarget) ? Number(value?.waterTarget) : defaultPlanProfile.waterTarget,
    ),
    mealPattern: isMealPatternKey(value?.mealPattern) ? value.mealPattern : defaultPlanProfile.mealPattern,
  };
}

function normalizeActiveFocus(value: unknown, fallback: FocusKey): FocusKey {
  return isFocusKey(value) ? value : fallback;
}

function normalizeBriefText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, MAX_BRIEF_TEXT_LENGTH);
}

function normalizeBriefCompletionState(value: unknown): BriefCompletionState {
  return value === "done" || value === "not-yet" ? value : "";
}

function normalizeBriefRecoveryState(value: unknown): BriefRecoveryState {
  return value === "good" || value === "steady" || value === "low" ? value : "";
}

function normalizeSleepBriefDetails(value: Partial<Record<keyof SleepBriefDetails, unknown>> | null | undefined): SleepBriefDetails {
  return {
    sleepPrepRoutine: normalizeBriefCompletionState(value?.sleepPrepRoutine),
    screenOffTime: normalizeBriefText(value?.screenOffTime),
    morningSunlight: normalizeBriefCompletionState(value?.morningSunlight),
    totalSleepDuration: normalizeBriefText(value?.totalSleepDuration),
  };
}

function normalizeExerciseBriefDetails(
  value: Partial<Record<keyof ExerciseBriefDetails, unknown>> | null | undefined,
): ExerciseBriefDetails {
  return {
    strengthSessions: normalizeBriefText(value?.strengthSessions),
    activeCalories: normalizeBriefText(value?.activeCalories),
    recoveryStatus: normalizeBriefRecoveryState(value?.recoveryStatus),
    walkSessions: normalizeBriefText(value?.walkSessions),
  };
}

function normalizeDietBriefDetails(value: Partial<Record<keyof DietBriefDetails, unknown>> | null | undefined): DietBriefDetails {
  return {
    proteinIntake: normalizeBriefText(value?.proteinIntake),
    waterIntake: normalizeBriefText(value?.waterIntake),
    snackFrequency: normalizeBriefText(value?.snackFrequency),
    lateNightSnackFrequency: normalizeBriefText(value?.lateNightSnackFrequency),
  };
}

function normalizeBriefDetails(value: Partial<Record<BriefMetricKey, unknown>> | null | undefined): BriefDetails {
  return {
    sleep: normalizeSleepBriefDetails(value?.sleep as Partial<Record<keyof SleepBriefDetails, unknown>> | null | undefined),
    exercise: normalizeExerciseBriefDetails(
      value?.exercise as Partial<Record<keyof ExerciseBriefDetails, unknown>> | null | undefined,
    ),
    diet: normalizeDietBriefDetails(value?.diet as Partial<Record<keyof DietBriefDetails, unknown>> | null | undefined),
  };
}

function normalizeLegacyBriefMetrics(value: Partial<Record<BriefMetricKey, unknown>> | null | undefined): BriefDetails {
  return {
    sleep: {
      ...defaultBriefDetails.sleep,
      totalSleepDuration: normalizeBriefText(value?.sleep),
    },
    exercise: {
      ...defaultBriefDetails.exercise,
      strengthSessions: normalizeBriefText(value?.exercise),
    },
    diet: {
      ...defaultBriefDetails.diet,
      proteinIntake: normalizeBriefText(value?.diet),
    },
  };
}

function parsePersistedValue(value: unknown): StorageValue<WellnessPersistedState> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    state?: Partial<WellnessPersistedState> & {
      briefMetrics?: Partial<Record<BriefMetricKey, unknown>>;
    };
  };

  if (candidate.state && typeof candidate.state === "object") {
    const profile = normalizePlanProfile(candidate.state.profile);

    return {
      state: {
        profile,
        briefDetails: candidate.state.briefDetails
          ? normalizeBriefDetails(candidate.state.briefDetails as Partial<Record<BriefMetricKey, unknown>> | null | undefined)
          : normalizeLegacyBriefMetrics(candidate.state.briefMetrics),
        activeFocus: normalizeActiveFocus(candidate.state.activeFocus, profile.focus),
        lastSavedAt: typeof candidate.state.lastSavedAt === "string" ? candidate.state.lastSavedAt : null,
      },
    };
  }

  const legacyProfile = normalizePlanProfile(candidate as Partial<PlanProfile>);

  return {
    state: {
      profile: legacyProfile,
      briefDetails: defaultBriefDetails,
      activeFocus: legacyProfile.focus,
      lastSavedAt: null,
    },
  };
}

const wellnessStorage: PersistStorage<WellnessPersistedState> | undefined =
  typeof window === "undefined"
    ? undefined
    : {
        getItem(name) {
          const raw = window.localStorage.getItem(name);

          if (!raw) {
            return null;
          }

          try {
            const parsed = JSON.parse(raw) as unknown;
            return parsePersistedValue(parsed);
          } catch {
            return null;
          }
        },
        setItem(name, value) {
          window.localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem(name) {
          window.localStorage.removeItem(name);
        },
      };

function mergePersistedState(persistedState: unknown, currentState: WellnessStore): WellnessStore {
  const snapshot = persistedState as
    | (Partial<WellnessPersistedState> & {
        briefMetrics?: Partial<Record<BriefMetricKey, unknown>>;
      })
    | undefined;
  const profile = normalizePlanProfile(snapshot?.profile);
  const activeFocus = normalizeActiveFocus(snapshot?.activeFocus, profile.focus);
  const briefDetails = snapshot?.briefDetails
    ? normalizeBriefDetails(snapshot.briefDetails as Partial<Record<BriefMetricKey, unknown>> | null | undefined)
    : normalizeLegacyBriefMetrics(snapshot?.briefMetrics);

  return {
    ...currentState,
    profile,
    briefDetails,
    activeFocus,
    lastSavedAt: typeof snapshot?.lastSavedAt === "string" ? snapshot.lastSavedAt : null,
  };
}

export const useWellnessStore = create<WellnessStore>()(
  persist(
    (set) => ({
      ...defaultPersistedState,
      hasHydrated: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      updateProfile: ((key, value) =>
        set((state) => {
          const nextProfile = normalizePlanProfile({
            ...state.profile,
            [key]: value,
          });

          return {
            profile: nextProfile,
            activeFocus: key === "focus" ? nextProfile.focus : state.activeFocus,
          };
        })) as UpdatePlanProfile,
      saveBriefDetails: ((key, value) =>
        set((state) => ({
          briefDetails: {
            ...state.briefDetails,
            [key]:
              key === "sleep"
                ? normalizeSleepBriefDetails(value as SleepBriefDetails)
                : key === "exercise"
                  ? normalizeExerciseBriefDetails(value as ExerciseBriefDetails)
                  : normalizeDietBriefDetails(value as DietBriefDetails),
          },
        }))) as UpdateBriefDetails,
      setActiveFocus: (focus) =>
        set((state) => ({
          activeFocus: focus,
          profile: {
            ...state.profile,
            focus,
          },
        })),
      saveProfile: () => set({ lastSavedAt: new Date().toISOString() }),
      resetProfile: () => set(defaultPersistedState),
    }),
    {
      name: STORAGE_KEY,
      storage: wellnessStorage,
      partialize: ({ profile, briefDetails, activeFocus, lastSavedAt }) => ({
        profile,
        briefDetails,
        activeFocus,
        lastSavedAt,
      }),
      merge: (persistedState, currentState) => mergePersistedState(persistedState, currentState),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function getGoalLabel(goal: GoalKey) {
  return goalLabels[goal];
}

export function getFocusLabel(focus: FocusKey) {
  return focusLabels[focus];
}

export function getMealPatternLabel(pattern: MealPatternKey) {
  return mealPatternLabels[pattern];
}

export function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getSavedPlanLabel(lastSavedAt: string | null, hasHydrated: boolean) {
  if (!hasHydrated) {
    return "저장된 플랜을 불러오는 중이에요.";
  }

  if (!lastSavedAt) {
    return "입력값은 브라우저에 자동으로 보관돼요.";
  }

  return `${formatSavedAt(lastSavedAt)} 기준 플랜이 저장되어 있어요.`;
}

export function getPlanDisplayName(name: string) {
  return name.trim() || "";
}
