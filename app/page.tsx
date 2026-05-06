import { auth } from "@/auth";
import { getOnboardingHref } from "@/lib/common/route-href";
import { getFinalUserProfileByEmail } from "@/lib/auth/onboarding-cookie-store";
import LogoutAlert from "./components/common/alert/logout-alert";
import HomeFocusThemeWrapper from "./components/home/home-focus-theme-wrapper";
import HomeHeader from "./components/home/home-header";
import HomeOverviewSection from "./components/home/home-overview-section";
import HomeCoachArea from "./components/home/home-coach-area";
import HomeFocusBoard from "./components/home/home-focus-board";
import HomePriority from "./components/home/home-priority";
import HomeDayPlan from "./components/home/home-day-plan";
import HomeCoachPlanPreview from "./components/home/home-coach-plan-preview";
import HomeStartCoach from "./components/home/home-start-coach";

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
    <HomeFocusThemeWrapper>
      <LogoutAlert show={showLoggedOutAlert} />

      <main className="relative mx-auto flex w-full max-w-[108rem] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <section className="panel panel-strong rise-in overflow-hidden rounded-[2rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <HomeHeader isLoggedIn={isLoggedIn} onboardingHref={onboardingHref} />
          <HomeOverviewSection isLoggedIn={isLoggedIn} />
        </section>

        {/* [Sleep / Workout / Nutrition] Coach */}
        <HomeCoachArea />

        {!isLoggedIn ? (
          <section
            className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]"
            aria-labelledby="coach-board-title"
          >
            <HomeFocusBoard isLoggedIn={isLoggedIn} />
            <HomePriority isLoggedIn={isLoggedIn} />
          </section>
        ) : null}

        {/* Day Plan, Personalized Preview */}
        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <HomeDayPlan />
          <HomeCoachPlanPreview isLoggedIn={isLoggedIn} />
        </section>

        {/* Start Coaching */}
        {!isLoggedIn ? <HomeStartCoach /> : null}
      </main>
    </HomeFocusThemeWrapper>
  );
}
