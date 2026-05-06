import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getOnboardingHref } from "@/utils/route-href";
import { HomeIcon } from "@/app/icon/icon";
import WorkspaceHeaderInfo from "@/app/components/common/workspace-header-info";
import FocusThemeWrapper from "@/app/components/plan/focus-theme-wrapper";
import WeeklyReport from "@/app/components/coach/weekly-report";
import PlanSummary from "@/app/components/coach/plan-summary";
import { getFinalUserProfileByEmail } from "@/lib/auth/onboarding-cookie-store";
import {
  getExerciseExperienceLabel,
  getMealStyleLabel,
  getSleepPatternLabel,
  hasCompletedOnboarding,
} from "@/lib/auth/user-store";
import PlanStudio from "./plan-studio";

/**
 * @description 로그인 후 입력한 웰니스 프로필, 선택된 플랜 우선순위, 주간 리포트를 보여주는 대시보드 페이지
 */
function resolveInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "M";
  return source.charAt(0).toUpperCase();
}

export default async function CoachPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/coach");
  }

  const localProfile = session.user.email ? await getFinalUserProfileByEmail(session.user.email) : null;

  if (!localProfile || !hasCompletedOnboarding(localProfile)) {
    redirect("/coach/onboarding?callbackUrl=/coach");
  }

  const completedProfile = localProfile;
  const userName = session.user.name ?? "Motive Care Member";
  const userEmail = session.user.email ?? "Local account";
  const userInitial = resolveInitial(session.user.name, session.user.email);
  const isFirstLogin = (completedProfile.loginCount ?? 0) <= 1;
  const heading = isFirstLogin ? `${userName}님, 환영합니다!` : `${userName}님, 환영합니다!`;
  const onboardingHref = getOnboardingHref(completedProfile, "/coach");
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
    <FocusThemeWrapper>
      <main className="relative mx-auto flex min-h-screen w-full max-w-[108rem] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12">
        <section className="panel panel-strong ui-panel-shell-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--foreground)] text-2xl font-semibold text-[#fffaf2]">
                {userInitial}
              </div>
              <WorkspaceHeaderInfo kicker="Coach workspace" heading={heading} userEmail={userEmail} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                aria-label="홈으로"
                title="홈으로"
                className="ui-button-secondary inline-flex items-center justify-center px-4"
              >
                <HomeIcon />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/?loggedOut=true" });
                }}
              >
                <button type="submit" className="ui-button-primary w-full">
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <article className="panel ui-panel-card ui-hover-panel h-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="ui-kicker">Wellness Profile</p>
                <h2 className="ui-title-3 mt-3">가입 직후 입력한 웰니스 프로필</h2>
              </div>
              <Link href={onboardingHref} className="ui-pill ui-pill-strong">
                수정
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {onboardingSummary.map((item) => (
                <div
                  key={item.label}
                  className="ui-hover-note flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--border)] bg-white/72 px-4 py-3"
                >
                  <span className="text-sm text-[var(--muted)]">{item.label}</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{item.value}</span>
                </div>
              ))}
            </div>
          </article>
          <PlanSummary />
        </section>

        {/* <PlanStudio /> */}
        <WeeklyReport />
      </main>
    </FocusThemeWrapper>
  );
}
