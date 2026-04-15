import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const wellnessFocusOptions = [
  { value: "balance", label: "수면 · 운동 · 식단 균형" },
  { value: "sleep", label: "수면 회복 우선" },
  { value: "exercise", label: "운동 루틴 우선" },
  { value: "diet", label: "식단 안정 우선" },
] as const;

export const sleepPatternOptions = [
  { value: "early-rhythm", label: "일찍 자고 일찍 일어나는 편" },
  { value: "steady-rhythm", label: "평일과 주말이 비교적 일정한 편" },
  { value: "night-owl", label: "늦게 자는 편" },
  { value: "irregular", label: "수면 시간이 자주 흔들리는 편" },
] as const;

export const exerciseExperienceOptions = [
  { value: "beginner", label: "운동이 거의 처음이에요" },
  { value: "returning", label: "예전에 하다가 다시 시작해요" },
  { value: "consistent", label: "주 2~4회 꾸준히 운동해요" },
  { value: "advanced", label: "운동 루틴이 이미 익숙해요" },
] as const;

export const mealStyleOptions = [
  { value: "balanced", label: "균형 식사를 가장 선호해요" },
  { value: "protein-forward", label: "단백질 중심으로 챙기는 편이에요" },
  { value: "comfort-first", label: "간편하고 부담 없는 식사가 좋아요" },
  { value: "plant-forward", label: "채소와 가벼운 식사를 선호해요" },
] as const;

export type WellnessFocus = (typeof wellnessFocusOptions)[number]["value"];
export type SleepPattern = (typeof sleepPatternOptions)[number]["value"];
export type ExerciseExperience = (typeof exerciseExperienceOptions)[number]["value"];
export type MealStyle = (typeof mealStyleOptions)[number]["value"];

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  focus: WellnessFocus;
  goalWeightKg?: number;
  sleepPattern?: SleepPattern;
  exerciseExperience?: ExerciseExperience;
  mealStyle?: MealStyle;
  completedOnboardingAt?: string;
  createdAt: string;
  loginCount?: number;
  lastLoginAt?: string;
};

export type LocalUserProfile = Omit<StoredUser, "passwordHash">;

export class DuplicateUserError extends Error {
  constructor() {
    super("A user with this email already exists.");
    this.name = "DuplicateUserError";
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("No user found for the provided email.");
    this.name = "UserNotFoundError";
  }
}

const usersFilePath = process.env.VERCEL
  ? path.join("/tmp", "motive-care-users.json")
  : path.join(process.cwd(), "data", "users.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sanitizeUser(user: StoredUser): LocalUserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    focus: user.focus,
    goalWeightKg: user.goalWeightKg,
    sleepPattern: user.sleepPattern,
    exerciseExperience: user.exerciseExperience,
    mealStyle: user.mealStyle,
    completedOnboardingAt: user.completedOnboardingAt,
    createdAt: user.createdAt,
    loginCount: user.loginCount ?? 0,
    lastLoginAt: user.lastLoginAt,
  };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, storedPasswordHash: string) {
  const [salt, storedKeyHex] = storedPasswordHash.split(":");

  if (!salt || !storedKeyHex) {
    return false;
  }

  const storedKey = Buffer.from(storedKeyHex, "hex");
  const derivedKey = scryptSync(password, salt, storedKey.length || 64);

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}

async function readUsers() {
  try {
    const raw = await readFile(usersFilePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch (error) {
    const candidate = error as NodeJS.ErrnoException;

    if (candidate.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeUsers(users: StoredUser[]) {
  await mkdir(path.dirname(usersFilePath), { recursive: true });
  await writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export function getWellnessFocusLabel(focus: WellnessFocus) {
  const match = wellnessFocusOptions.find((option) => option.value === focus);
  return match?.label ?? wellnessFocusOptions[0].label;
}

export function getSleepPatternLabel(pattern: SleepPattern) {
  const match = sleepPatternOptions.find((option) => option.value === pattern);
  return match?.label ?? sleepPatternOptions[0].label;
}

export function getExerciseExperienceLabel(experience: ExerciseExperience) {
  const match = exerciseExperienceOptions.find((option) => option.value === experience);
  return match?.label ?? exerciseExperienceOptions[0].label;
}

export function getMealStyleLabel(style: MealStyle) {
  const match = mealStyleOptions.find((option) => option.value === style);
  return match?.label ?? mealStyleOptions[0].label;
}

export function hasCompletedOnboarding(
  user:
    | Pick<StoredUser, "goalWeightKg" | "sleepPattern" | "exerciseExperience" | "mealStyle" | "completedOnboardingAt">
    | null
    | undefined,
): user is {
  goalWeightKg: number;
  sleepPattern: SleepPattern;
  exerciseExperience: ExerciseExperience;
  mealStyle: MealStyle;
  completedOnboardingAt: string;
} {
  return Boolean(
    user &&
    typeof user.goalWeightKg === "number" &&
    user.sleepPattern &&
    user.exerciseExperience &&
    user.mealStyle &&
    user.completedOnboardingAt,
  );
}

export async function getUserProfileByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  const user = users.find((candidate) => candidate.email === normalizedEmail);

  return user ? sanitizeUser(user) : null;
}

export async function registerUser(input: { name: string; email: string; password: string; focus: WellnessFocus }) {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(input.email);

  if (users.some((candidate) => candidate.email === normalizedEmail)) {
    throw new DuplicateUserError();
  }

  const nextUser: StoredUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(input.password),
    focus: input.focus,
    createdAt: new Date().toISOString(),
    loginCount: 0,
  };

  users.push(nextUser);
  await writeUsers(users);

  return sanitizeUser(nextUser);
}

export async function updateUserOnboarding(input: {
  email: string;
  goalWeightKg: number;
  sleepPattern: SleepPattern;
  exerciseExperience: ExerciseExperience;
  mealStyle: MealStyle;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const users = await readUsers();
  const userIndex = users.findIndex((candidate) => candidate.email === normalizedEmail);

  if (userIndex < 0) {
    throw new UserNotFoundError();
  }

  const nextUser: StoredUser = {
    ...users[userIndex],
    goalWeightKg: input.goalWeightKg,
    sleepPattern: input.sleepPattern,
    exerciseExperience: input.exerciseExperience,
    mealStyle: input.mealStyle,
    completedOnboardingAt: new Date().toISOString(),
  };

  users[userIndex] = nextUser;
  await writeUsers(users);

  return sanitizeUser(nextUser);
}

export async function verifyUserCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  const userIndex = users.findIndex((candidate) => candidate.email === normalizedEmail);
  const user = userIndex >= 0 ? users[userIndex] : undefined;

  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  const nextUser: StoredUser = {
    ...user,
    loginCount: (user.loginCount ?? 0) + 1,
    lastLoginAt: new Date().toISOString(),
  };

  users[userIndex] = nextUser;
  await writeUsers(users);

  return sanitizeUser(nextUser);
}
