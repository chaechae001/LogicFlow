import { describe, expect, it } from "vitest";

import { practiceCaseSchema } from "../schemas";
import {
  THINKING_STAGES,
  thinkingStageSchema,
  writingModeSchema,
} from "../thinking-stage";
import { oliveyoungPracticeCase } from "./oliveyoung-practice-case";

describe("ThinkingStage", () => {
  it("확정된 10단계 순서를 유지한다", () => {
    expect(THINKING_STAGES).toEqual([
      "context",
      "observation",
      "problem_definition",
      "problem_structuring",
      "hypothesis",
      "evidence_validation",
      "decision",
      "solution_execution",
      "result_evaluation",
      "conclusion_reflection",
    ]);
    expect(THINKING_STAGES.every((stage) => thinkingStageSchema.safeParse(stage).success)).toBe(
      true,
    );
  });
});

describe("WritingMode", () => {
  it("자유 작성과 구조화 입력만 허용하고 both 모드는 만들지 않는다", () => {
    expect(writingModeSchema.parse("freeform")).toBe("freeform");
    expect(writingModeSchema.parse("structured")).toBe("structured");
    expect(writingModeSchema.safeParse("both").success).toBe(false);
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
