import {
  THINKING_STAGES,
  type CaseStep,
  type CaseStepStatus,
  type ThinkingStage,
} from "../../domain";

export interface WorkspaceStageDefinition {
  stage: ThinkingStage;
  label: string;
  shortLabel: string;
  objective: string;
}

export const WORKSPACE_STAGES: readonly WorkspaceStageDefinition[] = [
  {
    stage: "context",
    label: "목적·맥락 이해",
    shortLabel: "맥락",
    objective: "상황과 목표, 이해관계자, 제약과 지금 다루는 이유를 확인합니다.",
  },
  {
    stage: "observation",
    label: "현상 관찰",
    shortLabel: "관찰",
    objective: "확인된 사실과 행동, 지표, 해석과 미확인 사항을 분리합니다.",
  },
  {
    stage: "problem_definition",
    label: "문제 정의",
    shortLabel: "문제",
    objective: "사용자·상황·목표·어려움·영향을 포함해 문제를 정의합니다.",
  },
  {
    stage: "problem_structuring",
    label: "문제 분해·구조화",
    shortLabel: "구조화",
    objective: "분해 기준을 세우고 누락과 중복 없이 문제 구조를 살펴봅니다.",
  },
  {
    stage: "hypothesis",
    label: "가설 설정",
    shortLabel: "가설",
    objective: "원인·해결·결과·백업 가설을 검증 가능한 문장으로 만듭니다.",
  },
  {
    stage: "evidence_validation",
    label: "근거 수집·검증",
    shortLabel: "검증",
    objective: "데이터와 지표, 대상·기간과 판단 기준을 연결합니다.",
  },
  {
    stage: "decision",
    label: "대안 비교·의사결정",
    shortLabel: "의사결정",
    objective: "여러 대안의 기준과 트레이드오프를 비교해 선택합니다.",
  },
  {
    stage: "solution_execution",
    label: "해결안 설계·실행",
    shortLabel: "실행",
    objective: "해결안의 기능·정책·프로세스와 실행 순서, 리스크를 설계합니다.",
  },
  {
    stage: "result_evaluation",
    label: "결과 평가",
    shortLabel: "평가",
    objective: "실제 결과 또는 검증 계획과 부작용, 후속 검증을 평가합니다.",
  },
  {
    stage: "conclusion_reflection",
    label: "결론 전달·회고",
    shortLabel: "회고",
    objective: "결론과 핵심 근거를 전달하고 판단 변화와 다음 행동을 돌아봅니다.",
  },
] as const;

export const CASE_STEP_STATUS_LABELS: Record<CaseStepStatus, string> = {
  not_started: "시작 전",
  writing: "작성 중",
  review_requested: "점검 요청",
  revising: "수정 중",
  completed: "완료",
};

export interface SoftGateNotice {
  currentStageLabel: string;
  targetStageLabel: string;
}

export function getWorkspaceStage(
  stage: ThinkingStage,
): WorkspaceStageDefinition {
  const definition = WORKSPACE_STAGES.find((item) => item.stage === stage);

  if (!definition) {
    throw new Error(`Workspace 단계 정의를 찾을 수 없습니다: ${stage}`);
  }

  return definition;
}

export function getStageStep(
  steps: CaseStep[],
  stage: ThinkingStage,
): CaseStep | undefined {
  return steps.find((step) => step.stage === stage);
}

export function getSoftGateNotice(
  steps: CaseStep[],
  currentStage: ThinkingStage,
  targetStage: ThinkingStage,
): SoftGateNotice | null {
  const currentIndex = THINKING_STAGES.indexOf(currentStage);
  const targetIndex = THINKING_STAGES.indexOf(targetStage);
  const currentStep = getStageStep(steps, currentStage);

  if (targetIndex <= currentIndex || currentStep?.status === "completed") {
    return null;
  }

  return {
    currentStageLabel: getWorkspaceStage(currentStage).label,
    targetStageLabel: getWorkspaceStage(targetStage).label,
  };
}
