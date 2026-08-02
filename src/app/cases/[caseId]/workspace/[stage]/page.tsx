import Link from "next/link";

import { SiteHeader } from "../../../../../components/site-header";
import { thinkingStageSchema } from "../../../../../domain";

interface WorkspaceTransitionPageProps {
  params: Promise<{
    caseId: string;
    stage: string;
  }>;
}

export default async function WorkspaceTransitionPage({
  params,
}: WorkspaceTransitionPageProps) {
  const { caseId, stage } = await params;
  const stageResult = thinkingStageSchema.safeParse(stage);

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
      <SiteHeader />
      <section className="mx-auto mt-16 max-w-3xl rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[0_24px_80px_rgba(23,42,58,0.08)] sm:p-12">
        {stageResult.success ? (
          <>
            <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
              Case created
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-tight font-semibold tracking-[-0.05em] text-[var(--ink)]">
              내 생각으로 Case를 시작했습니다.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
              최초 생각, 해결 아이디어, 의사결정 질문을 이 브라우저에
              저장했습니다. 8단계 Guided Workspace는 다음 Task에서 이 경로에
              연결됩니다.
            </p>
            <dl className="mt-10 grid gap-5 border-y border-[var(--line)] py-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold text-[var(--muted)]">Case ID</dt>
                <dd className="mt-2 break-all font-mono text-[var(--ink)]">{caseId}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-[var(--muted)]">시작 단계</dt>
                <dd className="mt-2 font-mono text-[var(--ink)]">{stageResult.data}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
              Invalid stage
            </p>
            <h1 className="mt-5 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
              시작 단계를 확인할 수 없습니다.
            </h1>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
              Practice Library에서 Case를 다시 선택해주세요.
            </p>
          </>
        )}

        <Link
          className="mt-8 inline-flex rounded-full border border-[var(--line-strong)] px-6 py-3 text-sm font-bold text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/practice"
        >
          Practice Library로 돌아가기
        </Link>
      </section>
    </main>
  );
}
