import Link from "next/link";

import { thinkingStageSchema } from "../../../../../domain";
import { WorkspaceShellRoute } from "../../../../../features/workspace/workspace-shell";

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

  if (stageResult.success) {
    return <WorkspaceShellRoute caseId={caseId} stage={stageResult.data} />;
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
      <section className="mx-auto mt-16 max-w-3xl rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[0_24px_80px_rgba(23,42,58,0.08)] sm:p-12">
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
          Invalid stage
        </p>
        <h1 className="mt-5 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
          시작 단계를 확인할 수 없습니다.
        </h1>
        <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
          Practice Library에서 Case를 다시 선택해주세요.
        </p>

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
