import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthCredentialsForm from "@/app/components/auth-credentials-form";
import { type WellnessFocus } from "@/lib/auth/user-store";

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

  if (session?.user) {
    redirect("/coach");
  }

  const searchParams = await props.searchParams;
  const callbackUrl = normalizeCallbackUrl(searchParams.callbackUrl);
  const errorMessage = resolveErrorMessage(searchParams.error);
  const name =
    typeof searchParams.name === "string"
      ? searchParams.name
      : Array.isArray(searchParams.name)
        ? searchParams.name[0] ?? ""
        : "";
  const email =
    typeof searchParams.email === "string"
      ? searchParams.email
      : Array.isArray(searchParams.email)
        ? searchParams.email[0] ?? ""
        : "";
  const focusValue =
    typeof searchParams.focus === "string"
      ? searchParams.focus
      : Array.isArray(searchParams.focus)
        ? searchParams.focus[0] ?? ""
        : "";
  const focus: WellnessFocus =
    focusValue === "sleep" ||
    focusValue === "exercise" ||
    focusValue === "diet"
      ? focusValue
      : "balance";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[100rem] items-center px-5 py-8 sm:px-8 lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Sign up
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
            나만의 건강 코치 계정 만들기
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            이름, 이메일, 비밀번호만 입력하면 프로젝트 내부 계정으로 바로
            시작할 수 있습니다. 가입 후에는 수면, 운동, 식단 코칭 플로우를 개인
            기준으로 이어서 관리할 수 있습니다.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-4">
              <p className="text-sm text-[var(--muted)]">Sleep</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                취침 리듬과 회복 점수 추적
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-4">
              <p className="text-sm text-[var(--muted)]">Workout</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                주간 운동 빈도와 강도 조절
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-4">
              <p className="text-sm text-[var(--muted)]">Nutrition</p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                단백질, 수분, 식사 패턴 관리
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-[var(--border)] bg-white/72 p-5">
            <p className="text-sm font-medium text-[var(--muted)]">
              지금 단계의 가입 방식
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
              먼저 로컬 계정 가입으로 사용자 흐름을 빠르게 검증하고, 이후 필요할
              때 DB 저장이나 외부 인증 공급자를 붙일 수 있게 구조를 분리했습니다.
            </p>
          </div>
        </section>

        <section className="panel rounded-[2rem] px-6 py-8 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent-strong)]">
                Get started
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                회원가입
              </h2>
            </div>
            <Link
              href="/login"
              className="rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-white"
            >
              로그인
            </Link>
          </div>

          <div className="mt-8">
            <AuthCredentialsForm
              mode="signup"
              callbackUrl={callbackUrl}
              errorMessage={errorMessage}
              initialValues={{ name, email, focus }}
            />
          </div>

          <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
            가입을 완료하면 바로{" "}
            <span className="font-semibold text-[var(--foreground)]">/coach</span>{" "}
            페이지로 이동해 개인 건강 코칭 흐름을 시작합니다.
          </p>
        </section>
      </div>
    </main>
  );
}
