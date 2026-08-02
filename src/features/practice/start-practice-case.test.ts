import { describe, expect, it } from "vitest";

import { oliveyoungPracticeCase } from "../../domain";
import {
  LocalStorageRepository,
  type LocalStorageRepositoryDependencies,
  type StorageLike,
} from "../../repositories";
import {
  LOCAL_USER_ID,
  buildCreateCaseInput,
  startPracticeCase,
} from "./start-practice-case";

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const values = {
  initialImpression: "  상품을 다시 찾는 과정부터 확인해야 한다.  ",
  initialSolutionIdea: "  체험 상품을 직접 저장하는 방법이 떠올랐다.  ",
  decisionQuestion: "  어떤 연결 지점을 먼저 검증해야 하는가?  ",
};

describe("startPracticeCase", () => {
  it("최초 입력을 기존 CreateCaseInput 계약으로 변환한다", () => {
    expect(buildCreateCaseInput(oliveyoungPracticeCase, values)).toEqual({
      userId: LOCAL_USER_ID,
      practiceCaseId: oliveyoungPracticeCase.id,
      origin: "practice_library",
      title: oliveyoungPracticeCase.title,
      aiMode: "guide",
      initialImpression: "상품을 다시 찾는 과정부터 확인해야 한다.",
      initialSolutionIdea: "체험 상품을 직접 저장하는 방법이 떠올랐다.",
      decisionQuestion: "어떤 연결 지점을 먼저 검증해야 하는가?",
    });
  });

  it("LocalStorageRepository로 Case를 생성하고 다음 경로를 반환한다", async () => {
    let id = 0;
    const dependencies: LocalStorageRepositoryDependencies = {
      createId: () => `case-start-${++id}`,
      now: () => "2026-08-02T12:00:00.000Z",
    };
    const repository = new LocalStorageRepository(
      new MemoryStorage(),
      dependencies,
    );

    const result = await startPracticeCase(
      repository,
      oliveyoungPracticeCase,
      values,
    );
    const storedCase = await repository.getCase(result.thinkingCase.id);

    expect(result.destination).toBe(
      `/cases/${result.thinkingCase.id}/workspace/fact_interpretation`,
    );
    expect(storedCase?.thinkingCase).toMatchObject({
      practiceCaseId: oliveyoungPracticeCase.id,
      initialImpression: "상품을 다시 찾는 과정부터 확인해야 한다.",
      initialSolutionIdea: "체험 상품을 직접 저장하는 방법이 떠올랐다.",
      decisionQuestion: "어떤 연결 지점을 먼저 검증해야 하는가?",
    });
  });
});
