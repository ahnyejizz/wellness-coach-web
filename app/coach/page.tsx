import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import WellnessPlanSummary from "@/app/components/wellness-plan-summary";
import {
  getUserProfileByEmail,
  getWellnessFocusLabel,
} from "@/lib/auth/user-store";

function resolveInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "M";
  return source.charAt(0).toUpperCase();
}

export default async function CoachPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/coach");
  }

  const localProfile = session.user.email
    ? await getUserProfileByEmail(session.user.email)
    : null;
  const userName = session.user.name ?? "Motive Care Member";
  const userEmail = session.user.email ?? "Local account";
  const userInitial = resolveInitial(session.user.name, session.user.email);
  const focusLabel = getWellnessFocusLabel(localProfile?.focus ?? "balance");
  const isFirstLogin = (localProfile?.loginCount ?? 0) <= 1;
  const heading = isFirstLogin
    ? `${userName}님, 환영합니다!`
    : `${userName}님, 다시 오셨네요!`;
  const joinedAt = localProfile
    ? new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
      }).format(new Date(localProfile.createdAt))
    : "오늘";

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10">
      <section className="panel panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--foreground)] text-2xl font-semibold text-[#fffaf2]">
              {userInitial}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                Coach workspace
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
                {heading}
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                현재 로그인된 계정은 {userEmail} 입니다. 여기서 개인 건강 플랜,
                주간 리포트, 맞춤 루틴을 이어서 관리하게 됩니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-white"
            >
              홈으로
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="panel rounded-[1.8rem] px-6 py-6">
          <p className="text-sm text-[var(--muted)]">인증 상태</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            내부 계정 로그인 완료
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            회원가입 폼에서 만든 계정으로 로그인했고, 보호된 코치 페이지까지
            정상적으로 연결된 상태입니다.
          </p>
        </article>

        <article className="panel rounded-[1.8rem] px-6 py-6">
          <p className="text-sm text-[var(--muted)]">우선 코칭 축</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {focusLabel}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            회원가입 때 선택한 건강 우선순위를 기준으로, 이후 대시보드와
            추천 루틴을 더 구체적으로 개인화할 수 있습니다.
          </p>
        </article>

        <article className="panel rounded-[1.8rem] px-6 py-6">
          <p className="text-sm text-[var(--muted)]">가입 시점</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {joinedAt}부터 함께한 코칭
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            다음 단계에서는 목표 체중, 수면 패턴, 운동 경험, 식단 스타일 질문을
            붙여 가입 직후 온보딩까지 이어지게 확장하면 좋습니다.
          </p>
        </article>
      </section>

      <WellnessPlanSummary />
    </main>
  );
}
