import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthCredentialsForm from "@/app/components/common/auth-credentials-form";
import SocialAuthButtons from "@/app/components/common/social-auth-buttons";
import { getUserProfileByEmail, hasCompletedOnboarding, type WellnessFocus } from "@/lib/auth/user-store";

/**
 * @description 계정을 만든 뒤 온보딩으로 이어지는 회원가입 페이지
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

  const messageMap: Record<string, string> = {
    missing_fields: "이름, 이메일, 비밀번호를 모두 입력해주세요.",
    name_too_short: "이름은 2글자 이상 입력해주세요.",
    invalid_email: "올바른 이메일 형식으로 입력해주세요.",
    invalid_focus: "코칭 축을 다시 선택해주세요.",
    weak_password: "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 해요.",
    password_mismatch: "비밀번호 확인이 일치하지 않아요.",
    email_in_use: "이미 가입된 이메일이에요. 로그인하거나 다른 이메일을 사용해주세요.",
    invalid_provider: "지원하지 않는 회원가입 방식이에요. 다시 시도해주세요.",
    AccessDenied: "소셜 회원가입 권한이 거부되었어요. 다시 시도해주세요.",
    OAuthSignin: "소셜 회원가입 연결 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
    OAuthCallback: "소셜 회원가입 응답을 처리하는 중 문제가 발생했어요. 다시 시도해주세요.",
    OAuthAccountNotLinked: "같은 이메일로 이미 다른 로그인 방식이 연결되어 있어요. 기존 방식으로 로그인해주세요.",
    Configuration: "소셜 회원가입 설정이 아직 완료되지 않았어요. 환경 변수를 확인해주세요.",
  };

  return messageMap[error] ?? "회원가입 중 문제가 발생했어요.";
}

export default async function SignUpPage(props: {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
    name?: string | string[];
    email?: string | string[];
    focus?: string | string[];
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
  const name =
    typeof searchParams.name === "string"
      ? searchParams.name
      : Array.isArray(searchParams.name)
        ? (searchParams.name[0] ?? "")
        : "";
  const email =
    typeof searchParams.email === "string"
      ? searchParams.email
      : Array.isArray(searchParams.email)
        ? (searchParams.email[0] ?? "")
        : "";
  const focusValue =
    typeof searchParams.focus === "string"
      ? searchParams.focus
      : Array.isArray(searchParams.focus)
        ? (searchParams.focus[0] ?? "")
        : "";
  const focus: WellnessFocus =
    focusValue === "sleep" || focusValue === "exercise" || focusValue === "diet" ? focusValue : "balance";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[100rem] items-center px-5 py-8 sm:px-8 lg:px-10">
      <div className="flex w-full justify-center">
        <section className="panel ui-panel-shell-lg w-full max-w-[42rem]">
          <div className="flex flex-wrap items-start justify-between gap-4 sm:items-center">
            <div>
              <p className="ui-kicker tracking-[0.24em]">Get started</p>
              <h2 className="ui-title-3 mt-3">회원가입</h2>
            </div>
            <div className="flex items-center gap-3 sm:justify-end">
              <Link href="/" className="ui-button-secondary">
                홈으로
              </Link>
              <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="ui-pill">
                로그인
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <SocialAuthButtons callbackUrl={callbackUrl} mode="signup" />

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
                또는 이메일로 가입하기
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <AuthCredentialsForm
              mode="signup"
              callbackUrl={callbackUrl}
              errorMessage={errorMessage}
              initialValues={{ name, email, focus }}
            />
          </div>

          <p className="ui-copy mt-6">가입을 완료하면 바로 온보딩 질문으로 넘어갑니다.</p>
        </section>
      </div>
    </main>
  );
}
