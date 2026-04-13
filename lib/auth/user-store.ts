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

export type WellnessFocus = (typeof wellnessFocusOptions)[number]["value"];

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  focus: WellnessFocus;
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

export async function getUserProfileByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const users = await readUsers();
  const user = users.find((candidate) => candidate.email === normalizedEmail);

  return user ? sanitizeUser(user) : null;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  focus: WellnessFocus;
}) {
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
