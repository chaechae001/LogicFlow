import { beforeEach, describe, expect, it } from "vitest";

import type { CreateCaseInput } from "../thinking-case-repository";
import {
  InvalidStoredDataError,
  LocalStorageRepository,
  StorageAccessError,
  ThinkingCaseNotFoundError,
  UnsupportedStorageVersionError,
  type LocalStorageRepositoryDependencies,
  type StorageLike,
} from "./local-storage-repository";
import {
  LOCAL_STORAGE_SCHEMA_VERSION,
  THINKING_FLOW_STORAGE_KEY,
  localStorageDataSchema,
} from "./storage-schema";

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

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

function createTestDependencies(): {
  dependencies: LocalStorageRepositoryDependencies;
  setNow: (value: string) => void;
} {
  let id = 0;
  let now = "2026-08-02T10:00:00.000Z";

  return {
    dependencies: {
      createId: () => `id-${++id}`,
      now: () => now,
    },
    setNow: (value) => {
      now = value;
    },
  };
}

describe("LocalStorageRepository", () => {
  let storage: MemoryStorage;
  let repository: LocalStorageRepository;
  let setNow: (value: string) => void;

  beforeEach(() => {
    storage = new MemoryStorage();
    const testDependencies = createTestDependencies();
    setNow = testDependencies.setNow;
    repository = new LocalStorageRepository(
      storage,
      testDependencies.dependencies,
    );
  });

  it("Thinking Case와 10개 초기 단계를 생성하고 다시 조회한다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const bundle = await repository.getCase(createdCase.id);
    const summaries = await repository.listCases();

    expect(createdCase).toMatchObject({
      status: "in_progress",
      currentStage: "context",
      completedAt: null,
    });
    expect(bundle?.thinkingCase).toEqual(createdCase);
    expect(bundle?.steps).toHaveLength(10);
    expect(bundle?.steps[0]).toMatchObject({
      stage: "context",
      status: "writing",
    });
    expect(bundle?.steps.slice(1).every((step) => step.status === "not_started")).toBe(
      true,
    );
    expect(summaries).toEqual([
      expect.objectContaining({ id: createdCase.id, title: createdCase.title }),
    ]);
  });

  it("schemaVersion 2를 포함한 단일 JSON 문서로 저장하고 새 인스턴스에서 읽는다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const rawData = storage.getItem(THINKING_FLOW_STORAGE_KEY);

    expect(rawData).not.toBeNull();
    const storedData = localStorageDataSchema.parse(JSON.parse(rawData ?? ""));
    expect(storedData.schemaVersion).toBe(LOCAL_STORAGE_SCHEMA_VERSION);

    const reloadedRepository = new LocalStorageRepository(storage);
    await expect(reloadedRepository.getCase(createdCase.id)).resolves.toMatchObject({
      thinkingCase: createdCase,
    });
  });

  it("응답 수정 시 기존 버전을 보존하고 새 버전을 연결한다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const firstVersion = await repository.saveResponseVersion({
      caseId: createdCase.id,
      stage: "observation",
      fieldKey: "known_facts",
      contentJson: ["첫 번째 생각"],
      authorType: "user",
    });

    setNow("2026-08-02T10:05:00.000Z");
    const secondVersion = await repository.saveResponseVersion({
      caseId: createdCase.id,
      stage: "observation",
      fieldKey: "known_facts",
      contentJson: ["수정한 생각"],
      authorType: "user",
    });
    const bundle = await repository.getCase(createdCase.id);

    expect(firstVersion).toMatchObject({
      version: 1,
      previousVersionId: null,
      contentJson: ["첫 번째 생각"],
    });
    expect(secondVersion).toMatchObject({
      version: 2,
      previousVersionId: firstVersion.id,
      contentJson: ["수정한 생각"],
    });
    expect(bundle?.responseVersions).toEqual([firstVersion, secondVersion]);
    expect(bundle?.fieldResponses).toEqual([
      expect.objectContaining({ currentVersionId: secondVersion.id }),
    ]);
    expect(bundle?.responseVersions[0]?.contentJson).toEqual(["첫 번째 생각"]);
    expect(bundle?.thinkingCase.updatedAt).toBe("2026-08-02T10:05:00.000Z");
  });

  it("서로 다른 필드는 각각 version 1부터 시작한다", async () => {
    const createdCase = await repository.createCase(createCaseInput);
    const firstFieldVersion = await repository.saveResponseVersion({
      caseId: createdCase.id,
      stage: "observation",
      fieldKey: "known_facts",
      contentJson: ["확인한 내용"],
      authorType: "user",
    });
    const secondFieldVersion = await repository.saveResponseVersion({
      caseId: createdCase.id,
      stage: "observation",
      fieldKey: "interpretation",
      contentJson: "나의 해석",
      authorType: "user",
    });

    expect(firstFieldVersion.version).toBe(1);
    expect(secondFieldVersion.version).toBe(1);
    expect(firstFieldVersion.fieldResponseId).not.toBe(
      secondFieldVersion.fieldResponseId,
    );
  });

  it("존재하지 않는 Case에는 응답 버전을 저장하지 않는다", async () => {
    await expect(
      repository.saveResponseVersion({
        caseId: "missing-case",
        stage: "problem_definition",
        fieldKey: "problem_statement",
        contentJson: "문제 정의",
        authorType: "user",
      }),
    ).rejects.toBeInstanceOf(ThinkingCaseNotFoundError);

    expect(storage.getItem(THINKING_FLOW_STORAGE_KEY)).toBeNull();
  });

  it("기존 schemaVersion 1을 migration 없이 명시적으로 거부한다", async () => {
    storage.setItem(
      THINKING_FLOW_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1 }),
    );

    await expect(repository.listCases()).rejects.toBeInstanceOf(
      UnsupportedStorageVersionError,
    );
  });

  it.each([
    {
      name: "필수 배열이 누락된 schemaVersion 2 데이터",
      value: {
        schemaVersion: 2,
        thinkingCases: [],
      },
    },
    {
      name: "과거 8단계 stage key가 포함된 schemaVersion 2 데이터",
      value: {
        schemaVersion: 2,
        thinkingCases: [],
        caseSteps: [
          {
            id: "legacy-step",
            caseId: "legacy-case",
            stage: "fact_interpretation",
            status: "writing",
            startedAt: "2026-08-02T10:00:00.000Z",
            completedAt: null,
          },
        ],
        fieldResponses: [],
        responseVersions: [],
      },
    },
    {
      name: "삭제된 ThinkingCase 필드가 남은 schemaVersion 2 데이터",
      value: {
        schemaVersion: 2,
        thinkingCases: [
          {
            id: "legacy-case",
            userId: "local-user",
            practiceCaseId: "practice-oliveyoung-o2o-001",
            origin: "practice_library",
            title: "과거 Case",
            status: "in_progress",
            currentStage: "context",
            aiMode: "guide",
            initialImpression: "과거 첫 생각",
            initialSolutionIdea: "과거 해결안",
            decisionQuestion: "과거 의사결정 질문",
            finalTopMessage: "",
            createdAt: "2026-08-02T10:00:00.000Z",
            updatedAt: "2026-08-02T10:00:00.000Z",
            completedAt: null,
          },
        ],
        caseSteps: [],
        fieldResponses: [],
        responseVersions: [],
      },
    },
  ])("$name를 InvalidStoredDataError로 거부한다", async ({ value }) => {
    storage.setItem(THINKING_FLOW_STORAGE_KEY, JSON.stringify(value));

    await expect(repository.listCases()).rejects.toBeInstanceOf(
      InvalidStoredDataError,
    );
  });

  it("명시적인 reset 호출에서만 기존 데이터를 빈 schemaVersion 2 문서로 초기화한다", async () => {
    storage.setItem(
      THINKING_FLOW_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, legacyData: true }),
    );

    await repository.resetLocalData();

    const rawData = storage.getItem(THINKING_FLOW_STORAGE_KEY);
    expect(localStorageDataSchema.parse(JSON.parse(rawData ?? ""))).toEqual({
      schemaVersion: 2,
      thinkingCases: [],
      caseSteps: [],
      fieldResponses: [],
      responseVersions: [],
    });
  });

  it("손상된 데이터는 먼저 parse하지 않고 reset한 뒤 새 Case를 생성할 수 있다", async () => {
    storage.setItem(
      THINKING_FLOW_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 2, thinkingCases: [] }),
    );

    await repository.resetLocalData();

    const rawData = storage.getItem(THINKING_FLOW_STORAGE_KEY);
    expect(localStorageDataSchema.parse(JSON.parse(rawData ?? ""))).toEqual({
      schemaVersion: 2,
      thinkingCases: [],
      caseSteps: [],
      fieldResponses: [],
      responseVersions: [],
    });

    const createdCase = await repository.createCase(createCaseInput);
    const bundle = await repository.getCase(createdCase.id);
    expect(createdCase.currentStage).toBe("context");
    expect(bundle?.steps).toHaveLength(10);
  });

  it("브라우저 저장소 읽기와 쓰기 실패를 StorageAccessError로 구분한다", async () => {
    const readFailureRepository = new LocalStorageRepository({
      getItem: () => {
        throw new Error("read denied");
      },
      setItem: () => undefined,
    });
    const writeFailureRepository = new LocalStorageRepository(
      {
        getItem: () => null,
        setItem: () => {
          throw new Error("write denied");
        },
      },
      createTestDependencies().dependencies,
    );

    await expect(readFailureRepository.listCases()).rejects.toBeInstanceOf(
      StorageAccessError,
    );
    await expect(
      writeFailureRepository.createCase(createCaseInput),
    ).rejects.toBeInstanceOf(StorageAccessError);
  });
});
