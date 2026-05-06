"use client";

import LockPreview from "../common/lock-preview";
import HomeCoachBrief from "./home-coach-brief";

const guestSignalPreviews = [
  {
    label: "수면",
    accent: "var(--sky)",
    softAccent: "var(--sky-soft)",
  },
  {
    label: "운동",
    accent: "var(--mint)",
    softAccent: "var(--mint-soft)",
  },
  {
    label: "식단",
    accent: "var(--sun)",
    softAccent: "var(--sun-soft)",
  },
] as const;

type HomeHeroSectionProps = {
  isLoggedIn: boolean;
};

export default function HomeOverviewSection({ isLoggedIn }: HomeHeroSectionProps) {
  return (
    <>
      <div className="grid gap-8 pt-8 xl:grid-cols-[1.24fr_0.76fr]">
        <div className="space-y-7">
          <div className="max-w-4xl space-y-5">
            <p className="ui-kicker font-medium">Sleep, workout, diet coaching in one flow</p>
            <h1 className="headline-face max-w-4xl text-[1.85rem] leading-[1.16] tracking-[-0.025em] text-[var(--foreground)] sm:text-[2.15rem] lg:text-[2.75rem]">
              Personalized Wellness & HealthCare
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Motive Care는 수면, 운동, 식단에 대한 헬스케어 데이터를 따로 흩어두지 않고 하나의 흐름으로 연결합니다.
              <br />
              회복이 부족하면 운동 강도를 낮추고, 식단이 흔들리면 포만감 설계부터 다시 제안하는
              <br />
              개인 맞춤형 웰니스 & 헬스케어 코치형 건강 관리 서비스 입니다.
            </p>
          </div>

          {isLoggedIn ? null : (
            <div className="grid gap-3 sm:grid-cols-3">
              {guestSignalPreviews.map((signal) => (
                <article key={signal.label} className="ui-card-compact ui-hover-card rounded-[1.4rem]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-[var(--muted)]">{signal.label}</p>
                  </div>
                  <LockPreview
                    className="mt-5"
                    accent={signal.accent}
                    softAccent={signal.softAccent}
                    lineWidths={["74%", "88%", "61%"]}
                  />
                </article>
              ))}
            </div>
          )}
        </div>

        {/* 오늘의 코치 브리핑 */}
        <HomeCoachBrief isLoggedIn={isLoggedIn} />
      </div>
    </>
  );
}
