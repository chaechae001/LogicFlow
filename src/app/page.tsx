import Link from "next/link";

const thinkingStages = [
  "목적·맥락 이해",
  "현상 관찰",
  "문제 정의",
  "문제 분해·구조화",
  "가설 설정",
  "근거 수집·검증",
  "대안 비교·의사결정",
  "해결안 설계·실행",
  "결과 평가",
  "결론 전달·회고",
] as const;

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[0_24px_80px_rgba(23,42,58,0.08)] sm:p-10 lg:p-14">
        <header className="flex items-center justify-between gap-6 border-b border-[var(--line)] pb-5">
          <p className="text-sm font-bold tracking-[-0.02em] text-[var(--ink)]">
            Thinking Flow
          </p>
          <p className="text-xs font-semibold tracking-[0.12em] text-[var(--muted)] uppercase">
            Repository bootstrap
          </p>
        </header>

        <div className="grid flex-1 items-center gap-14 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:py-20">
          <div>
            <p className="mb-6 text-sm font-semibold text-[var(--accent)]">
              먼저 쓰고, 그다음 점검합니다.
            </p>
            <h1 className="max-w-4xl font-serif text-[clamp(3rem,8vw,7.5rem)] leading-[0.94] font-semibold tracking-[-0.065em] text-balance text-[var(--ink)]">
              답보다 먼저,
              <br />
              생각의 흐름.
            </h1>
            <p className="mt-9 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Thinking Flow는 AI가 답을 대신 만드는 곳이 아닙니다. 사용자가
              자신의 판단을 먼저 기록하고, 근거와 변화를 끝까지 보존하는 사고
              학습 공간입니다.
            </p>
            <Link
              className="mt-9 inline-flex min-h-12 items-center gap-8 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--accent)]"
              href="/practice"
            >
              실무 문제로 연습하기
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <aside
            aria-label="Thinking Flow의 10단계 사고 흐름"
            className="relative border-l border-[var(--line-strong)] pl-8 sm:pl-10"
          >
            <p className="mb-7 text-xs font-bold tracking-[0.16em] text-[var(--muted)] uppercase">
              10-stage practice
            </p>
            <ol className="space-y-4">
              {thinkingStages.map((stage, index) => (
                <li
                  className="grid grid-cols-[2rem_1fr] items-center gap-4 text-sm"
                  key={stage}
                >
                  <span className="font-mono text-xs text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="border-b border-[var(--line)] pb-4 font-semibold text-[var(--ink)]">
                    {stage}
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <footer className="flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-xs leading-5 text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>사용자가 먼저 쓰고, AI는 그다음에 질문합니다.</p>
          <p>Guided Practice · Olive Young O2O</p>
        </footer>
      </section>
    </main>
  );
}
