import { beforeEach, describe, expect, it } from "vitest";

import {
  THINKING_STAGES,
  writingModeSchema,
  type ContextFieldKey,
} from "../../domain";
import {
  InvalidStoredDataError,
  StorageAccessError,
  UnsupportedStorageVersionError,
  type StorageLike,
} from "../local-storage/local-storage-repository";
import type { CreateCaseInput } from "../thinking-case-repository";
import {
  THINKING_FLOW_STORAGE_KEY,
} from "../local-storage/storage-schema";
import {
  THINKING_FLOW_V2_STORAGE_KEY,
  V2_LOCAL_STORAGE_SCHEMA_VERSION,
  v2LocalStorageDataSchema,
} from "./storage-schema";
import {
  V2LocalStorageRepository,
  type V2LocalStorageRepositoryDependencies,
} from "./v2-local-storage-repository";

class MemoryStorage implements StorageLike {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const createCaseInput: CreateCaseInput = {
  userId: "local-user",
  practiceCaseId: "practice-oliveyoung-o2o-001",
  origin: "practice_library",
  title: "올리브영 O2O 서비스 개선",
  aiMode: "guide",
};

function createDependencies(): {
  dependencies: V2LocalStorageRepositoryDependencies;
  setNow: (value: string) => void;
} {
  let id = 0;
  let now = "2026-08-03T10:00:00.000Z";

  return {
    dependencies: {
      createId: () => "v2-id-" + ++id,
      now: () => now,
    },
    setNow: (value) => {
      now = value;
    },
  };
}

describe("V2LocalStorageRepository", () => {
  let storage: MemoryStorage;
  let repository: V2LocalStorageRepository;
  let setNow: (value: string) => void;

  beforeEach(() => {
    storage = new MemoryStorage();
    const testDependencies = createDependencies();
    setNow = testDependencies.setNow;
    repository = new V2LocalStorageRepository(
      storage,
      testDependencies.dependencies,
    );
  });

  it("WritingMode는 freeform과 structured만 허용하고 both를 거부한다", () => {
    expect(writingModeSchema.parse("freeform")).toBe("freeform");
    expect(writingModeSchema.parse("structured")).toBe("structured");
    expect(writingModeSchema.safeParse("both").success).toBe(false);
  });

  it("V1과 다른 key의 schemaVersion 3 문서를 사용한다", async () => {
    expect(THINKING_FLOW_V2_STORAGE_KEY).not.toBe(
      THINKING_FLOW_STORAGE_KEY,
    );
    expect(V2_LOCAL_STORAGE_SCHEMA_VERSION).toBe(3);

    await repository.createCase(createCaseInput);

    expect(storage.getItem(THINKING_FLOW_STORAGE_KEY)).toBeNull();
    const rawData = storage.getItem(THINKING_FLOW_V2_STORAGE_KEY);
    const data = v2LocalStorageDataSchema.parse(
      JSON.parse(rawData ?? ""),
    );
    expect(data.schemaVersion).toBe(3);
  });

  it("새 Case에 writingMode null인 10개 CaseStep을 만들고 context에서 시작한다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const bundle = await repository.getCase(createdCase.id);

    expect(createdCase.currentStage).toBe("context");
    expect(bundle?.steps).toHaveLength(10);
    expect(bundle?.steps.map((step) => step.stage)).toEqual(
      THINKING_STAGES,
    );
    expect(bundle?.steps.every((step) => step.writingMode === null)).toBe(
      true,
    );
  });

  it("자유 작성과 질문별 응답, WritingMode를 한 초안에 저장하고 복원한다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const fields: Array<{
      fieldKey: ContextFieldKey;
      value: string;
    }> = [
      { fieldKey: "context.freeform", value: "나의 첫 생각" },
      { fieldKey: "context.goal", value: "마찰을 파악한다" },
      {
        fieldKey: "context.current_situation",
        value: "가상 Practice Case를 검토한다",
      },
      { fieldKey: "context.stakeholders", value: "탐색 사용자" },
      {
        fieldKey: "context.constraints_success",
        value: "실제 이탈률은 확인되지 않았다",
      },
    ];

    const result = await repository.saveContextDraft({
      caseId: createdCase.id,
      writingMode: "structured",
      fields: fields.map(({ fieldKey, value }) => ({
        fieldKey,
        contentJson: { type: "text", value },
      })),
    });
    const reloaded = await new V2LocalStorageRepository(storage).getCase(
      createdCase.id,
    );

    expect(result.appendedVersions).toHaveLength(5);
    expect(result.bundle.steps[0]?.writingMode).toBe("structured");
    expect(reloaded?.steps[0]?.writingMode).toBe("structured");
    expect(reloaded?.fieldResponses).toHaveLength(5);
    expect(reloaded?.responseVersions).toHaveLength(5);
    expect(
      reloaded?.responseVersions.every(
        (version) => version.saveReason === "explicit_draft",
      ),
    ).toBe(true);
  });

  it("동일한 내용은 version을 추가하지 않고 변경된 field만 append한다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const first = await repository.saveContextDraft({
      caseId: createdCase.id,
      writingMode: "freeform",
      fields: [
        {
          fieldKey: "context.freeform",
          contentJson: { type: "text", value: "첫 생각" },
        },
      ],
    });

    setNow("2026-08-03T10:05:00.000Z");
    const duplicate = await repository.saveContextDraft({
      caseId: createdCase.id,
      writingMode: "freeform",
      fields: [
        {
          fieldKey: "context.freeform",
          contentJson: { type: "text", value: "첫 생각" },
        },
      ],
    });
    const changed = await repository.saveContextDraft({
      caseId: createdCase.id,
      writingMode: "freeform",
      fields: [
        {
          fieldKey: "context.freeform",
          contentJson: { type: "text", value: "수정한 생각" },
        },
      ],
    });
    const bundle = await repository.getCase(createdCase.id);

    expect(first.appendedVersions[0]).toMatchObject({
      version: 1,
      previousVersionId: null,
    });
    expect(duplicate.appendedVersions).toHaveLength(0);
    expect(changed.appendedVersions[0]).toMatchObject({
      version: 2,
      previousVersionId: first.appendedVersions[0]?.id,
    });
    expect(bundle?.responseVersions).toHaveLength(2);
  });

  it("새 빈 선택 field는 만들지 않지만 기존 응답을 비우는 변경은 보존한다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const emptyInitial = await repository.saveContextDraft({
      caseId: createdCase.id,
      writingMode: "structured",
      fields: [
        {
          fieldKey: "context.stakeholders",
          contentJson: { type: "text", value: "" },
        },
      ],
    });
    expect(emptyInitial.appendedVersions).toHaveLength(0);
    expect(emptyInitial.bundle.fieldResponses).toHaveLength(0);

    await repository.saveContextDraft({
      caseId: createdCase.id,
      writingMode: "structured",
      fields: [
        {
          fieldKey: "context.stakeholders",
          contentJson: { type: "text", value: "사용자" },
        },
      ],
    });
    const cleared = await repository.saveContextDraft({
      caseId: createdCase.id,
      writingMode: "structured",
      fields: [
        {
          fieldKey: "context.stakeholders",
          contentJson: { type: "text", value: "" },
        },
      ],
    });

    expect(cleared.appendedVersions[0]).toMatchObject({
      version: 2,
      contentJson: { type: "text", value: "" },
    });
  });

  it("한 번의 write가 실패하면 mode와 여러 field가 부분 저장되지 않는다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const before = storage.getItem(THINKING_FLOW_V2_STORAGE_KEY);
    const failingRepository = new V2LocalStorageRepository(
      {
        getItem: (key) => storage.getItem(key),
        setItem: () => {
          throw new Error("quota");
        },
      },
      createDependencies().dependencies,
    );

    await expect(
      failingRepository.saveContextDraft({
        caseId: createdCase.id,
        writingMode: "structured",
        fields: [
          {
            fieldKey: "context.goal",
            contentJson: { type: "text", value: "목적" },
          },
          {
            fieldKey: "context.current_situation",
            contentJson: { type: "text", value: "상황" },
          },
        ],
      }),
    ).rejects.toBeInstanceOf(StorageAccessError);

    expect(storage.getItem(THINKING_FLOW_V2_STORAGE_KEY)).toBe(before);
  });

  it("손상·지원하지 않는 V2 데이터는 구분하고 reset은 V1 key를 보존한다", async () => {
    storage.setItem(THINKING_FLOW_STORAGE_KEY, "v1-data");
    storage.setItem(
      THINKING_FLOW_V2_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 2 }),
    );
    await expect(repository.getCase("case")).rejects.toBeInstanceOf(
      UnsupportedStorageVersionError,
    );

    storage.setItem(
      THINKING_FLOW_V2_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 3, thinkingCases: [] }),
    );
    await expect(repository.getCase("case")).rejects.toBeInstanceOf(
      InvalidStoredDataError,
    );

    await repository.resetLocalData();

    expect(storage.getItem(THINKING_FLOW_STORAGE_KEY)).toBe("v1-data");
    const resetData = v2LocalStorageDataSchema.parse(
      JSON.parse(storage.getItem(THINKING_FLOW_V2_STORAGE_KEY) ?? ""),
    );
    expect(resetData).toEqual({
      schemaVersion: 3,
      thinkingCases: [],
      caseSteps: [],
      fieldResponses: [],
      responseVersions: [],
    });
  });
});
