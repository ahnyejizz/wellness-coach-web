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
  const showLoggedOutAlert = loggedOutValue === "1";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LogoutAlert show={showLoggedOutAlert} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-80">
        <div className="float-soft absolute left-[-8rem] top-12 h-64 w-64 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pulse-glow absolute right-[-7rem] top-20 h-72 w-72 rounded-full bg-[var(--sky-soft)] blur-3xl" />
        <div className="absolute bottom-24 left-[20%] h-56 w-56 rounded-full bg-[var(--sun-soft)] blur-3xl" />
        <div className="grid-wash absolute inset-x-6 top-28 h-[32rem] rounded-[2rem] opacity-25" />
      </div>

      <main className="relative mx-auto flex w-full max-w-[108rem] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <section className="panel panel-strong rise-in overflow-hidden rounded-[2rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <HomeHeader isLoggedIn={isLoggedIn} />
          <HomeOverviewSection isLoggedIn={isLoggedIn} />
        </section>

        {/* Sleep Coach, Workout Coach, Nutrition Coach */}
        <HomeCoachArea />

        {/* Focus Board */}
        <HomeFocusBoard isLoggedIn={isLoggedIn} />

        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <HomeCoachPlanStudio />
          <HomeCoachPlanPreview isLoggedIn={isLoggedIn} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <HomeDayPlan />
          <HomeWeeklyReport />
        </section>

        {/* Start Coaching */}
        {!isLoggedIn ? <HomeStartCoach /> : null}
      </main>
    </div>
  );
}
