import { z } from "zod";

import {
  fieldResponseSchema,
  thinkingCaseSchema,
  v2CaseStepSchema,
  v2ResponseVersionSchema,
} from "../../domain";

export const V2_LOCAL_STORAGE_SCHEMA_VERSION = 3 as const;
export const THINKING_FLOW_V2_STORAGE_KEY = "thinking-flow:v2:repository";

export const v2LocalStorageDataSchema = z
  .object({
    schemaVersion: z.literal(V2_LOCAL_STORAGE_SCHEMA_VERSION),
    thinkingCases: z.array(thinkingCaseSchema),
    caseSteps: z.array(v2CaseStepSchema),
    fieldResponses: z.array(fieldResponseSchema),
    responseVersions: z.array(v2ResponseVersionSchema),
  })
  .strict();

export type V2LocalStorageData = z.infer<typeof v2LocalStorageDataSchema>;

export function createEmptyV2LocalStorageData(): V2LocalStorageData {
  return {
    schemaVersion: V2_LOCAL_STORAGE_SCHEMA_VERSION,
    thinkingCases: [],
    caseSteps: [],
    fieldResponses: [],
    responseVersions: [],
  };
}
