import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { HomeIcon } from "@/app/icon/icon";
import WorkspaceHeaderInfo from "@/app/components/common/workspace-header-info";
import HomeFocusBoard from "@/app/components/home/home-focus-board";
import HomePriority from "@/app/components/home/home-priority";
import HomeFocusThemeWrapper from "@/app/components/home/home-focus-theme-wrapper";
import DailySurveyPanel from "@/app/components/plan/daily-survey-panel";
import { getFinalUserProfileByEmail } from "@/lib/auth/onboarding-cookie-store";
import { hasCompletedOnboarding } from "@/lib/auth/user-store";

/**
 * @description 로그인 후 플랜 우선순위와 주간 패턴을 확인하는 플랜 페이지
 */
function resolveInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "M";
  return source.charAt(0).toUpperCase();
}

export default async function PlanPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/plan");
  }

  const localProfile = session.user.email ? await getFinalUserProfileByEmail(session.user.email) : null;

  if (!localProfile || !hasCompletedOnboarding(localProfile)) {
    redirect("/coach/onboarding?callbackUrl=/plan");
  }

  const userName = session.user.name ?? "Motive Care Member";
  const userEmail = session.user.email ?? "Local account";
  const userInitial = resolveInitial(session.user.name, session.user.email);

  return (
    <HomeFocusThemeWrapper>
      <main className="relative mx-auto flex min-h-screen w-full max-w-[108rem] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12">
        <section className="panel panel-strong ui-panel-shell-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--foreground)] text-2xl font-semibold text-[#fffaf2]">
                {userInitial}
              </div>
              <WorkspaceHeaderInfo
                kicker="Plan workspace"
                heading={`${userName}님, 환영합니다!`}
                userEmail={userEmail}
              />
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

        <section className="grid gap-6" aria-labelledby="coach-board-title">
          <DailySurveyPanel />

          <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <HomeFocusBoard isLoggedIn />
            <HomePriority isLoggedIn />
          </div>
        </section>
      </main>
    </HomeFocusThemeWrapper>
  );
}
