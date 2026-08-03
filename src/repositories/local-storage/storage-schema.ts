import { z } from "zod";

import {
  caseStepSchema,
  fieldResponseSchema,
  responseVersionSchema,
  thinkingCaseSchema,
} from "../../domain";

export const LOCAL_STORAGE_SCHEMA_VERSION = 2 as const;
export const THINKING_FLOW_STORAGE_KEY = "thinking-flow:repository";

export const localStorageDataSchema = z
  .object({
    schemaVersion: z.literal(LOCAL_STORAGE_SCHEMA_VERSION),
    thinkingCases: z.array(thinkingCaseSchema),
    caseSteps: z.array(caseStepSchema),
    fieldResponses: z.array(fieldResponseSchema),
    responseVersions: z.array(responseVersionSchema),
  })
  .strict();

export type LocalStorageData = z.infer<typeof localStorageDataSchema>;

export function createEmptyLocalStorageData(): LocalStorageData {
  return {
    schemaVersion: LOCAL_STORAGE_SCHEMA_VERSION,
    thinkingCases: [],
    caseSteps: [],
    fieldResponses: [],
    responseVersions: [],
  };
}
