import { healthQuestionSummaries } from "@/lib/health/content";

export default function CoachQuestionSummaryPanel() {
  return (
    <aside className="panel-dark ui-hover-panel-dark rounded-[1.8rem] p-6 text-[#f7f1e8]">
      <p className="ui-kicker text-[#ffb297]">Useful summaries</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">자주 묻는 웰니스 Q&A 요약</h3>
      <p className="mt-4 text-sm leading-7 text-[#d6ddd7]">
        질문을 입력하지 않아도 바로 읽을 수 있도록, 자주 나오는 질문들을 짧게 정리해두었습니다.
      </p>

      <div className="mt-5 space-y-3">
        {healthQuestionSummaries.map((item) => (
          <article key={item.id} className="ui-hover-card-dark-soft rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#ffd6c8]">
                {item.category}
              </span>
            </div>
            <h4 className="mt-3 text-lg font-semibold leading-7">{item.question}</h4>
            <p className="mt-3 text-sm leading-7 text-[#e7ece8]">{item.summary}</p>
            <p className="mt-3 text-sm leading-6 text-[#b9c9c2]">바로 적용: {item.actionTip}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
