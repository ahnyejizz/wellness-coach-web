import { auth } from "@/auth";
import { getOnboardingHref } from "@/utils/route-href";
import { getFinalUserProfileByEmail } from "@/lib/auth/onboarding-cookie-store";
import LogoutAlert from "./components/common/alert/logout-alert";
import FocusThemeWrapper from "./components/plan/focus-theme-wrapper";
import HomeHeader from "./components/home/home-header";
import HomeLandingSection from "./components/home/home-landing-section";
import CoachArea from "./components/home/coach-area";
import FocusBoard from "./components/plan/focus-board";
import FocusBoardPriority from "./components/plan/focus-board-priority";
import DayPlan from "./components/home/day-plan";
import PlanPreview from "./components/home/plan-preview";
import StartCoach from "./components/home/start-coach";

/**
 * @description 홈 랜딩 페이지
 */
export default async function Home(props: {
  searchParams: Promise<{
    loggedOut?: string | string[];
  }>;
}) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const localProfile = session?.user?.email ? await getFinalUserProfileByEmail(session.user.email) : null;
  const onboardingHref = getOnboardingHref(localProfile, "/");
  const searchParams = await props.searchParams;
  const loggedOutValue = Array.isArray(searchParams.loggedOut) ? searchParams.loggedOut[0] : searchParams.loggedOut;
  const showLoggedOutAlert = loggedOutValue === "true";

  return (
    <FocusThemeWrapper>
      <LogoutAlert show={showLoggedOutAlert} />

      <main className="relative mx-auto flex w-full max-w-[108rem] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <section className="panel panel-strong rise-in overflow-hidden rounded-[2rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <HomeHeader isLoggedIn={isLoggedIn} onboardingHref={onboardingHref} />
          <HomeLandingSection isLoggedIn={isLoggedIn} />
        </section>

        {/* [Sleep / Workout / Nutrition] Coach */}
        <CoachArea />

        {!isLoggedIn ? (
          <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]" aria-labelledby="coach-board-title">
            <FocusBoard />
            <FocusBoardPriority isLoggedIn={isLoggedIn} />
          </section>
        ) : null}

        {/* Day Plan, Plan Preview */}
        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <DayPlan />
          <PlanPreview isLoggedIn={isLoggedIn} />
        </section>

        {/* Start Coaching */}
        {!isLoggedIn ? <StartCoach /> : null}
      </main>
    </FocusThemeWrapper>
  );
}
