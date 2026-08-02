"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { PracticeCase } from "../../domain";
import { createBrowserThinkingCaseRepository } from "../../repositories/browser-repository";
import {
  startPracticeCase,
  startPracticeCaseValuesSchema,
  type StartPracticeCaseValues,
} from "./start-practice-case";

type FieldErrors = Partial<Record<keyof StartPracticeCaseValues, string>>;

interface CaseStartFormProps {
  practiceCase: PracticeCase;
}

export function CaseStartForm({ practiceCase }: CaseStartFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmissionError(null);
    const formData = new FormData(event.currentTarget);
    const result = startPracticeCaseValuesSchema.safeParse({
      initialImpression: formData.get("initialImpression"),
      initialSolutionIdea: formData.get("initialSolutionIdea"),
      decisionQuestion: formData.get("decisionQuestion"),
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors({
        initialImpression: errors.initialImpression?.[0],
        initialSolutionIdea: errors.initialSolutionIdea?.[0],
        decisionQuestion: errors.decisionQuestion?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setSubmissionError(null);

    try {
      const repository = createBrowserThinkingCaseRepository();
      const { destination } = await startPracticeCase(
        repository,
        practiceCase,
        result.data,
      );
      router.push(destination);
    } catch {
      setSubmissionError(
        "Case를 저장하지 못했습니다. 브라우저 저장 공간을 확인한 뒤 다시 시도해주세요.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--accent)] uppercase">
          작성자 영역
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
          답을 보기 전에,
          <br />내 생각부터 남깁니다.
        </h2>
        <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
          완성된 문장일 필요는 없습니다. 지금 떠오르는 관찰과 판단을 그대로
          적어두면 이후 변화와 비교할 수 있습니다.
        </p>
      </div>

      <CaseStartField
        error={fieldErrors.initialImpression}
        id="initialImpression"
        label="내 첫 생각"
        placeholder="이 상황에서 가장 먼저 눈에 들어온 점과 아직 확신하지 못한 점을 적어보세요."
        rows={6}
        disabled={isSubmitting}
      />
      <CaseStartField
        error={fieldErrors.initialSolutionIdea}
        id="initialSolutionIdea"
        label="이미 떠오른 해결안"
        placeholder="검증 전 아이디어라는 점을 염두에 두고, 지금 떠오른 방향을 기록해보세요."
        rows={5}
        disabled={isSubmitting}
      />
      <CaseStartField
        error={fieldErrors.decisionQuestion}
        id="decisionQuestion"
        label="이 Case의 핵심 의사결정 질문"
        placeholder="이 Case를 마쳤을 때 어떤 결정을 내릴 수 있어야 하는지 질문으로 적어보세요."
        rows={4}
        disabled={isSubmitting}
      />

      {submissionError ? (
        <p
          className="rounded-2xl border border-[#c7776b] bg-[#fff5f2] px-5 py-4 text-sm leading-6 text-[#7b3028]"
          role="alert"
        >
          {submissionError}
        </p>
      ) : null}

      <div className="border-t border-[var(--line)] pt-7">
        <button
          className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[var(--ink)] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[var(--accent)] disabled:cursor-wait disabled:bg-[var(--muted)] sm:w-auto sm:min-w-56"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Case를 저장하는 중..." : "내 생각으로 Case 시작하기"}
        </button>
        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
          입력 내용은 이 브라우저에 저장되며, AI 피드백은 아직 제공되지 않습니다.
        </p>
      </div>
    </form>
  );
}

interface CaseStartFieldProps {
  disabled: boolean;
  error?: string;
  id: keyof StartPracticeCaseValues;
  label: string;
  placeholder: string;
  rows: number;
}

function CaseStartField({
  disabled,
  error,
  id,
  label,
  placeholder,
  rows,
}: CaseStartFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label className="block text-sm font-bold text-[var(--ink)]" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className="mt-3 block w-full resize-y rounded-3xl border border-[var(--line-strong)] bg-white px-5 py-4 text-base leading-7 text-[var(--ink)] placeholder:text-[#8b9ba5] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:outline-none"
        disabled={disabled}
        id={id}
        name={id}
        placeholder={placeholder}
        rows={rows}
      />
      {error ? (
        <p className="mt-2 text-sm text-[#9b3e34]" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
