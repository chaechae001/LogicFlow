import { z } from "zod";

import {
  THINKING_STAGES,
  type TextResponseContent,
  type V2CaseStep,
  type V2FieldResponse,
  type V2ResponseVersion,
  type V2ThinkingCase,
} from "../../domain";
import {
  InvalidStoredDataError,
  StorageAccessError,
  ThinkingCaseNotFoundError,
  UnsupportedStorageVersionError,
  type StorageLike,
} from "../local-storage/local-storage-repository";
import {
  saveContextDraftInputSchema,
  type SaveContextDraftInput,
  type SaveContextDraftResult,
  type V2ThinkingCaseBundle,
  type V2ThinkingCaseRepository,
} from "../v2-thinking-case-repository";
import {
  createCaseInputSchema,
  type CreateCaseInput,
} from "../thinking-case-repository";
import {
  THINKING_FLOW_V2_STORAGE_KEY,
  V2_LOCAL_STORAGE_SCHEMA_VERSION,
  createEmptyV2LocalStorageData,
  v2LocalStorageDataSchema,
  type V2LocalStorageData,
} from "./storage-schema";

export interface V2LocalStorageRepositoryDependencies {
  createId: () => string;
  now: () => string;
}

const storageEnvelopeSchema = z
  .object({
    schemaVersion: z.number().int().nonnegative(),
  })
  .passthrough();

const caseIdSchema = z.string().trim().min(1);

const defaultDependencies: V2LocalStorageRepositoryDependencies = {
  createId: () => globalThis.crypto.randomUUID(),
  now: () => new Date().toISOString(),
};

function getBrowserLocalStorage(): StorageLike {
  try {
    if (typeof globalThis.localStorage === "undefined") {
      throw new StorageAccessError(
        "브라우저 localStorage를 사용할 수 없는 환경입니다.",
      );
    }

    return globalThis.localStorage;
  } catch (error) {
    if (error instanceof StorageAccessError) {
      throw error;
    }

    throw new StorageAccessError(
      "브라우저 localStorage에 접근할 수 없습니다.",
      error,
    );
  }
}

export class V2LocalStorageRepository implements V2ThinkingCaseRepository {
  private readonly dependencies: V2LocalStorageRepositoryDependencies;

  constructor(
    private readonly storage: StorageLike = getBrowserLocalStorage(),
    dependencies: Partial<V2LocalStorageRepositoryDependencies> = {},
  ) {
    this.dependencies = { ...defaultDependencies, ...dependencies };
  }

  async createCase(input: CreateCaseInput): Promise<V2ThinkingCase> {
    const parsedInput = createCaseInputSchema.parse(input);
    const data = this.readData();
    const now = this.dependencies.now();
    const caseId = this.dependencies.createId();
    const thinkingCase: V2ThinkingCase = {
      id: caseId,
      userId: parsedInput.userId,
      practiceCaseId: parsedInput.practiceCaseId,
      origin: parsedInput.origin,
      title: parsedInput.title,
      status: "in_progress",
      currentStage: THINKING_STAGES[0],
      aiMode: parsedInput.aiMode,
      finalTopMessage: "",
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };
    const caseSteps: V2CaseStep[] = THINKING_STAGES.map((stage, index) => ({
      id: this.dependencies.createId(),
      caseId,
      stage,
      status: index === 0 ? "writing" : "not_started",
      writingMode: null,
      startedAt: index === 0 ? now : null,
      completedAt: null,
    }));

    data.thinkingCases.push(thinkingCase);
    data.caseSteps.push(...caseSteps);
    this.writeData(data);

    return thinkingCase;
  }

  async getCase(caseId: string): Promise<V2ThinkingCaseBundle | null> {
    const parsedCaseId = caseIdSchema.parse(caseId);
    return this.getCaseFromData(this.readData(), parsedCaseId);
  }

  async resetLocalData(): Promise<void> {
    this.writeData(createEmptyV2LocalStorageData());
  }

  async saveContextDraft(
    input: SaveContextDraftInput,
  ): Promise<SaveContextDraftResult> {
    const parsedInput = saveContextDraftInputSchema.parse(input);
    const data = this.readData();
    const caseIndex = data.thinkingCases.findIndex(
      (thinkingCase) => thinkingCase.id === parsedInput.caseId,
    );

    if (caseIndex < 0) {
      throw new ThinkingCaseNotFoundError(parsedInput.caseId);
    }

    const contextStep = data.caseSteps.find(
      (step) =>
        step.caseId === parsedInput.caseId && step.stage === "context",
    );
    if (!contextStep) {
      throw new InvalidStoredDataError(
        "V2 Thinking Case에 context CaseStep이 없습니다.",
      );
    }

    const now = this.dependencies.now();
    const appendedVersions: V2ResponseVersion[] = [];
    const modeChanged = contextStep.writingMode !== parsedInput.writingMode;
    contextStep.writingMode = parsedInput.writingMode;

    for (const field of parsedInput.fields) {
      const existingResponse = data.fieldResponses.find(
        (candidate) =>
          candidate.caseId === parsedInput.caseId &&
          candidate.stage === "context" &&
          candidate.fieldKey === field.fieldKey,
      );
      const previousVersion = existingResponse
        ? this.findCurrentVersion(data, existingResponse)
        : null;

      if (
        previousVersion &&
        isSameContent(previousVersion.contentJson, field.contentJson)
      ) {
        continue;
      }
      if (!previousVersion && field.contentJson.value.length === 0) {
        continue;
      }

      const fieldResponseId =
        existingResponse?.id ?? this.dependencies.createId();
      const version: V2ResponseVersion = {
        id: this.dependencies.createId(),
        fieldResponseId,
        version: previousVersion ? previousVersion.version + 1 : 1,
        contentJson: field.contentJson,
        authorType: "user",
        saveReason: "explicit_draft",
        previousVersionId: previousVersion?.id ?? null,
        createdAt: now,
      };
      data.responseVersions.push(version);
      appendedVersions.push(version);

      if (existingResponse) {
        existingResponse.currentVersionId = version.id;
      } else {
        data.fieldResponses.push({
          id: fieldResponseId,
          caseId: parsedInput.caseId,
          stage: "context",
          fieldKey: field.fieldKey,
          currentVersionId: version.id,
        });
      }
    }

    if (modeChanged || appendedVersions.length > 0) {
      data.thinkingCases[caseIndex] = {
        ...data.thinkingCases[caseIndex],
        updatedAt: now,
      };
      this.writeData(data);
    }

    const bundle = this.getCaseFromData(data, parsedInput.caseId);
    if (!bundle) {
      throw new ThinkingCaseNotFoundError(parsedInput.caseId);
    }

    return { appendedVersions, bundle };
  }

  private getCaseFromData(
    data: V2LocalStorageData,
    caseId: string,
  ): V2ThinkingCaseBundle | null {
    const thinkingCase = data.thinkingCases.find(
      (candidate) => candidate.id === caseId,
    );
    if (!thinkingCase) {
      return null;
    }

    const stageOrder = new Map(
      THINKING_STAGES.map((stage, index) => [stage, index]),
    );
    const steps = data.caseSteps
      .filter((step) => step.caseId === caseId)
      .sort(
        (left, right) =>
          (stageOrder.get(left.stage) ?? 0) -
          (stageOrder.get(right.stage) ?? 0),
      );
    const fieldResponses = data.fieldResponses.filter(
      (response) => response.caseId === caseId,
    );
    const responseIds = new Set(
      fieldResponses.map((response) => response.id),
    );
    const responseVersions = data.responseVersions
      .filter((version) => responseIds.has(version.fieldResponseId))
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

    return { thinkingCase, steps, fieldResponses, responseVersions };
  }

  private findCurrentVersion(
    data: V2LocalStorageData,
    fieldResponse: V2FieldResponse,
  ): V2ResponseVersion {
    const version = data.responseVersions.find(
      (candidate) => candidate.id === fieldResponse.currentVersionId,
    );
    if (!version) {
      throw new InvalidStoredDataError(
        "V2 현재 응답 버전을 찾을 수 없습니다: " +
          fieldResponse.currentVersionId,
      );
    }
    return version;
  }

  private readData(): V2LocalStorageData {
    let rawData: string | null;
    try {
      rawData = this.storage.getItem(THINKING_FLOW_V2_STORAGE_KEY);
    } catch (error) {
      throw new StorageAccessError(
        "브라우저 localStorage에서 Thinking Flow V2 데이터를 읽을 수 없습니다.",
        error,
      );
    }

    if (rawData === null) {
      return createEmptyV2LocalStorageData();
    }

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(rawData);
    } catch (error) {
      throw new InvalidStoredDataError(
        "Thinking Flow V2 데이터를 JSON으로 읽을 수 없습니다.",
        error,
      );
    }

    const envelopeResult = storageEnvelopeSchema.safeParse(parsedData);
    if (!envelopeResult.success) {
      throw new InvalidStoredDataError(
        "Thinking Flow V2 데이터에 유효한 schemaVersion이 없습니다.",
        envelopeResult.error,
      );
    }
    if (
      envelopeResult.data.schemaVersion !==
      V2_LOCAL_STORAGE_SCHEMA_VERSION
    ) {
      throw new UnsupportedStorageVersionError(
        envelopeResult.data.schemaVersion,
      );
    }

    const dataResult = v2LocalStorageDataSchema.safeParse(parsedData);
    if (!dataResult.success) {
      throw new InvalidStoredDataError(
        "Thinking Flow V2 데이터 형태가 유효하지 않습니다.",
        dataResult.error,
      );
    }
    return dataResult.data;
  }

  private writeData(data: V2LocalStorageData): void {
    const validatedData = v2LocalStorageDataSchema.parse(data);
    try {
      this.storage.setItem(
        THINKING_FLOW_V2_STORAGE_KEY,
        JSON.stringify(validatedData),
      );
    } catch (error) {
      throw new StorageAccessError(
        "브라우저 localStorage에 Thinking Flow V2 데이터를 저장할 수 없습니다.",
        error,
      );
    }
  }
}

function isSameContent(
  left: TextResponseContent,
  right: TextResponseContent,
): boolean {
  return left.type === right.type && left.value === right.value;
}
