import { z } from "zod";

import {
  aiCoachModeSchema,
  responseAuthorTypeSchema,
  thinkingCaseOriginSchema,
  type CaseStep,
  type FieldResponse,
  type ResponseVersion,
  type ThinkingCase,
  thinkingStageSchema,
} from "../domain";

const identifierSchema = z.string().trim().min(1);

export const createCaseInputSchema = z
  .object({
    userId: identifierSchema,
    practiceCaseId: identifierSchema.nullable(),
    origin: thinkingCaseOriginSchema,
    title: z.string().trim().min(1),
    aiMode: aiCoachModeSchema,
    initialImpression: z.string(),
    initialSolutionIdea: z.string(),
    decisionQuestion: z.string(),
  })
  .strict();

export const saveResponseVersionInputSchema = z
  .object({
    caseId: identifierSchema,
    stage: thinkingStageSchema,
    fieldKey: identifierSchema,
    contentJson: z.json(),
    authorType: responseAuthorTypeSchema,
  })
  .strict();

export type CreateCaseInput = z.infer<typeof createCaseInputSchema>;
export type SaveResponseVersionInput = z.infer<
  typeof saveResponseVersionInputSchema
>;

export interface ThinkingCaseBundle {
  thinkingCase: ThinkingCase;
  steps: CaseStep[];
  fieldResponses: FieldResponse[];
  responseVersions: ResponseVersion[];
}

export interface ThinkingCaseSummary {
  id: ThinkingCase["id"];
  practiceCaseId: ThinkingCase["practiceCaseId"];
  origin: ThinkingCase["origin"];
  title: ThinkingCase["title"];
  status: ThinkingCase["status"];
  currentStage: ThinkingCase["currentStage"];
  updatedAt: ThinkingCase["updatedAt"];
}

export interface ThinkingCaseRepository {
  createCase(input: CreateCaseInput): Promise<ThinkingCase>;
  getCase(caseId: string): Promise<ThinkingCaseBundle | null>;
  listCases(): Promise<ThinkingCaseSummary[]>;
  saveResponseVersion(
    input: SaveResponseVersionInput,
  ): Promise<ResponseVersion>;
}
