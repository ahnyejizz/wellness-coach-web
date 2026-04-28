"use client";

import { useRef, useState } from "react";

import { healthAssistantDisclaimer, healthQuestionSummaries, suggestedHealthQuestions } from "@/lib/health/content";

type HealthCoachAssistantProps = {
  focusLabel: string;
  userName: string;
};

type HealthChatResponse = {
  answer?: string;
  disclaimer?: string;
  error?: string;
  model?: string;
};

export default function HealthCoachAssistant({ focusLabel, userName }: HealthCoachAssistantProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [question, setQuestion] = useState<string>(suggestedHealthQuestions[0]);
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerDisclaimer, setAnswerDisclaimer] = useState(healthAssistantDisclaimer);
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function syncQuestionTextarea(nextQuestion: string) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.value = nextQuestion;

    requestAnimationFrame(() => {
      const cursorPosition = nextQuestion.length;
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  function fillSuggestedQuestion(nextQuestion: string) {
    setQuestion(nextQuestion);
    syncQuestionTextarea(nextQuestion);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuestion = question.trim();

    if (!normalizedQuestion) {
      setError("질문을 먼저 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSubmittedQuestion(normalizedQuestion);

    try {
      const response = await fetch("/api/health-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: normalizedQuestion }),
      });

      const payload = (await response.json()) as HealthChatResponse;

      if (!response.ok) {
        throw new Error(payload.error || "웰니스 코치 응답을 불러오지 못했습니다.");
      }

      setAnswer(payload.answer?.trim() || "");
      setAnswerDisclaimer(payload.disclaimer?.trim() || healthAssistantDisclaimer);
      setModel(payload.model?.trim() || "");
    } catch (submitError) {
      setAnswer("");
      setModel("");
      setAnswerDisclaimer(healthAssistantDisclaimer);
      setError(submitError instanceof Error ? submitError.message : "웰니스 코치 응답을 불러오지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel ui-panel-shell">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="ui-kicker">Health Q&A</p>
          <h2 className="ui-title-3 mt-3">{userName}님을 위한 웰니스 질문 코치</h2>
          <p className="ui-copy mt-4">
            현재 우선 코칭은 {focusLabel} 기준으로 보고 있습니다.
            <br />
            수면, 운동, 식단, 생활 습관 관련 질문을 입력하면 Next 서버 안에서 안전하게 Gemini AI 응답을 받아옵니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="ui-pill-static">로그인 사용자 전용</span>
          <span className="ui-pill">일반 웰니스 정보</span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="ui-card-raised">
          <div className="flex flex-wrap gap-2">
            {suggestedHealthQuestions.map((suggestedQuestion) => {
              const isActive = question.trim() === suggestedQuestion;

              return (
                <button
                  key={suggestedQuestion}
                  type="button"
                  aria-pressed={isActive}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => fillSuggestedQuestion(suggestedQuestion)}
                  className={isActive ? "ui-pill bg-[var(--foreground)] text-[#fffaf2]" : "ui-pill bg-white/80"}
                >
                  {suggestedQuestion}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-5">
            <label htmlFor="health-question" className="ui-field-label">
              웰니스 질문
            </label>
            <textarea
              id="health-question"
              ref={textareaRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="예: 야근이 길어지면 수면과 식단이 같이 무너지는데, 회복 루틴을 어떻게 잡으면 좋을까요?"
              className="ui-field-control-strong mt-3 min-h-36 resize-y"
              maxLength={500}
            />

            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
              <span>최대 500자</span>
              <span>{question.trim().length}/500</span>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--muted)]">
                증상이 심하거나 빠르게 악화되면 온라인 답변보다 직접 진료가 우선입니다.
              </p>
              <button type="submit" className="ui-button-primary w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "답변 생성 중..." : "질문하기"}
              </button>
            </div>
          </form>

          {error ? (
            <div aria-live="polite" className="ui-alert mt-5">
              {error}
            </div>
          ) : null}

          <div aria-live="polite" className="ui-card mt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">최근 질문</p>
                <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                  {submittedQuestion || "아직 질문을 보내지 않았습니다."}
                </p>
              </div>
              {model ? <span className="ui-pill-static">응답 모델: {model}</span> : null}
            </div>

            {answer ? (
              <>
                <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">{answer}</div>
                <div className="mt-5 rounded-[1.2rem] border border-[var(--border)] bg-white/80 px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                  {answerDisclaimer}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                질문을 보내면 여기에서 요약된 웰니스 가이드와 주의 포인트를 확인할 수 있습니다.
              </p>
            )}
          </div>
        </div>

        <aside className="panel-dark rounded-[1.8rem] p-6 text-[#f7f1e8]">
          <p className="ui-kicker text-[#ffb297]">Useful summaries</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">자주 보는 웰니스 Q&A 요약</h3>
          <p className="mt-4 text-sm leading-7 text-[#d6ddd7]">
            아직 질문을 입력하지 않아도 바로 읽을 수 있도록, 생활 웰니스에서 자주 나오는 질문들을 짧게 정리해두었습니다.
          </p>

          <div className="mt-5 space-y-3">
            {healthQuestionSummaries.map((item) => (
              <article key={item.id} className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
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
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {healthQuestionSummaries.map((item) => (
          <article key={`${item.id}-seek-care`} className="ui-card">
            <p className="text-sm text-[var(--muted)]">{item.category} 체크 포인트</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)]">{item.question}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.seekCare}</p>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => fillSuggestedQuestion(item.question)}
              className="mt-4 ui-button-secondary w-full"
            >
              이 질문으로 바로 물어보기
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
