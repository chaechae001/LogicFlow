import { describe, expect, it } from "vitest";

import { practiceCaseSchema } from "../schemas";
import { THINKING_STAGES, thinkingStageSchema } from "../thinking-stage";
import { oliveyoungPracticeCase } from "./oliveyoung-practice-case";

describe("ThinkingStage", () => {
  it("문서에 정의된 8단계 순서를 유지한다", () => {
    expect(THINKING_STAGES).toEqual([
      "fact_interpretation",
      "problem_definition",
      "customer_journey",
      "hypotheses",
      "validation",
      "alternatives",
      "action_plan",
      "conclusion_reflection",
    ]);
    expect(THINKING_STAGES.every((stage) => thinkingStageSchema.safeParse(stage).success)).toBe(
      true,
    );
  });
});

describe("oliveyoungPracticeCase", () => {
  it("PracticeCase 스키마를 통과한다", () => {
    const result = practiceCaseSchema.safeParse(oliveyoungPracticeCase);

    expect(result.success).toBe(true);
  });

  it("검증되지 않은 내부 사실이 아님을 명시한다", () => {
    expect(oliveyoungPracticeCase.sourceNote).toContain("가상 현업형 Practice Case");
    expect(oliveyoungPracticeCase.sourceNote).toContain("내부 데이터");
    expect(oliveyoungPracticeCase.unknowns.length).toBeGreaterThan(0);
  });

  it("유효하지 않은 예상 시간과 빈 근거 목록을 거부한다", () => {
    const invalidFixture = {
      ...oliveyoungPracticeCase,
      expectedMinutes: 0,
      knownFacts: [],
    };

    expect(practiceCaseSchema.safeParse(invalidFixture).success).toBe(false);
  });
});
