import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthCredentialsForm from "@/app/components/common/auth-credentials-form";
import SocialAuthButtons from "@/app/components/common/social-auth-buttons";
import { getUserProfileByEmail, hasCompletedOnboarding } from "@/lib/auth/user-store";

/**
 * @description 기존 사용자가 이메일 또는 소셜 계정으로 다시 진입하는 로그인 페이지
 */
function normalizeCallbackUrl(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (!normalized) {
    return "/coach";
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/coach";
  } catch {
    return "/coach";
  }
}

function resolveErrorMessage(value: string | string[] | undefined) {
  const error = Array.isArray(value) ? value[0] : value;

  if (!error) {
    return "";
  }

  if (error === "social_email_required") {
    return "";
  }

  const messageMap: Record<string, string> = {
    missing_credentials: "이메일과 비밀번호를 모두 입력해주세요.",
    invalid_credentials: "이메일 또는 비밀번호가 올바르지 않아요.",
    CredentialsSignin: "이메일 또는 비밀번호가 올바르지 않아요.",
    account_created_sign_in: "회원가입은 완료됐지만 자동 로그인에 실패했어요. 방금 만든 계정으로 다시 로그인해주세요.",
    invalid_provider: "지원하지 않는 로그인 방식이에요. 다시 시도해주세요.",
    OAuthSignin: "소셜 로그인 연결 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
    OAuthCallback: "소셜 로그인 응답을 처리하는 중 문제가 발생했어요. 다시 시도해주세요.",
    AccessDenied: "소셜 로그인 권한이 거부되었어요. 다시 시도해주세요.",
    OAuthAccountNotLinked: "같은 이메일로 이미 다른 로그인 방식이 연결되어 있어요. 기존 방식으로 로그인해주세요.",
    Configuration: "소셜 로그인 설정이 아직 완료되지 않았어요. 환경 변수를 확인해주세요.",
  };

  return messageMap[error] ?? "로그인 중 문제가 발생했어요.";
}

export default async function LoginPage(props: {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
    email?: string | string[];
  }>;
}) {
  const session = await auth();

  if (session?.user?.email) {
    const localProfile = await getUserProfileByEmail(session.user.email);
    const redirectTarget =
      localProfile && hasCompletedOnboarding(localProfile) ? "/coach" : "/coach/onboarding?callbackUrl=/coach";
    redirect(redirectTarget);
  }

  const searchParams = await props.searchParams;
  const callbackUrl = normalizeCallbackUrl(searchParams.callbackUrl);
  const errorMessage = resolveErrorMessage(searchParams.error);
  const email =
    typeof searchParams.email === "string"
      ? searchParams.email
      : Array.isArray(searchParams.email)
        ? (searchParams.email[0] ?? "")
        : "";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[100rem] items-center px-5 py-8 sm:px-8 lg:px-10">
      <div className="flex w-full justify-center">
        <section className="panel ui-panel-shell-lg w-full max-w-[42rem]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="ui-kicker tracking-[0.24em]">Sign in</p>
              <h2 className="ui-title-3 mt-3">계정 로그인</h2>
            </div>
            <Link href="/" className="ui-pill">
              홈으로
            </Link>
          </div>

          <div className="mt-8">
            <SocialAuthButtons callbackUrl={callbackUrl} mode="login" />

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
                또는 이메일로 계속하기
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <AuthCredentialsForm
              mode="login"
              callbackUrl={callbackUrl}
              errorMessage={errorMessage}
              initialValues={{ email }}
            />
          </div>

          <p className="ui-copy mt-6">
            처음 오셨다면{" "}
            <Link
              href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-semibold text-[var(--foreground)]"
            >
              회원가입 페이지
            </Link>
            에서 바로 계정을 만들 수 있어요.
          </p>
        </section>
      </div>
    </main>
  );
}
