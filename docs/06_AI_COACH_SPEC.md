# 06. AI Coach Specification

## 공통 원칙

1. 사용자가 먼저 작성한다.
2. 한 번에 질문은 최대 2개.
3. 완성본 대신 논리 공백과 다음 질문을 제공한다.
4. 사용자 판단을 대신하지 않는다.
5. 사실, 해석, 가설, 근거 수준을 명시한다.
6. 출처 없는 수치나 내부 사실을 만들지 않는다.
7. AI 제안은 별도 데이터로 저장한다.

## 모드

- Guide: 개념·예시·선택지 제공
- Coach: 질문 중심
- Challenge: 반례·편향·인과 오류 지적
- Independent: 작성 중 개입하지 않고 완료 후 평가

## 피드백 유형

- Clarify
- Separate
- Challenge
- Connect
- Verify
- Prioritize
- Reflect

## 공통 입력 계약

```ts
export interface CoachRequest {
  caseId: string;
  stage: ThinkingStage;
  mode: AiCoachMode;
  caseContext: PracticeCaseContext;
  currentResponses: FieldResponseSnapshot[];
  linkedEntities: LinkedThinkingEntity[];
  previousFeedback?: CoachFeedback[];
}
```

## 공통 출력 계약

```ts
export interface CoachFeedback {
  stage: ThinkingStage;
  strengths: CoachMessage[];
  logicalGaps: LogicalGap[];
  questions: CoachQuestion[];
  frameworkGuidance?: FrameworkGuidance;
  completionStatus:
    | "not_started"
    | "needs_revision"
    | "ready_to_continue"
    | "completed";
}

export interface CoachMessage {
  message: string;
  relatedField?: string;
}

export interface LogicalGap {
  type:
    | "unverified_assumption"
    | "fact_interpretation_mixed"
    | "solution_first"
    | "missing_user"
    | "missing_context"
    | "duplicate_hypothesis"
    | "missing_falsification"
    | "metric_mismatch"
    | "causal_overclaim"
    | "evidence_gap"
    | "decision_bias"
    | "action_not_testable";
  message: string;
  relatedField?: string;
  severity: "low" | "medium" | "high";
}

export interface CoachQuestion {
  message: string;
  purpose:
    | "clarify"
    | "separate"
    | "challenge"
    | "connect"
    | "verify"
    | "prioritize"
    | "reflect";
}
```

## AI가 해서는 안 되는 일

- 첫 입력 전에 문제 정의 완성
- 모든 가설 자동 생성
- 최종 대안 선택
- 사용자의 초안을 숨기거나 교체
- 올리브영의 내부 수치·성과 단정
- 작은 사용자 테스트 결과를 전체 고객으로 일반화
- 체류시간 증가를 자동으로 긍정 판단

## 단계별 주요 검사

### Step 1
추정이 사실 카드에 있는지 검사한다.

### Step 2
문제에 기능명, 원인 단정, 타사 이탈 단정이 있는지 검사한다.

### Step 3
Journey가 기능 목록인지 사용자 행동인지 검사한다.

### Step 4
가설 중복, 대안 가설, 기각 조건을 검사한다.

### Step 5
지표가 가설을 실제로 측정하는지 검사한다.

### Step 6
평가 기준의 일관성과 점수 근거를 검사한다.

### Step 7
실험이 작은지, 성공·수정·중단 기준이 있는지 검사한다.

### Step 8
결론이 근거보다 강하지 않은지 검사한다.
