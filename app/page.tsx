import { auth } from "@/auth";

import HomeHeader from "./components/home/home-header";
import HomeOverviewSection from "./components/home/home-overview-section";
import HomeCoachArea from "./components/home/home-coach-area";
import HomeFocusBoard from "./components/home/home-focus-board";
import HomeCoachPlanner from "./components/home/home-coach-planner";
import HomeDayPlan from "./components/home/home-day-plan";
import HomeWeeklyReport from "./components/home/home-weekly-report";
import HomeStartCoach from "./components/home/home-start-coach";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name?.trim() || "Motive Care Member";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-80">
        <div className="float-soft absolute left-[-8rem] top-12 h-64 w-64 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pulse-glow absolute right-[-7rem] top-20 h-72 w-72 rounded-full bg-[var(--sky-soft)] blur-3xl" />
        <div className="absolute bottom-24 left-[20%] h-56 w-56 rounded-full bg-[var(--sun-soft)] blur-3xl" />
        <div className="grid-wash absolute inset-x-6 top-28 h-[32rem] rounded-[2rem] opacity-25" />
      </div>

      <main className="relative mx-auto flex w-full max-w-[108rem] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <section className="panel panel-strong rise-in overflow-hidden rounded-[2rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <HomeHeader isLoggedIn={isLoggedIn} userName={userName} />
          <HomeOverviewSection isLoggedIn={isLoggedIn} />
        </section>

        <HomeCoachArea />

        <HomeFocusBoard />
        <HomeCoachPlanner />

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <HomeDayPlan />
          <HomeWeeklyReport />
        </section>

        <HomeStartCoach />
      </main>
    </div>
  );
}
