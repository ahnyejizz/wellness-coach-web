"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { DuplicateUserError, registerUser, type WellnessFocus } from "@/lib/auth/user-store";

const defaultCallbackUrl = "/coach";
const wellnessFocusValues = ["balance", "sleep", "exercise", "diet"] as const;

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

function isWellnessFocus(value: string): value is WellnessFocus {
  return wellnessFocusValues.includes(value as WellnessFocus);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongEnoughPassword(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
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

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
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
  const focus = getFieldValue(formData, "focus");
  const persistedValues = {
    name,
    email,
    focus: isWellnessFocus(focus) ? focus : "balance",
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

  if (!isWellnessFocus(focus)) {
    return redirect(
      buildAuthRedirect("/signup", {
        callbackUrl,
        error: "invalid_focus",
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
      focus,
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
