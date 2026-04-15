import Link from "next/link";

export default function HomeStartCoach() {
  return (
    <section className="panel panel-strong overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Start coaching
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)]">
            수면, 운동, 식단이 서로 연결된
            <br />
            진짜 개인 건강 코치를 시작해보세요.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            기록을 많이 남기지 않아도 괜찮습니다.
            <br />
            중요한 건 지금 몸 상태에서 가장 효과가 큰 행동 하나를 매일 이어가게 만드는 것입니다.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            회원가입하고 코칭 시작
          </a>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-white"
          >
            로그인
          </Link>
        </div>
      </div>
    </section>
  );
}
