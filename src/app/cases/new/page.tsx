import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "../../../components/site-header";
import { CaseStartForm } from "../../../features/practice/case-start-form";
import { findPracticeCase } from "../../../features/practice/practice-case-catalog";

export const metadata: Metadata = {
  title: "Case 시작 | Thinking Flow",
  description: "Practice Case를 읽고 내 첫 생각부터 기록합니다.",
};

interface NewCasePageProps {
  searchParams: Promise<{
    practiceCaseId?: string | string[];
  }>;
}

export default async function NewCasePage({ searchParams }: NewCasePageProps) {
  const resolvedSearchParams = await searchParams;
  const practiceCaseId = Array.isArray(resolvedSearchParams.practiceCaseId)
    ? resolvedSearchParams.practiceCaseId[0]
    : resolvedSearchParams.practiceCaseId;
  const practiceCase = practiceCaseId
    ? await findPracticeCase(practiceCaseId)
    : null;

  if (!practiceCase) {
    return (
      <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <SiteHeader />
        <section className="mx-auto mt-20 max-w-2xl rounded-[2rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-8 py-14 text-center sm:px-12">
          <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
            Case not found
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
            시작할 Practice Case를 찾지 못했습니다.
          </h1>
          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
            Practice Library로 돌아가 현재 사용할 수 있는 Case를 선택해주세요.
          </p>
          <Link
            className="mt-8 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--accent)]"
            href="/practice"
          >
            Practice Library로 돌아가기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
      <SiteHeader />

      <div className="mx-auto max-w-7xl py-10 sm:py-14">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
          href="/practice"
        >
          <span aria-hidden="true">←</span>
          Practice Library
        </Link>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
          <section className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] shadow-[0_20px_70px_rgba(23,42,58,0.07)]">
            <div className="p-7 sm:p-10 lg:p-12">
              <div className="flex flex-wrap gap-2 text-xs font-bold text-[var(--accent)]">
                <span className="rounded-full border border-[var(--line-strong)] px-3 py-1.5">
                  {practiceCase.role}
                </span>
                <span className="rounded-full border border-[var(--line-strong)] px-3 py-1.5">
                  중급 · 약 {practiceCase.expectedMinutes}분
                </span>
              </div>
              <h1 className="mt-7 font-serif text-4xl leading-[1.12] font-semibold tracking-[-0.045em] text-balance text-[var(--ink)] sm:text-5xl">
                {practiceCase.title}
              </h1>
              <p className="mt-6 text-base leading-8 text-[var(--muted)]">
                {practiceCase.businessContext}
              </p>
            </div>

            <div className="border-y border-[var(--line)] bg-[#edf3f5] p-7 sm:p-10">
              <p className="text-xs font-bold tracking-[0.12em] text-[var(--accent)] uppercase">
                업무 요청
              </p>
              <p className="mt-4 text-base leading-8 font-semibold text-[var(--ink)]">
                {practiceCase.taskRequest}
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              <CaseContextList
                eyebrow="주어진 전제"
                items={practiceCase.knownFacts}
                title="현재 알고 시작하는 것"
              />
              <CaseContextList
                eyebrow="검증 필요"
                items={practiceCase.unknowns}
                title="아직 모르는 것"
                variant="unknown"
              />
            </div>

            <p className="border-t border-[var(--line)] px-7 py-6 text-xs leading-6 text-[var(--muted)] sm:px-10">
              {practiceCase.sourceNote}
            </p>
          </section>

          <section className="self-start rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[0_20px_70px_rgba(23,42,58,0.07)] sm:p-10 xl:sticky xl:top-8">
            <CaseStartForm practiceCase={practiceCase} />
          </section>
        </div>
      </div>
    </main>
  );
}

interface CaseContextListProps {
  eyebrow: string;
  items: string[];
  title: string;
  variant?: "known" | "unknown";
}

function CaseContextList({
  eyebrow,
  items,
  title,
  variant = "known",
}: CaseContextListProps) {
  return (
    <section
      className={`p-7 sm:p-10 ${
        variant === "unknown"
          ? "border-t border-[var(--line)] bg-[var(--ink)] text-white sm:border-t-0 sm:border-l"
          : ""
      }`}
    >
      <p
        className={`text-xs font-bold tracking-[0.12em] uppercase ${
          variant === "unknown" ? "text-[#9fcbd8]" : "text-[var(--accent)]"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      <ul
        className={`mt-5 space-y-4 text-sm leading-6 ${
          variant === "unknown" ? "text-[#c9d7de]" : "text-[var(--muted)]"
        }`}
      >
        {items.map((item) => (
          <li className="flex gap-3" key={item}>
            <span aria-hidden="true" className="text-[var(--accent)]">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
