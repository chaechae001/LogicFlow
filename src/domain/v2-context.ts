import { z } from "zod";

import {
  caseStepStatusSchema,
  fieldResponseSchema,
  thinkingCaseSchema,
} from "./schemas";
import { thinkingStageSchema, writingModeSchema } from "./thinking-stage";

const identifierSchema = z.string().trim().min(1);
const isoDateTimeSchema = z.iso.datetime({ offset: true });

export const contextFieldKeySchema = z.enum([
  "context.freeform",
  "context.goal",
  "context.current_situation",
  "context.stakeholders",
  "context.constraints_success",
]);

export const textResponseContentSchema = z
  .object({
    type: z.literal("text"),
    value: z.string(),
  })
  .strict();

export const v2CaseStepSchema = z
  .object({
    id: identifierSchema,
    caseId: identifierSchema,
    stage: thinkingStageSchema,
    status: caseStepStatusSchema,
    writingMode: writingModeSchema.nullable(),
    startedAt: isoDateTimeSchema.nullable(),
    completedAt: isoDateTimeSchema.nullable(),
  })
  .strict();

export const v2ResponseVersionSchema = z
  .object({
    id: identifierSchema,
    fieldResponseId: identifierSchema,
    version: z.number().int().positive(),
    contentJson: textResponseContentSchema,
    authorType: z.literal("user"),
    saveReason: z.literal("explicit_draft"),
    previousVersionId: identifierSchema.nullable(),
    createdAt: isoDateTimeSchema,
  })
  .strict();

export type ContextFieldKey = z.infer<typeof contextFieldKeySchema>;
export type TextResponseContent = z.infer<typeof textResponseContentSchema>;
export type V2CaseStep = z.infer<typeof v2CaseStepSchema>;
export type V2FieldResponse = z.infer<typeof fieldResponseSchema>;
export type V2ResponseVersion = z.infer<typeof v2ResponseVersionSchema>;
export type V2ThinkingCase = z.infer<typeof thinkingCaseSchema>;
