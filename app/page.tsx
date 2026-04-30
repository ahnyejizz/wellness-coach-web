import { auth } from "@/auth";

import LogoutAlert from "./components/common/logout-alert";
import HomeHeader from "./components/home/home-header";
import HomeOverviewSection from "./components/home/home-overview-section";
import HomeCoachArea from "./components/home/home-coach-area";
import HomeFocusBoard from "./components/home/home-focus-board";
import HomeCoachPlanStudio from "./components/home/home-coach-plan-studio";
import HomeCoachPlanPreview from "./components/home/home-coach-plan-preview";
import HomeDayPlan from "./components/home/home-day-plan";
import HomeWeeklyReport from "./components/home/home-weekly-report";
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
  const searchParams = await props.searchParams;
  const loggedOutValue = Array.isArray(searchParams.loggedOut) ? searchParams.loggedOut[0] : searchParams.loggedOut;
  const showLoggedOutAlert = loggedOutValue === "true";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LogoutAlert show={showLoggedOutAlert} />

      <main className="relative mx-auto flex w-full max-w-[108rem] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <section className="panel panel-strong rise-in overflow-hidden rounded-[2rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <HomeHeader isLoggedIn={isLoggedIn} />
          <HomeOverviewSection isLoggedIn={isLoggedIn} />
        </section>

        {/* Coach Plan Studio, Weekly Report */}
        {isLoggedIn ? (
          <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <HomeCoachPlanStudio />
            <HomeWeeklyReport />
          </section>
        ) : null}

        {/* [Sleep / Workout / Nutrition] Coach */}
        <HomeCoachArea />

        {/* Focus Board, [Sleep / Workout / Nutrition] Priority */}
        <HomeFocusBoard isLoggedIn={isLoggedIn} />

        {/* Day Plan, Personalized Preview */}
        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <HomeDayPlan />
          <HomeCoachPlanPreview isLoggedIn={isLoggedIn} />
        </section>

        {/* Start Coaching */}
        {!isLoggedIn ? <HomeStartCoach /> : null}
      </main>
    </div>
  );
}
