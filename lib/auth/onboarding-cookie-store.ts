import "server-only";

import { cookies } from "next/headers";

import {
  getUserProfileByEmail,
  type ExerciseExperience,
  type LocalUserProfile,
  type MealStyle,
  type SleepPattern,
} from "@/lib/auth/user-store";

type PersistedOnboardingProfile = {
  goalWeightKg: number;
  sleepPattern: SleepPattern;
  exerciseExperience: ExerciseExperience;
  mealStyle: MealStyle;
  completedOnboardingAt: string;
};

type OnboardingCookiePayload = Record<string, PersistedOnboardingProfile>;

const onboardingCookieName = "motive-care-onboarding";
const oneYearInSeconds = 60 * 60 * 24 * 365;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/*
파싱한 값이 우리가 기대하는 온보딩 저장 형태인지 검증
*/
function isPersistedOnboardingProfile(value: unknown): value is PersistedOnboardingProfile {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<PersistedOnboardingProfile>;

  return (
    typeof candidate.goalWeightKg === "number" &&
    typeof candidate.sleepPattern === "string" &&
    typeof candidate.exerciseExperience === "string" &&
    typeof candidate.mealStyle === "string" &&
    typeof candidate.completedOnboardingAt === "string"
  );
}

/*
쿠키에 저장된 base64url 문자열을 다시 객체로 풀어낸 뒤,
이메일 별 온보딩 정보 객체로 복원
*/
function parseOnboardingCookieValue(rawValue: string | undefined) {
  if (!rawValue) {
    return {} satisfies OnboardingCookiePayload;
  }

  try {
    const decodedValue = Buffer.from(rawValue, "base64url").toString("utf8"); // base64url 디코딩
    const parsedValue = JSON.parse(decodedValue) as unknown; // JSON 파싱

    // 객체인지 확인
    if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
      return {} satisfies OnboardingCookiePayload;
    }

    return Object.fromEntries(
      Object.entries(parsedValue)
        .filter(([email, value]) => !!email && isPersistedOnboardingProfile(value)) // 각 계정값이 올바른 형태인지 필터링
        .map(([email, value]) => [normalizeEmail(email), value]), // 이메일 normalize
    ) as OnboardingCookiePayload;
  } catch {
    return {} satisfies OnboardingCookiePayload;
  }
}

/*
이메일 별 온보딩 맵을 JSON 문자열로 만든 뒤,
쿠키에 안전하게 담을 수 있도록 base64url 문자열로 직렬화
*/
function serializeOnboardingCookieValue(payload: OnboardingCookiePayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/*
기존 사용자 프로필을 기준으로 유지하되,
아직 저장되지 않은 온보딩 필드만 쿠키에 남아 있던 값으로 보완해서 최종 프로필 생성
*/
function mergeUserProfile(
  localProfile: LocalUserProfile,
  persistedProfile: PersistedOnboardingProfile,
): LocalUserProfile {
  return {
    ...localProfile,
    goalWeightKg:
      typeof localProfile.goalWeightKg === "number" ? localProfile.goalWeightKg : persistedProfile.goalWeightKg,
    sleepPattern: localProfile.sleepPattern ?? persistedProfile.sleepPattern,
    exerciseExperience: localProfile.exerciseExperience ?? persistedProfile.exerciseExperience,
    mealStyle: localProfile.mealStyle ?? persistedProfile.mealStyle,
    completedOnboardingAt: localProfile.completedOnboardingAt ?? persistedProfile.completedOnboardingAt,
  };
}

/*
쿠키 전체에서 현재 이메일에 해당하는 온보딩 값만 찾아서 꺼내고,
저장된 값이 없으면 null 반환
*/
export async function getPersistedOnboardingProfile(email: string) {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(onboardingCookieName)?.value;
  const payload = parseOnboardingCookieValue(rawValue);

  return payload[normalizeEmail(email)] ?? null;
}

/*
현재 이메일에 해당하는 온보딩 값을 기존 쿠키 맵에 덮어써서
로그아웃 후 다시 로그인해도 같은 브라우저에서 이어서 복원할 수 있게 저장
*/
export async function savePersistedOnboardingProfile(input: {
  email: string;
  goalWeightKg: number;
  sleepPattern: SleepPattern;
  exerciseExperience: ExerciseExperience;
  mealStyle: MealStyle;
  completedOnboardingAt?: string;
}) {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(onboardingCookieName)?.value;
  const payload = parseOnboardingCookieValue(rawValue);
  const normalizedEmail = normalizeEmail(input.email);
  const persistedProfile: PersistedOnboardingProfile = {
    goalWeightKg: input.goalWeightKg,
    sleepPattern: input.sleepPattern,
    exerciseExperience: input.exerciseExperience,
    mealStyle: input.mealStyle,
    completedOnboardingAt: input.completedOnboardingAt ?? new Date().toISOString(),
  };

  payload[normalizedEmail] = persistedProfile;

  cookieStore.set(onboardingCookieName, serializeOnboardingCookieValue(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: oneYearInSeconds,
  });

  return persistedProfile;
}

/*
기본 사용자 프로필을 먼저 읽고,
쿠키에 남아 있던 온보딩 값이 있으면 비어 있는 필드만 보완한 최종 프로필 반환
*/
export async function getFinalUserProfileByEmail(email: string) {
  const localProfile = await getUserProfileByEmail(email);

  if (!localProfile) {
    return null;
  }

  const persistedProfile = await getPersistedOnboardingProfile(email);

  if (!persistedProfile) {
    return localProfile;
  }

  return mergeUserProfile(localProfile, persistedProfile);
}
