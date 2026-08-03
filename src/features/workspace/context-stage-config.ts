import type { ContextFieldKey } from "../../domain";

export interface ContextStructuredQuestion {
  fieldKey: ContextFieldKey;
  helpText: string;
  label: string;
  requiredCandidate: boolean;
}

export const CONTEXT_STAGE_CONTENT = {
  title: "목적·맥락 이해",
  easyDescription:
    "이번 Case에서 무엇을 이해하고 결정하려는지, 누구의 문제를 어디까지 다룰지 경계선을 정하는 단계입니다.",
  whyItMatters:
    "목적과 범위가 불명확하면 같은 자료를 보더라도 서로 다른 문제를 해결하게 될 수 있습니다.",
  freeformGuide:
    "이번 Case의 목적, 현재 상황, 주요 이해관계자, 범위와 제약에 대해 지금 떠오르는 생각을 먼저 작성해보세요.",
  freeformSupport:
    "완성된 문장일 필요는 없습니다. 해결안보다 이번 사고 과정이 무엇을 밝혀야 하는지에 집중합니다.",
  goodExample:
    "이번 Case의 목적은 오프라인에서 본 상품을 앱에서 다시 찾는 과정에서 어떤 마찰이 발생하는지 파악하고, 먼저 검증할 영역을 정하는 것이다. 현재는 실제 이탈률이나 전체 사용자 행동을 확인하지 못했으므로, 특정 기능을 바로 해결안으로 확정하지 않는다.",
  badExample: "QR 기능을 추가해 매출을 높인다.",
  badExampleProblems: [
    "해결 수단이 목적보다 먼저 정해짐",
    "실제 매출 영향이 확인되지 않음",
    "사용자와 범위가 없음",
  ],
  commonMistakes: [
    "해결안을 목적처럼 작성",
    "추측을 확정 사실처럼 작성",
    "대상 사용자 누락",
    "포함·제외 범위 누락",
    "성공 기준 없이 막연하게 개선한다고 표현",
  ],
} as const;

export const CONTEXT_STRUCTURED_QUESTIONS: readonly ContextStructuredQuestion[] =
  [
    {
      fieldKey: "context.goal",
      label: "이 Case에서 달성하려는 목적은 무엇인가?",
      requiredCandidate: true,
      helpText:
        "최종 해결안을 미리 정하지 말고, 이번 사고 과정이 무엇을 밝혀야 하는지 작성합니다.",
    },
    {
      fieldKey: "context.current_situation",
      label: "현재 상황과 이 문제를 지금 다루는 이유는 무엇인가?",
      requiredCandidate: true,
      helpText:
        "배경, 최근 변화, 긴급성, 현재 알고 있는 범위를 구분해 작성합니다.",
    },
    {
      fieldKey: "context.stakeholders",
      label: "주요 이해관계자는 누구인가?",
      requiredCandidate: false,
      helpText:
        "문제의 영향을 받거나 판단·실행에 참여하는 사람과 조직을 작성합니다.",
    },
    {
      fieldKey: "context.constraints_success",
      label: "확인해야 할 제약, 범위, 성공 기준은 무엇인가?",
      requiredCandidate: false,
      helpText:
        "시간, 비용, 데이터, 정책, 기술 제약과 성공 여부를 판단할 기준을 구분해 작성합니다.",
    },
  ] as const;
