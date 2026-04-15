export type HomeCoachAreaItem = {
  title: string;
  subtitle: string;
  summary: string;
  accent: string;
  softAccent: string;
  bullets: string[];
};

type HomeCoachAreaProps = {
  coachAreas: HomeCoachAreaItem[];
};

export default function HomeCoachArea({ coachAreas }: HomeCoachAreaProps) {
  return (
    <section id="coach-areas" className="grid gap-5 md:grid-cols-3">
      {coachAreas.map((coachArea) => (
        <article
          key={coachArea.title}
          className="panel rounded-[1.8rem] px-6 py-6 sm:px-7"
        >
          <div
            className="mb-5 inline-flex rounded-full px-3 py-1 text-sm font-semibold"
            style={{
              backgroundColor: coachArea.softAccent,
              color: coachArea.accent,
            }}
          >
            {coachArea.title}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {coachArea.subtitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {coachArea.summary}
          </p>

          <div className="mt-6 space-y-3">
            {coachArea.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--border)] bg-white/72 px-4 py-3"
              >
                <span
                  className="mt-1 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: coachArea.accent }}
                />
                <p className="text-sm leading-7 text-[var(--foreground)]">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
