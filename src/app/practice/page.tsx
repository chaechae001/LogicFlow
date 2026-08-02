import type { Metadata } from "next";

import { SiteHeader } from "../../components/site-header";
import { PracticeLibrary } from "../../features/practice/practice-library";
import { listPracticeCases } from "../../features/practice/practice-case-catalog";

export const metadata: Metadata = {
  title: "Practice Library | Thinking Flow",
  description: "가상 현업형 문제를 선택하고 내 생각부터 시작합니다.",
};

export default async function PracticePage() {
  const practiceCases = await listPracticeCases();

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
      <SiteHeader />

      <div className="mx-auto max-w-7xl py-14 sm:py-20">
        <section className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
              Guided practice
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-[clamp(3.25rem,6vw,6rem)] leading-[0.95] font-semibold tracking-[-0.06em] text-balance text-[var(--ink)]">
              실무 문제를,
              <br />답 없이 시작합니다.
            </h1>
          </div>
          <div className="border-l border-[var(--line-strong)] pl-7">
            <p className="text-base leading-8 text-[var(--muted)]">
              Case를 고른 뒤 먼저 자신의 관찰, 아이디어, 의사결정 질문을
              기록합니다. 예시 답안과 AI 제안은 시작 전에 보여주지 않습니다.
            </p>
            <p className="mt-5 font-mono text-xs font-semibold text-[var(--accent)]">
              {String(practiceCases.length).padStart(2, "0")} AVAILABLE
            </p>
          </div>
        </section>

        <section aria-labelledby="available-cases" className="mt-16 sm:mt-20">
          <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h2 className="text-sm font-bold text-[var(--ink)]" id="available-cases">
              지금 시작할 수 있는 Case
            </h2>
            <p className="text-xs text-[var(--muted)]">
              MVP · {practiceCases.length}개 Case
            </p>
          </div>
          <PracticeLibrary practiceCases={practiceCases} />
        </section>

        <section className="mt-8 rounded-[2rem] border border-dashed border-[var(--line-strong)] px-7 py-8 sm:px-10">
          <p className="text-xs font-bold tracking-[0.12em] text-[var(--muted)] uppercase">
            Coming soon
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            다른 도메인의 Practice Case, My Case, AI Scenario는 첫 Guided Practice
            흐름이 검증된 뒤 추가됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}
