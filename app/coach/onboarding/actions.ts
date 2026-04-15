"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  exerciseExperienceOptions,
  mealStyleOptions,
  sleepPatternOptions,
  updateUserOnboarding,
  UserNotFoundError,
  type ExerciseExperience,
  type MealStyle,
  type SleepPattern,
} from "@/lib/auth/user-store";

const defaultCallbackUrl = "/coach";

const sleepPatternValues = sleepPatternOptions.map((option) => option.value);
const exerciseExperienceValues = exerciseExperienceOptions.map((option) => option.value);
const mealStyleValues = mealStyleOptions.map((option) => option.value);

function getFieldValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCallbackUrl(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return defaultCallbackUrl;
  }

  if (value.startsWith("/login") || value.startsWith("/signup") || value.startsWith("/coach/onboarding")) {
    return defaultCallbackUrl;
  }

  return value;
}

function buildOnboardingRedirect(options: {
  callbackUrl: string;
  error: string;
  values?: Record<string, string>;
  mode?: string;
}) {
  const params = new URLSearchParams({ error: options.error });

  if (options.callbackUrl !== defaultCallbackUrl) {
    params.set("callbackUrl", options.callbackUrl);
  }

  if (options.mode === "edit") {
    params.set("mode", "edit");
  }

  for (const [key, value] of Object.entries(options.values ?? {})) {
    if (value) {
      params.set(key, value);
    }
  }

  return `/coach/onboarding?${params.toString()}`;
}

function isSleepPattern(value: string): value is SleepPattern {
  return sleepPatternValues.includes(value as SleepPattern);
}

function isExerciseExperience(value: string): value is ExerciseExperience {
  return exerciseExperienceValues.includes(value as ExerciseExperience);
}

function isMealStyle(value: string): value is MealStyle {
  return mealStyleValues.includes(value as MealStyle);
}

export async function saveOnboardingAnswers(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    return redirect("/login?callbackUrl=/coach/onboarding");
  }

  const callbackUrl = normalizeCallbackUrl(getFieldValue(formData, "callbackUrl") || defaultCallbackUrl);
  const mode = getFieldValue(formData, "mode") === "edit" ? "edit" : "";
  const goalWeightRaw = getFieldValue(formData, "goalWeightKg");
  const sleepPattern = getFieldValue(formData, "sleepPattern");
  const exerciseExperience = getFieldValue(formData, "exerciseExperience");
  const mealStyle = getFieldValue(formData, "mealStyle");
  const persistedValues = {
    goalWeightKg: goalWeightRaw,
    sleepPattern,
    exerciseExperience,
    mealStyle,
  };

  if (!goalWeightRaw || !sleepPattern || !exerciseExperience || !mealStyle) {
    return redirect(
      buildOnboardingRedirect({
        callbackUrl,
        error: "missing_fields",
        values: persistedValues,
        mode,
      }),
    );
  }

  const parsedGoalWeight = Number.parseFloat(goalWeightRaw);

  if (!Number.isFinite(parsedGoalWeight) || parsedGoalWeight < 35 || parsedGoalWeight > 250) {
    return redirect(
      buildOnboardingRedirect({
        callbackUrl,
        error: "invalid_goal_weight",
        values: persistedValues,
        mode,
      }),
    );
  }

  if (!isSleepPattern(sleepPattern)) {
    return redirect(
      buildOnboardingRedirect({
        callbackUrl,
        error: "invalid_sleep_pattern",
        values: persistedValues,
        mode,
      }),
    );
  }

  if (!isExerciseExperience(exerciseExperience)) {
    return redirect(
      buildOnboardingRedirect({
        callbackUrl,
        error: "invalid_exercise_experience",
        values: persistedValues,
        mode,
      }),
    );
  }

  if (!isMealStyle(mealStyle)) {
    return redirect(
      buildOnboardingRedirect({
        callbackUrl,
        error: "invalid_meal_style",
        values: persistedValues,
        mode,
      }),
    );
  }

  try {
    await updateUserOnboarding({
      email: session.user.email,
      goalWeightKg: Math.round(parsedGoalWeight * 10) / 10,
      sleepPattern,
      exerciseExperience,
      mealStyle,
    });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return redirect("/signup");
    }

    throw error;
  }

  return redirect(callbackUrl);
}
