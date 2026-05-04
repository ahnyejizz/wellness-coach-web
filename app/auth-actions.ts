"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { getFinalUserProfileByEmail, savePersistedOnboardingProfile } from "@/lib/auth/onboarding-cookie-store";
import { DuplicateUserError, hasCompletedOnboarding, registerUser } from "@/lib/auth/user-store";

const defaultCallbackUrl = "/coach";
const socialProviderValues = ["google", "kakao", "naver"] as const;

type SocialProvider = (typeof socialProviderValues)[number];

function getFieldValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getPasswordValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeCallbackUrl(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return defaultCallbackUrl;
  }

  if (value.startsWith("/login") || value.startsWith("/signup")) {
    return defaultCallbackUrl;
  }

  return value;
}

function buildOnboardingRedirectUrl(callbackUrl: string) {
  const params = new URLSearchParams();

  if (callbackUrl !== defaultCallbackUrl) {
    params.set("callbackUrl", callbackUrl);
  }

  const queryString = params.toString();

  return queryString ? `/coach/onboarding?${queryString}` : "/coach/onboarding";
}

function buildAuthRedirect(
  pathname: "/login" | "/signup",
  options: {
    callbackUrl: string;
    error: string;
    values?: Record<string, string>;
  },
) {
  const params = new URLSearchParams({ error: options.error });

  if (options.callbackUrl !== defaultCallbackUrl) {
    params.set("callbackUrl", options.callbackUrl);
  }

  for (const [key, value] of Object.entries(options.values ?? {})) {
    if (value) {
      params.set(key, value);
    }
  }

  return `${pathname}?${params.toString()}`;
}

function isSocialProvider(value: string): value is SocialProvider {
  return socialProviderValues.includes(value as SocialProvider);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongEnoughPassword(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export async function signInWithSocial(provider: SocialProvider, callbackUrl: string) {
  const normalizedCallbackUrl = normalizeCallbackUrl(callbackUrl || defaultCallbackUrl);

  if (!isSocialProvider(provider)) {
    return redirect(buildAuthRedirect("/login", { callbackUrl: normalizedCallbackUrl, error: "invalid_provider" }));
  }

  await signIn(provider, {
    redirectTo: normalizedCallbackUrl,
  });
}

export async function loginWithCredentials(formData: FormData) {
  const callbackUrl = normalizeCallbackUrl(getFieldValue(formData, "callbackUrl") || defaultCallbackUrl);
  const email = getFieldValue(formData, "email");
  const password = getPasswordValue(formData, "password");

  if (!email || !password) {
    return redirect(
      buildAuthRedirect("/login", {
        callbackUrl,
        error: "missing_credentials",
        values: { email },
      }),
    );
  }

  const localProfile = await getFinalUserProfileByEmail(email);
  const redirectTarget =
    localProfile && hasCompletedOnboarding(localProfile) ? callbackUrl : buildOnboardingRedirectUrl(callbackUrl);

  if (localProfile && hasCompletedOnboarding(localProfile)) {
    await savePersistedOnboardingProfile({
      email,
      goalWeightKg: localProfile.goalWeightKg,
      sleepPattern: localProfile.sleepPattern,
      exerciseExperience: localProfile.exerciseExperience,
      mealStyle: localProfile.mealStyle,
      completedOnboardingAt: localProfile.completedOnboardingAt,
    });
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectTarget,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(
        buildAuthRedirect("/login", {
          callbackUrl,
          error: "invalid_credentials",
          values: { email },
        }),
      );
    }

    throw error;
  }
}

export async function signupWithCredentials(formData: FormData) {
  const callbackUrl = normalizeCallbackUrl(getFieldValue(formData, "callbackUrl") || defaultCallbackUrl);
  const name = getFieldValue(formData, "name");
  const email = getFieldValue(formData, "email");
  const password = getPasswordValue(formData, "password");
  const confirmPassword = getPasswordValue(formData, "confirmPassword");
  const persistedValues = {
    name,
    email,
  };

  if (!name || !email || !password || !confirmPassword) {
    return redirect(
      buildAuthRedirect("/signup", {
        callbackUrl,
        error: "missing_fields",
        values: persistedValues,
      }),
    );
  }

  if (name.length < 2) {
    return redirect(
      buildAuthRedirect("/signup", {
        callbackUrl,
        error: "name_too_short",
        values: persistedValues,
      }),
    );
  }

  if (!isValidEmail(email)) {
    return redirect(
      buildAuthRedirect("/signup", {
        callbackUrl,
        error: "invalid_email",
        values: persistedValues,
      }),
    );
  }

  if (!isStrongEnoughPassword(password)) {
    return redirect(
      buildAuthRedirect("/signup", {
        callbackUrl,
        error: "weak_password",
        values: persistedValues,
      }),
    );
  }

  if (password !== confirmPassword) {
    return redirect(
      buildAuthRedirect("/signup", {
        callbackUrl,
        error: "password_mismatch",
        values: persistedValues,
      }),
    );
  }

  try {
    await registerUser({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof DuplicateUserError) {
      return redirect(
        buildAuthRedirect("/signup", {
          callbackUrl,
          error: "email_in_use",
          values: persistedValues,
        }),
      );
    }

    throw error;
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: buildOnboardingRedirectUrl(callbackUrl),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(
        buildAuthRedirect("/login", {
          callbackUrl,
          error: "account_created_sign_in",
          values: { email },
        }),
      );
    }

    throw error;
  }
}
