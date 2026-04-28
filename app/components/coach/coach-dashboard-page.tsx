import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import HealthCoachAssistant from "@/app/components/coach/health-coach-assistant";
import WellnessPlanSummary from "@/app/components/coach/wellness-plan-summary";
import {
  getExerciseExperienceLabel,
  getMealStyleLabel,
  getSleepPatternLabel,
  getUserProfileByEmail,
  getWellnessFocusLabel,
  hasCompletedOnboarding,
} from "@/lib/auth/user-store";

/**
 * @description 로그인 후 개인 코칭 상태와 온보딩 요약을 보여주는 코치 대시보드 페이지
 */
function resolveInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "M";
  return source.charAt(0).toUpperCase();
}

export default async function CoachDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/coach");
  }

  const localProfile = session.user.email ? await getUserProfileByEmail(session.user.email) : null;

  if (!localProfile || !hasCompletedOnboarding(localProfile)) {
    redirect("/coach/onboarding?callbackUrl=/coach");
  }

  const completedProfile = localProfile;
  const userName = session.user.name ?? "Motive Care Member";
  const userEmail = session.user.email ?? "Local account";
  const userInitial = resolveInitial(session.user.name, session.user.email);
  const focusLabel = getWellnessFocusLabel(completedProfile.focus);
  const isFirstLogin = (completedProfile.loginCount ?? 0) <= 1;
  const heading = isFirstLogin ? `${userName}님, 환영합니다!` : `${userName}님, 다시 오셨네요!`;
  const onboardingSummary = [
    {
      label: "목표 체중",
      value: `${completedProfile.goalWeightKg}kg`,
    },
    {
      label: "수면 패턴",
      value: getSleepPatternLabel(completedProfile.sleepPattern),
    },
    {
      label: "운동 경험",
      value: getExerciseExperienceLabel(completedProfile.exerciseExperience),
    },
    {
      label: "식단 스타일",
      value: getMealStyleLabel(completedProfile.mealStyle),
    },
  ];

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[108rem] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12">
      <section className="panel panel-strong ui-panel-shell-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--foreground)] text-2xl font-semibold text-[#fffaf2]">
              {userInitial}
            </div>
            <div>
              <p className="ui-kicker">Coach workspace</p>
              <h1 className="ui-title-4 mt-3">{heading}</h1>
              <p className="ui-copy mt-3">
                현재 로그인된 계정은 {userEmail} 입니다.
                <br />
                여기서 개인 웰니스 플랜, 주간 리포트, 맞춤 루틴을 이어서 관리하게 됩니다.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="ui-button-secondary">
              홈으로
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="ui-button-primary w-full">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="panel ui-panel-card">
          <p className="text-sm text-[var(--muted)]">인증 상태</p>
          <h2 className="ui-title-2 mt-3">내부 계정 로그인 완료</h2>
          <p className="ui-copy mt-4">회원가입 폼에서 만든 계정으로 로그인한 상태입니다.</p>
        </article>

        <article className="panel ui-panel-card">
          <p className="text-sm text-[var(--muted)]">우선 코칭</p>
          <h2 className="ui-title-2 mt-3">{focusLabel}</h2>
          <p className="ui-copy mt-4">
            회원가입 때 선택한 웰니스 우선순위를 기준으로, 이후 대시보드와 추천 루틴을 더 구체적으로 개인화할 수
            있습니다.
          </p>
        </article>

        <article className="panel ui-panel-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted)]">웰니스 온보딩</p>
              <h2 className="ui-title-2 mt-3">가입 직후 입력한 웰니스 프로필</h2>
            </div>
            <Link href="/coach/onboarding?mode=edit&callbackUrl=/coach" className="ui-pill ui-pill-strong">
              수정
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {onboardingSummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--border)] bg-white/72 px-4 py-3"
              >
                <span className="text-sm text-[var(--muted)]">{item.label}</span>
                <span className="text-sm font-semibold text-[var(--foreground)]">{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <HealthCoachAssistant userName={userName} focusLabel={focusLabel} />

      <WellnessPlanSummary />
    </main>
  );
}
