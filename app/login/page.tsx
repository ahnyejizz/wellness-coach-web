import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthCredentialsForm from "@/app/components/auth-credentials-form";

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
    missing_credentials: "이메일과 비밀번호를 모두 입력해주세요.",
    invalid_credentials: "이메일 또는 비밀번호가 올바르지 않아요.",
    CredentialsSignin: "이메일 또는 비밀번호가 올바르지 않아요.",
    account_created_sign_in: "회원가입은 완료됐지만 자동 로그인에 실패했어요. 방금 만든 계정으로 다시 로그인해주세요.",
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

  if (session?.user) {
    redirect("/coach");
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
      <div className="grid w-full gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <section className="panel panel-strong ui-panel-shell-lg">
          <div className="ui-brand-chip">Motive Care</div>
          <p className="ui-kicker mt-6">Login</p>
          <h1 className="ui-title-4 mt-3">다시 돌아온 오늘의 건강 코치</h1>
          <p className="ui-copy mt-4 max-w-2xl sm:text-base">
            로그인하면 수면, 운동, 식단 중심의 개인 코칭 플랜과
            <br />
            저장된 루틴, 우선 코칭을 이어서 확인할 수 있습니다.
          </p>

          <div className="ui-card mt-8 rounded-[1.6rem]">
            <p className="text-sm font-medium text-[var(--muted)]">로컬 계정 안내</p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
              지금은 이 프로젝트 안에서 바로 회원가입하고 로그인하는 초기 버전 흐름으로 구성했습니다.
              <br />
              등록한 정보는 로컬 개발 환경의 사용자 저장소에 보관됩니다.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm text-[var(--muted)]">
            <div className="ui-card-soft">로그인 후 `/coach` 페이지에서 개인 건강 코칭 플랜을 확인합니다.</div>
            <div className="ui-card-soft">
              이메일과 비밀번호로 로그인하며,
              <br />
              나중에 DB나 외부 인증으로 확장할 수 있도록 구조를 분리해두었습니다.
            </div>
          </div>
        </section>

        <section className="panel ui-panel-shell-lg">
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
