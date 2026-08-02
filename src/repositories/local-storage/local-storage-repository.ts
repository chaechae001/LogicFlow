import { z } from "zod";

import {
  THINKING_STAGES,
  type CaseStep,
  type FieldResponse,
  type ResponseVersion,
  type ThinkingCase,
} from "../../domain";
import {
  createCaseInputSchema,
  saveResponseVersionInputSchema,
  type CreateCaseInput,
  type SaveResponseVersionInput,
  type ThinkingCaseBundle,
  type ThinkingCaseRepository,
  type ThinkingCaseSummary,
} from "../thinking-case-repository";
import {
  LOCAL_STORAGE_SCHEMA_VERSION,
  THINKING_FLOW_STORAGE_KEY,
  createEmptyLocalStorageData,
  localStorageDataSchema,
  type LocalStorageData,
} from "./storage-schema";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface LocalStorageRepositoryDependencies {
  createId: () => string;
  now: () => string;
}

export class LocalStorageRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalStorageRepositoryError";
  }
}

export class UnsupportedStorageVersionError extends LocalStorageRepositoryError {
  constructor(version: number) {
    super(`지원하지 않는 localStorage schemaVersion입니다: ${version}`);
    this.name = "UnsupportedStorageVersionError";
  }
}

export class ThinkingCaseNotFoundError extends LocalStorageRepositoryError {
  constructor(caseId: string) {
    super(`Thinking Case를 찾을 수 없습니다: ${caseId}`);
    this.name = "ThinkingCaseNotFoundError";
  }
}

const storageEnvelopeSchema = z
  .object({
    schemaVersion: z.number().int().nonnegative(),
  })
  .passthrough();

const caseIdSchema = z.string().trim().min(1);

const defaultDependencies: LocalStorageRepositoryDependencies = {
  createId: () => globalThis.crypto.randomUUID(),
  now: () => new Date().toISOString(),
};

function getBrowserLocalStorage(): StorageLike {
  if (typeof globalThis.localStorage === "undefined") {
    throw new LocalStorageRepositoryError(
      "브라우저 localStorage를 사용할 수 없는 환경입니다.",
    );
  }

  return globalThis.localStorage;
}

export class LocalStorageRepository implements ThinkingCaseRepository {
  private readonly dependencies: LocalStorageRepositoryDependencies;

  constructor(
    private readonly storage: StorageLike = getBrowserLocalStorage(),
    dependencies: Partial<LocalStorageRepositoryDependencies> = {},
  ) {
    this.dependencies = { ...defaultDependencies, ...dependencies };
  }

  async createCase(input: CreateCaseInput): Promise<ThinkingCase> {
    const parsedInput = createCaseInputSchema.parse(input);
    const now = this.dependencies.now();
    const caseId = this.dependencies.createId();
    const data = this.readData();

    const thinkingCase: ThinkingCase = {
      id: caseId,
      userId: parsedInput.userId,
      practiceCaseId: parsedInput.practiceCaseId,
      origin: parsedInput.origin,
      title: parsedInput.title,
      status: "in_progress",
      currentStage: THINKING_STAGES[0],
      aiMode: parsedInput.aiMode,
      initialImpression: parsedInput.initialImpression,
      initialSolutionIdea: parsedInput.initialSolutionIdea,
      decisionQuestion: parsedInput.decisionQuestion,
      finalTopMessage: "",
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };

    const caseSteps: CaseStep[] = THINKING_STAGES.map((stage, index) => ({
      id: this.dependencies.createId(),
      caseId,
      stage,
      status: index === 0 ? "writing" : "not_started",
      startedAt: index === 0 ? now : null,
      completedAt: null,
    }));

    data.thinkingCases.push(thinkingCase);
    data.caseSteps.push(...caseSteps);
    this.writeData(data);

    return thinkingCase;
  }

  async getCase(caseId: string): Promise<ThinkingCaseBundle | null> {
    const parsedCaseId = caseIdSchema.parse(caseId);
    const data = this.readData();
    const thinkingCase = data.thinkingCases.find(
      (candidate) => candidate.id === parsedCaseId,
    );

    if (!thinkingCase) {
      return null;
    }

    const stageOrder = new Map(
      THINKING_STAGES.map((stage, index) => [stage, index]),
    );
    const steps = data.caseSteps
      .filter((step) => step.caseId === parsedCaseId)
      .sort(
        (left, right) =>
          (stageOrder.get(left.stage) ?? 0) -
          (stageOrder.get(right.stage) ?? 0),
      );
    const fieldResponses = data.fieldResponses.filter(
      (response) => response.caseId === parsedCaseId,
    );
    const fieldResponseIds = new Set(
      fieldResponses.map((response) => response.id),
    );
    const responseVersions = data.responseVersions
      .filter((version) => fieldResponseIds.has(version.fieldResponseId))
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

    return {
      thinkingCase,
      steps,
      fieldResponses,
      responseVersions,
    };
  }

  async listCases(): Promise<ThinkingCaseSummary[]> {
    const data = this.readData();

    return [...data.thinkingCases]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map((thinkingCase) => ({
        id: thinkingCase.id,
        practiceCaseId: thinkingCase.practiceCaseId,
        origin: thinkingCase.origin,
        title: thinkingCase.title,
        status: thinkingCase.status,
        currentStage: thinkingCase.currentStage,
        updatedAt: thinkingCase.updatedAt,
      }));
  }

  async saveResponseVersion(
    input: SaveResponseVersionInput,
  ): Promise<ResponseVersion> {
    const parsedInput = saveResponseVersionInputSchema.parse(input);
    const data = this.readData();
    const caseIndex = data.thinkingCases.findIndex(
      (thinkingCase) => thinkingCase.id === parsedInput.caseId,
    );

    if (caseIndex < 0) {
      throw new ThinkingCaseNotFoundError(parsedInput.caseId);
    }

    const existingFieldResponse = data.fieldResponses.find(
      (fieldResponse) =>
        fieldResponse.caseId === parsedInput.caseId &&
        fieldResponse.stage === parsedInput.stage &&
        fieldResponse.fieldKey === parsedInput.fieldKey,
    );
    const previousVersion = existingFieldResponse
      ? this.findCurrentVersion(data, existingFieldResponse)
      : null;
    const fieldResponseId =
      existingFieldResponse?.id ?? this.dependencies.createId();
    const now = this.dependencies.now();
    const responseVersion: ResponseVersion = {
      id: this.dependencies.createId(),
      fieldResponseId,
      version: previousVersion ? previousVersion.version + 1 : 1,
      contentJson: parsedInput.contentJson,
      authorType: parsedInput.authorType,
      previousVersionId: previousVersion?.id ?? null,
      createdAt: now,
    };

    data.responseVersions.push(responseVersion);

    if (existingFieldResponse) {
      existingFieldResponse.currentVersionId = responseVersion.id;
    } else {
      const fieldResponse: FieldResponse = {
        id: fieldResponseId,
        caseId: parsedInput.caseId,
        stage: parsedInput.stage,
        fieldKey: parsedInput.fieldKey,
        currentVersionId: responseVersion.id,
      };
      data.fieldResponses.push(fieldResponse);
    }

    const thinkingCase = data.thinkingCases[caseIndex];
    data.thinkingCases[caseIndex] = {
      ...thinkingCase,
      updatedAt: now,
    };
    this.writeData(data);

    return responseVersion;
  }

  private findCurrentVersion(
    data: LocalStorageData,
    fieldResponse: FieldResponse,
  ): ResponseVersion {
    const version = data.responseVersions.find(
      (candidate) => candidate.id === fieldResponse.currentVersionId,
    );

    if (!version) {
      throw new LocalStorageRepositoryError(
        `현재 응답 버전을 찾을 수 없습니다: ${fieldResponse.currentVersionId}`,
      );
    }

    return version;
  }

  private readData(): LocalStorageData {
    const rawData = this.storage.getItem(THINKING_FLOW_STORAGE_KEY);

    if (rawData === null) {
      return createEmptyLocalStorageData();
    }

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(rawData);
    } catch {
      throw new LocalStorageRepositoryError(
        "localStorage의 Thinking Flow 데이터를 JSON으로 읽을 수 없습니다.",
      );
    }

    const envelopeResult = storageEnvelopeSchema.safeParse(parsedData);
    if (!envelopeResult.success) {
      throw new LocalStorageRepositoryError(
        "localStorage 데이터에 유효한 schemaVersion이 없습니다.",
      );
    }

    if (envelopeResult.data.schemaVersion !== LOCAL_STORAGE_SCHEMA_VERSION) {
      throw new UnsupportedStorageVersionError(
        envelopeResult.data.schemaVersion,
      );
    }

    const dataResult = localStorageDataSchema.safeParse(parsedData);
    if (!dataResult.success) {
      throw new LocalStorageRepositoryError(
        "localStorage의 Thinking Flow 데이터 형태가 유효하지 않습니다.",
      );
    }

    return dataResult.data;
  }

  private writeData(data: LocalStorageData): void {
    const validatedData = localStorageDataSchema.parse(data);
    this.storage.setItem(
      THINKING_FLOW_STORAGE_KEY,
      JSON.stringify(validatedData),
    );
  }
}
