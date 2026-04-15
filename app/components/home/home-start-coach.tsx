import Link from "next/link";

export default function HomeStartCoach() {
  return (
    <section className="panel panel-strong ui-panel-shell-lg overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="ui-kicker">
            Start coaching
          </p>
          <h2 className="ui-title-4 mt-3">
            수면, 운동, 식단이 서로 연결된
            <br />
            진짜 개인 건강 코치를 시작해보세요.
          </h2>
          <p className="ui-copy mt-4 max-w-3xl sm:text-base">
            기록을 많이 남기지 않아도 괜찮습니다.
            <br />
            중요한 건 지금 몸 상태에서 가장 효과가 큰 행동 하나를 매일 이어가게 만드는 것입니다.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href="/signup"
            className="ui-button-primary ui-button-primary-wide"
          >
            회원가입하고 코칭 시작
          </a>
          <Link
            href="/login"
            className="ui-button-secondary ui-button-secondary-wide"
          >
            로그인
          </Link>
        </div>
      </div>
    </section>
  );
}
