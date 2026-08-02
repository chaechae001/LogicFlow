import Link from "next/link";

import type { PracticeCase } from "../../domain";

interface PracticeLibraryProps {
  practiceCases: PracticeCase[];
}

const difficultyLabels: Record<PracticeCase["difficulty"], string> = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

export function PracticeLibrary({ practiceCases }: PracticeLibraryProps) {
  if (practiceCases.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-8 py-16 text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)]">
          준비된 Practice Case가 없습니다.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          새로운 실무 연습 문제가 준비되면 이곳에서 선택할 수 있습니다.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      {practiceCases.map((practiceCase, index) => (
        <article
          className="group relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_20px_70px_rgba(23,42,58,0.07)] transition-transform duration-300 hover:-translate-y-1"
          key={practiceCase.id}
        >
          <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-[0.08em] text-[var(--accent)] uppercase">
                <span>Available case {String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden="true">·</span>
                <span>{practiceCase.domain}</span>
              </div>
              <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.12] font-semibold tracking-[-0.045em] text-balance text-[var(--ink)] sm:text-5xl">
                {practiceCase.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
                {practiceCase.problemPattern}
              </p>

              <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-[var(--line)] pt-7 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold tracking-[0.1em] text-[var(--muted)] uppercase">
                    역할
                  </dt>
                  <dd className="mt-2 text-sm font-semibold leading-6 text-[var(--ink)]">
                    {practiceCase.role}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold tracking-[0.1em] text-[var(--muted)] uppercase">
                    난이도 · 예상 시간
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-[var(--ink)]">
                    {difficultyLabels[practiceCase.difficulty]} · 약 {practiceCase.expectedMinutes}분
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col justify-between border-t border-[var(--line)] bg-[var(--ink)] p-8 text-white sm:p-10 lg:border-t-0 lg:border-l lg:p-12">
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-[#9fcbd8] uppercase">
                  사고 도구
                </p>
                <p className="mt-4 text-xl leading-8 font-semibold">
                  {practiceCase.primaryFramework}
                </p>
                <ul className="mt-5 space-y-2 text-sm leading-6 text-[#c9d7de]">
                  {practiceCase.supportingFrameworks.map((framework) => (
                    <li key={framework}>— {framework}</li>
                  ))}
                </ul>
                <p className="mt-8 border-t border-white/15 pt-5 text-xs leading-5 text-[#9fb1bb]">
                  공개 정보와 연습용 가정 기반 · 내부 데이터 미제공
                </p>
              </div>

              <Link
                className="mt-10 inline-flex min-h-12 items-center justify-between rounded-full bg-white px-6 py-3 text-sm font-bold text-[var(--ink)] transition-colors group-hover:bg-[#d8eef3]"
                href={`/cases/new?practiceCaseId=${practiceCase.id}`}
              >
                이 Case 살펴보기
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
