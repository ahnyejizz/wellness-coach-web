import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

export type SleepPattern = (typeof sleepPatternOptions)[number]["value"];
export type ExerciseExperience = (typeof exerciseExperienceOptions)[number]["value"];
export type MealStyle = (typeof mealStyleOptions)[number]["value"];

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
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

function resolveDisplayName(name: string | null | undefined, email: string) {
  const normalizedName = name?.trim();

  if (normalizedName) {
    return normalizedName;
  }

  return email.split("@")[0] || "Motive Care Member";
}

function normalizeStoredUserRecord(value: unknown): StoredUser | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Partial<StoredUser>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    typeof candidate.passwordHash !== "string" ||
    typeof candidate.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    email: normalizeEmail(candidate.email),
    passwordHash: candidate.passwordHash,
    goalWeightKg: typeof candidate.goalWeightKg === "number" ? candidate.goalWeightKg : undefined,
    sleepPattern: typeof candidate.sleepPattern === "string" ? (candidate.sleepPattern as SleepPattern) : undefined,
    exerciseExperience:
      typeof candidate.exerciseExperience === "string"
        ? (candidate.exerciseExperience as ExerciseExperience)
        : undefined,
    mealStyle: typeof candidate.mealStyle === "string" ? (candidate.mealStyle as MealStyle) : undefined,
    completedOnboardingAt:
      typeof candidate.completedOnboardingAt === "string" ? candidate.completedOnboardingAt : undefined,
    createdAt: candidate.createdAt,
    loginCount: typeof candidate.loginCount === "number" ? candidate.loginCount : 0,
    lastLoginAt: typeof candidate.lastLoginAt === "string" ? candidate.lastLoginAt : undefined,
  };
}

function sanitizeUser(user: StoredUser): LocalUserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
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
    return Array.isArray(parsed)
      ? parsed.flatMap((entry) => {
          const user = normalizeStoredUserRecord(entry);
          return user ? [user] : [];
        })
      : [];
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

export async function registerUser(input: { name: string; email: string; password: string }) {
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
    createdAt: new Date().toISOString(),
    loginCount: 0,
  };

  users.push(nextUser);
  await writeUsers(users);

  return sanitizeUser(nextUser);
}

export async function ensureSocialUser(input: { name?: string | null; email: string }) {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(input.email);
  const userIndex = users.findIndex((candidate) => candidate.email === normalizedEmail);
  const timestamp = new Date().toISOString();
  const displayName = resolveDisplayName(input.name, normalizedEmail);

  if (userIndex >= 0) {
    const existingUser = users[userIndex];
    const nextUser: StoredUser = {
      ...existingUser,
      name: displayName || existingUser.name,
      loginCount: (existingUser.loginCount ?? 0) + 1,
      lastLoginAt: timestamp,
    };

    users[userIndex] = nextUser;
    await writeUsers(users);

    return sanitizeUser(nextUser);
  }

  const nextUser: StoredUser = {
    id: randomUUID(),
    name: displayName,
    email: normalizedEmail,
    passwordHash: "",
    createdAt: timestamp,
    loginCount: 1,
    lastLoginAt: timestamp,
  };

  users.push(nextUser);
  await writeUsers(users);

  return sanitizeUser(nextUser);
}

export async function updateUserOnboarding(input: {
  email: string;
  name?: string | null;
  goalWeightKg: number;
  sleepPattern: SleepPattern;
  exerciseExperience: ExerciseExperience;
  mealStyle: MealStyle;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const users = await readUsers();
  const userIndex = users.findIndex((candidate) => candidate.email === normalizedEmail);

  const nextUser: StoredUser =
    userIndex >= 0
      ? {
          ...users[userIndex],
          goalWeightKg: input.goalWeightKg,
          sleepPattern: input.sleepPattern,
          exerciseExperience: input.exerciseExperience,
          mealStyle: input.mealStyle,
          completedOnboardingAt: new Date().toISOString(),
        }
      : {
          id: randomUUID(),
          name: resolveDisplayName(input.name, normalizedEmail),
          email: normalizedEmail,
          passwordHash: "",
          goalWeightKg: input.goalWeightKg,
          sleepPattern: input.sleepPattern,
          exerciseExperience: input.exerciseExperience,
          mealStyle: input.mealStyle,
          completedOnboardingAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          loginCount: 1,
          lastLoginAt: new Date().toISOString(),
        };

  if (userIndex >= 0) {
    users[userIndex] = nextUser;
  } else {
    users.push(nextUser);
  }

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

  if (!user.passwordHash) {
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
