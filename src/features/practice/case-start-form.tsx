"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { PracticeCase } from "../../domain";
import { createBrowserThinkingCaseRepository } from "../../repositories/browser-repository";
import {
  getCaseStartErrorMessage,
  type CaseStartErrorMessage,
} from "./case-start-error";
import { startPracticeCase } from "./start-practice-case";

interface CaseStartFormProps {
  practiceCase: PracticeCase;
}

export function CaseStartForm({ practiceCase }: CaseStartFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [submissionError, setSubmissionError] =
    useState<CaseStartErrorMessage | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isResetting) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setResetMessage(null);

    try {
      const repository = createBrowserThinkingCaseRepository();
      const { destination } = await startPracticeCase(
        repository,
        practiceCase,
      );
      router.push(destination);
    } catch (error) {
      const errorMessage = getCaseStartErrorMessage(error);
      logCaseStartFailure("Practice Case 시작 실패", errorMessage, error);
      setSubmissionError(errorMessage);
      setIsSubmitting(false);
    }
  }

  async function handleResetLocalData() {
    if (isSubmitting || isResetting) {
      return;
    }

    setIsResetting(true);
    setResetMessage(null);

    try {
      const repository = createBrowserThinkingCaseRepository();
      await repository.resetLocalData();
      setSubmissionError(null);
      setResetMessage(
        "Thinking Flow V2 로컬 데이터를 초기화했습니다. 이제 이 문제로 다시 시작할 수 있습니다.",
      );
    } catch (error) {
      const errorMessage = getCaseStartErrorMessage(error);
      logCaseStartFailure("로컬 데이터 초기화 실패", errorMessage, error);
      setSubmissionError(errorMessage);
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
          10단계 Guided Practice
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
          문제를 확인했다면,
          <br />바로 사고를 시작합니다.
        </h2>
        <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
          첫 생각과 의사결정 질문은 Workspace 안에서 자유 작성 또는 구조화 입력으로
          정리합니다. Case를 시작하기 전에 해결안을 정할 필요는 없습니다.
        </p>
      </div>

      {submissionError ? (
        <section
          className="rounded-2xl border border-[#c7776b] bg-[#fff5f2] px-5 py-4 text-sm leading-6 text-[#7b3028]"
          role="alert"
        >
          <p>{submissionError.message}</p>
          {submissionError.canResetLocalData ? (
            <div className="mt-4 border-t border-[#e5b8b1] pt-4">
              <p className="text-xs leading-5">
                초기화하면 이 브라우저의 Thinking Flow V2 데이터만 삭제됩니다.
                V1 데이터는 유지되며 자동 변환이나 자동 삭제는 수행하지 않습니다.
              </p>
              <button
                className="mt-3 rounded-full border border-[#9b3e34] px-4 py-2 text-xs font-bold hover:bg-[#9b3e34] hover:text-white disabled:cursor-wait disabled:opacity-60"
                disabled={isResetting}
                onClick={handleResetLocalData}
                type="button"
              >
                {isResetting
                  ? "로컬 데이터를 초기화하는 중..."
                  : "V2 로컬 데이터 초기화"}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {resetMessage ? (
        <p
          className="rounded-2xl border border-[#79a998] bg-[#edf8f3] px-5 py-4 text-sm leading-6 text-[#285f50]"
          role="status"
        >
          {resetMessage}
        </p>
      ) : null}

      <div className="border-t border-[var(--line)] pt-7">
        <button
          className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[var(--ink)] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[var(--accent)] disabled:cursor-wait disabled:bg-[var(--muted)] sm:w-auto sm:min-w-56"
          disabled={isSubmitting || isResetting}
          type="submit"
        >
          {isSubmitting ? "Case를 만드는 중..." : "이 문제로 시작하기"}
        </button>
        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
          새 Case는 V1과 분리된 schemaVersion 3 저장소에 보관됩니다.
        </p>
      </div>
    </form>
  );
}

function logCaseStartFailure(
  action: string,
  errorMessage: CaseStartErrorMessage,
  error: unknown,
) {
  if (errorMessage.kind === "unknown") {
    console.error(`[Thinking Flow] ${action}`, error);
    return;
  }

  console.warn(`[Thinking Flow] ${action}`, {
    error,
    kind: errorMessage.kind,
  });
}
