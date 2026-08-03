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

describe("startPracticeCase", () => {
  it("사전 작성값 없이 CreateCaseInput 계약으로 변환한다", () => {
    expect(buildCreateCaseInput(oliveyoungPracticeCase)).toEqual({
      userId: LOCAL_USER_ID,
      practiceCaseId: oliveyoungPracticeCase.id,
      origin: "practice_library",
      title: oliveyoungPracticeCase.title,
      aiMode: "guide",
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
    );
    const storedCase = await repository.getCase(result.thinkingCase.id);

    expect(result.destination).toBe(
      `/cases/${result.thinkingCase.id}/workspace/context`,
    );
    expect(storedCase?.thinkingCase).toMatchObject({
      practiceCaseId: oliveyoungPracticeCase.id,
      currentStage: "context",
    });
    expect(storedCase?.steps).toHaveLength(10);
  });
});
