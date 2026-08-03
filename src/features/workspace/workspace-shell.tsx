"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { RouteErrorState } from "../../components/route-error-state";
import { RouteLoadingState } from "../../components/route-loading-state";
import { SiteHeader } from "../../components/site-header";
import {
  THINKING_STAGES,
  type CaseStepStatus,
  type ThinkingStage,
  type WritingMode,
} from "../../domain";
import { createBrowserThinkingCaseRepository } from "../../repositories/browser-repository";
import type { ThinkingCaseBundle } from "../../repositories";
import { getPracticeCaseById } from "../practice/practice-case-catalog";
import {
  CASE_STEP_STATUS_LABELS,
  WORKSPACE_STAGES,
  getSoftGateNotice,
  getStageStep,
  getWorkspaceStage,
  type SoftGateNotice,
} from "./workspace-stage-config";

interface WorkspaceShellRouteProps {
  caseId: string;
  stage: ThinkingStage;
}

interface PendingNavigation {
  stage: ThinkingStage;
  notice: SoftGateNotice;
}

export type AiCoachState = "locked" | "ready";

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; bundle: ThinkingCaseBundle }
  | { status: "not_found" }
  | { status: "error" };

export function WorkspaceShellRoute({
  caseId,
  stage,
}: WorkspaceShellRouteProps) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadCase() {
      try {
        const repository = createBrowserThinkingCaseRepository();
        const bundle = await repository.getCase(caseId);

        if (!isActive) {
          return;
        }

        setLoadState(bundle ? { status: "loaded", bundle } : { status: "not_found" });
      } catch {
        if (isActive) {
          setLoadState({ status: "error" });
        }
      }
    }

    void loadCase();

    return () => {
      isActive = false;
    };
  }, [caseId, loadAttempt]);

  if (loadState.status === "loading") {
    return <RouteLoadingState label="Thinking Case를 불러오는 중" />;
  }

  if (loadState.status === "error") {
    return (
      <RouteErrorState
        description="이 브라우저에 저장된 Thinking Case를 읽지 못했습니다. 저장 공간을 확인한 뒤 다시 시도해주세요."
        reset={() => {
          setLoadState({ status: "loading" });
          setLoadAttempt((attempt) => attempt + 1);
        }}
        title="Workspace를 불러오지 못했습니다."
      />
    );
  }

  if (loadState.status === "not_found") {
    return <WorkspaceNotFound />;
  }

  return <WorkspaceShell bundle={loadState.bundle} stage={stage} />;
}

interface WorkspaceShellProps {
  aiCoachState?: AiCoachState;
  bundle: ThinkingCaseBundle;
  stage: ThinkingStage;
}

export function WorkspaceShell({
  aiCoachState = "locked",
  bundle,
  stage,
}: WorkspaceShellProps) {
  const router = useRouter();
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);
  const stageDefinition = getWorkspaceStage(stage);
  const currentStageIndex = THINKING_STAGES.indexOf(stage);
  const currentStep = getStageStep(bundle.steps, stage);
  const practiceCase = bundle.thinkingCase.practiceCaseId
    ? getPracticeCaseById(bundle.thinkingCase.practiceCaseId)
    : null;
  const saveLabel = useMemo(
    () => formatSavedAt(bundle.thinkingCase.updatedAt),
    [bundle.thinkingCase.updatedAt],
  );

  const navigateToStage = useCallback(
    (targetStage: ThinkingStage) => {
      if (targetStage === stage) {
        return;
      }

      const notice = getSoftGateNotice(bundle.steps, stage, targetStage);
      if (notice) {
        setPendingNavigation({ stage: targetStage, notice });
        return;
      }

      router.push(buildWorkspacePath(bundle.thinkingCase.id, targetStage));
    },
    [bundle.steps, bundle.thinkingCase.id, router, stage],
  );

  function continueNavigation() {
    if (!pendingNavigation) {
      return;
    }

    router.push(
      buildWorkspacePath(bundle.thinkingCase.id, pendingNavigation.stage),
    );
    setPendingNavigation(null);
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-7 lg:px-10 lg:py-7">
      <div className="mx-auto max-w-[96rem]">
        <SiteHeader />

        <header className="flex flex-col gap-5 border-b border-[var(--line)] py-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
              Guided Thinking Workspace
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-3xl leading-tight font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-4xl">
              {bundle.thinkingCase.title}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2 text-[var(--ink)]">
              {currentStageIndex + 1} / {THINKING_STAGES.length}
            </span>
            <span
              aria-label={`저장 상태: ${saveLabel}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#dcecef] px-4 py-2 text-[#19576b]"
              role="status"
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#24809a]" />
              {saveLabel}
            </span>
          </div>
        </header>

        <div className="grid overflow-hidden border-x border-b border-[var(--line)] bg-[var(--surface)] lg:min-h-[42rem] lg:grid-cols-[15rem_minmax(0,1fr)_19rem]">
          <StageNavigation
            activeStage={stage}
            onNavigate={navigateToStage}
            steps={bundle.steps}
          />

          <section
            aria-labelledby="workspace-stage-title"
            className="min-w-0 border-y border-[var(--line)] bg-white px-6 py-8 sm:px-9 lg:border-y-0 lg:border-x lg:px-12 lg:py-11"
          >
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-xs font-bold tracking-[0.12em] text-[var(--accent)] uppercase">
                  Step {String(currentStageIndex + 1).padStart(2, "0")}
                </p>
                <StepStatusBadge status={currentStep?.status ?? "not_started"} />
              </div>
              <h2
                className="mt-4 font-serif text-4xl font-semibold tracking-[-0.045em] text-[var(--ink)] sm:text-5xl"
                id="workspace-stage-title"
              >
                {stageDefinition.label}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
                {stageDefinition.objective}
              </p>

              <WritingModeShell key={stage} />

              {practiceCase ? (
                <PracticeCaseReference practiceCase={practiceCase} />
              ) : null}
            </div>
          </section>

          <AiCoachPanel state={aiCoachState} />
        </div>

        <WorkspaceFooter
          currentStageIndex={currentStageIndex}
          onNavigate={navigateToStage}
        />
      </div>

      {pendingNavigation ? (
        <SoftGateDialog
          notice={pendingNavigation.notice}
          onCancel={() => setPendingNavigation(null)}
          onContinue={continueNavigation}
        />
      ) : null}
    </main>
  );
}

interface StageNavigationProps {
  activeStage: ThinkingStage;
  onNavigate: (stage: ThinkingStage) => void;
  steps: ThinkingCaseBundle["steps"];
}

function WritingModeShell() {
  const [mode, setMode] = useState<WritingMode | null>(null);

  return (
    <section
      aria-labelledby="writing-mode-title"
      className="mt-10 rounded-[1.75rem] border border-[var(--line-strong)] bg-[var(--surface)] px-6 py-7 sm:px-8"
    >
      <p className="text-xs font-bold tracking-[0.12em] text-[var(--muted)] uppercase">
        사용자 작성 영역
      </p>
      <h3
        className="mt-3 text-xl font-bold tracking-[-0.02em] text-[var(--ink)]"
        id="writing-mode-title"
      >
        이번 단계는 어떻게 시작할까요?
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        한 번에 하나의 작성 화면을 사용합니다. 방식을 바꿔도 각 방식에서 작성한
        내용과 수정 이력은 삭제되지 않습니다.
      </p>

      <div aria-label="작성 방식" className="mt-6 grid gap-3 sm:grid-cols-2" role="group">
        <WritingModeButton
          description="큰 작성 영역에서 생각의 흐름을 자유롭게 풀어냅니다."
          isSelected={mode === "freeform"}
          label="자유 작성"
          onSelect={() => setMode("freeform")}
        />
        <WritingModeButton
          description="단계별 질문과 카드의 안내를 따라 생각을 구조화합니다."
          isSelected={mode === "structured"}
          label="구조화 입력"
          onSelect={() => setMode("structured")}
        />
      </div>

      <div className="mt-6" role="status">
        {mode === null ? (
          <WritingModePlaceholder
            description="작성 방식을 선택하면 해당 입력 화면이 이곳에 열립니다."
            eyebrow="작성 방식 미선택"
            title="내 생각을 꺼낼 방식을 선택해주세요."
          />
        ) : mode === "freeform" ? (
          <WritingModePlaceholder
            description="실제 자유 작성 입력과 저장은 다음 단계 구현에서 연결됩니다."
            eyebrow="자유 작성 선택됨"
            title="자유 작성 화면이 들어갈 자리입니다."
          />
        ) : (
          <WritingModePlaceholder
            description="실제 질문별 입력과 저장은 다음 단계 구현에서 연결됩니다."
            eyebrow="구조화 입력 선택됨"
            title="구조화 질문과 카드가 들어갈 자리입니다."
          />
        )}
      </div>
    </section>
  );
}

interface WritingModeButtonProps {
  description: string;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
}

function WritingModeButton({
  description,
  isSelected,
  label,
  onSelect,
}: WritingModeButtonProps) {
  return (
    <button
      aria-pressed={isSelected}
      className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
        isSelected
          ? "border-[var(--accent)] bg-[#e4f1f4] text-[var(--ink)]"
          : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--accent)]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="flex items-center justify-between gap-4 text-sm font-bold">
        {label}
        <span
          aria-hidden="true"
          className={`h-3 w-3 rounded-full border ${
            isSelected
              ? "border-[var(--accent)] bg-[var(--accent)]"
              : "border-[var(--line-strong)] bg-white"
          }`}
        />
      </span>
      <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">
        {description}
      </span>
    </button>
  );
}

interface WritingModePlaceholderProps {
  description: string;
  eyebrow: string;
  title: string;
}

function WritingModePlaceholder({
  description,
  eyebrow,
  title,
}: WritingModePlaceholderProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-white px-5 py-7">
      <p className="text-xs font-bold tracking-[0.1em] text-[var(--accent)] uppercase">
        {eyebrow}
      </p>
      <p className="mt-2 text-sm font-bold text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{description}</p>
    </div>
  );
}

function StageNavigation({ activeStage, onNavigate, steps }: StageNavigationProps) {
  return (
    <nav aria-label="사고 단계" className="px-5 py-7 lg:px-6 lg:py-9">
      <p className="px-3 text-xs font-bold tracking-[0.12em] text-[var(--muted)] uppercase">
        10단계 Flow
      </p>
      <ol className="relative mt-6 space-y-1 before:absolute before:top-5 before:bottom-5 before:left-[1.55rem] before:w-px before:bg-[var(--line)]">
        {WORKSPACE_STAGES.map((definition, index) => {
          const isActive = definition.stage === activeStage;
          const status = getStageStep(steps, definition.stage)?.status ?? "not_started";

          return (
            <li className="relative" key={definition.stage}>
              <button
                aria-current={isActive ? "step" : undefined}
                className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-[var(--ink)] text-white"
                    : "text-[var(--ink)] hover:bg-white"
                }`}
                onClick={() => onNavigate(definition.stage)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                    isActive
                      ? "border-white bg-white text-[var(--ink)]"
                      : status === "completed"
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--line-strong)] bg-[var(--surface)] text-[var(--muted)]"
                  }`}
                >
                  {status === "completed" ? "✓" : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{definition.label}</span>
                  <span
                    className={`mt-0.5 block text-[0.68rem] ${
                      isActive ? "text-[#c7d8df]" : "text-[var(--muted)]"
                    }`}
                  >
                    {CASE_STEP_STATUS_LABELS[status]}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepStatusBadge({ status }: { status: CaseStepStatus }) {
  return (
    <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--muted)]">
      {CASE_STEP_STATUS_LABELS[status]}
    </span>
  );
}

function PracticeCaseReference({
  practiceCase,
}: {
  practiceCase: NonNullable<ReturnType<typeof getPracticeCaseById>>;
}) {
  return (
    <details className="group mt-8 border-t border-[var(--line)] pt-7">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white px-5 py-4 text-sm font-bold text-[var(--ink)] hover:border-[var(--accent)]">
        Practice 문제 다시 보기
        <span
          aria-hidden="true"
          className="text-[var(--accent)] transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 text-sm sm:p-6">
        <p className="text-xs font-bold tracking-[0.1em] text-[var(--accent)] uppercase">
          문제 상황
        </p>
        <p className="mt-2 leading-7 text-[var(--muted)]">
          {practiceCase.businessContext}
        </p>

        <p className="mt-6 text-xs font-bold tracking-[0.1em] text-[var(--accent)] uppercase">
          업무 요청
        </p>
        <p className="mt-2 leading-7 font-semibold text-[var(--ink)]">
          {practiceCase.taskRequest}
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <PracticeReferenceList
            items={practiceCase.knownFacts}
            title="알려진 전제"
          />
          <PracticeReferenceList
            items={practiceCase.unknowns}
            title="검증 필요 항목"
          />
        </div>
      </div>
    </details>
  );
}

function PracticeReferenceList({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <section>
      <h4 className="text-xs font-bold text-[var(--ink)]">{title}</h4>
      <ul className="mt-3 space-y-2 text-xs leading-5 text-[var(--muted)]">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
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

interface AiCoachPanelProps {
  onRequestReview?: () => void;
  state: AiCoachState;
}

export function AiCoachPanel({
  onRequestReview,
  state,
}: AiCoachPanelProps) {
  const isLocked = state === "locked";

  return (
    <aside aria-labelledby="ai-panel-title" className="px-6 py-8 lg:px-7 lg:py-11">
      <p className="text-xs font-bold tracking-[0.12em] text-[var(--accent)] uppercase">
        AI Coach
      </p>
      <h2 className="mt-3 text-lg font-bold text-[var(--ink)]" id="ai-panel-title">
        {isLocked
          ? "생각을 먼저 남겨주세요."
          : "내 생각을 점검할 준비가 됐습니다."}
      </h2>
      <div className="mt-7 border-l-2 border-[var(--line-strong)] pl-5">
        <p className="text-sm leading-7 text-[var(--muted)]">
          {isLocked
            ? "AI는 답을 먼저 만들지 않습니다. 사용자가 이 단계의 초안을 작성한 뒤에만 질문과 논리 공백 점검을 제공합니다."
            : "작성한 내용을 바탕으로 누락, 혼재된 전제와 논리적 공백을 질문으로 점검합니다. 답을 대신 확정하지 않습니다."}
        </p>
      </div>
      <button
        className={`mt-7 w-full rounded-full border px-5 py-3 text-sm font-bold ${
          isLocked
            ? "cursor-not-allowed border-[var(--line)] text-[var(--muted)]"
            : "border-[var(--ink)] bg-[var(--ink)] text-white hover:bg-[var(--accent)]"
        }`}
        disabled={isLocked}
        onClick={onRequestReview}
        type="button"
      >
        {isLocked ? "AI 점검은 작성 후 활성화됩니다" : "AI 점검 요청"}
      </button>
    </aside>
  );
}

interface WorkspaceFooterProps {
  currentStageIndex: number;
  onNavigate: (stage: ThinkingStage) => void;
}

function WorkspaceFooter({ currentStageIndex, onNavigate }: WorkspaceFooterProps) {
  const previousStage = THINKING_STAGES[currentStageIndex - 1];
  const nextStage = THINKING_STAGES[currentStageIndex + 1];

  return (
    <footer className="flex flex-col gap-4 border-x border-b border-[var(--line)] bg-[var(--surface)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <button
        className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-bold text-[var(--ink)] hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!previousStage}
        onClick={() => previousStage && onNavigate(previousStage)}
        type="button"
      >
        이전 단계
      </button>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          className="cursor-not-allowed rounded-full border border-[var(--line)] px-5 py-3 text-sm font-bold text-[var(--muted)] opacity-70"
          disabled
          type="button"
        >
          단계 내용 작성 전
        </button>
        <button
          className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
          disabled={!nextStage}
          onClick={() => nextStage && onNavigate(nextStage)}
          type="button"
        >
          다음 단계
        </button>
      </div>
    </footer>
  );
}

interface SoftGateDialogProps {
  notice: SoftGateNotice;
  onCancel: () => void;
  onContinue: () => void;
}

function SoftGateDialog({ notice, onCancel, onContinue }: SoftGateDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(23,42,58,0.48)] px-5 py-10">
      <section
        aria-describedby="soft-gate-description"
        aria-labelledby="soft-gate-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-[2rem] border border-[var(--line)] bg-white p-7 shadow-[0_28px_90px_rgba(23,42,58,0.24)] sm:p-9"
        role="dialog"
      >
        <p className="text-xs font-bold tracking-[0.12em] text-[#9b5d29] uppercase">
          미완료 단계 확인
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em] text-[var(--ink)]" id="soft-gate-title">
          이동할 수 있지만, 먼저 확인해보세요.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]" id="soft-gate-description">
          {notice.currentStageLabel} 단계는 아직 완료되지 않았습니다. 그래도 {notice.targetStageLabel} 단계로 이동할 수 있으며, 이동만으로 현재 단계가 완료되지는 않습니다.
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-bold text-[var(--ink)]"
            onClick={onCancel}
            type="button"
          >
            {notice.currentStageLabel}에 머물기
          </button>
          <button
            className="rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--accent)]"
            onClick={onContinue}
            type="button"
          >
            그래도 이동하기
          </button>
        </div>
      </section>
    </div>
  );
}

function WorkspaceNotFound() {
  const router = useRouter();

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <section className="w-full max-w-xl rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 text-center sm:p-12">
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
          Case not found
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
          저장된 Thinking Case가 없습니다.
        </h1>
        <p className="mt-5 leading-7 text-[var(--muted)]">
          이 브라우저에서 시작한 Case인지 확인하거나 Practice Library에서 새로 시작해주세요.
        </p>
        <button
          className="mt-8 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--accent)]"
          onClick={() => router.push("/practice")}
          type="button"
        >
          Practice Library로 이동
        </button>
      </section>
    </main>
  );
}

function buildWorkspacePath(caseId: string, stage: ThinkingStage): string {
  return `/cases/${caseId}/workspace/${stage}`;
}

function formatSavedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "이 브라우저에 저장됨";
  }

  return `${new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)} 저장됨`;
}
