import { z } from "zod";

import {
  contextFieldKeySchema,
  textResponseContentSchema,
  type ContextFieldKey,
  type V2CaseStep,
  type V2FieldResponse,
  type V2ResponseVersion,
  type V2ThinkingCase,
  writingModeSchema,
} from "../domain";
import type { CreateCaseInput } from "./thinking-case-repository";

const identifierSchema = z.string().trim().min(1);

export const saveContextDraftInputSchema = z
  .object({
    caseId: identifierSchema,
    writingMode: writingModeSchema.nullable(),
    fields: z
      .array(
        z
          .object({
            fieldKey: contextFieldKeySchema,
            contentJson: textResponseContentSchema,
          })
          .strict(),
      )
      .superRefine((fields, context) => {
        const fieldKeys = new Set<ContextFieldKey>();

        fields.forEach((field, index) => {
          if (fieldKeys.has(field.fieldKey)) {
            context.addIssue({
              code: "custom",
              message: "같은 Context fieldKey를 한 번만 저장할 수 있습니다.",
              path: [index, "fieldKey"],
            });
          }
          fieldKeys.add(field.fieldKey);
        });
      }),
  })
  .strict();

export type SaveContextDraftInput = z.infer<
  typeof saveContextDraftInputSchema
>;

export interface V2ThinkingCaseBundle {
  thinkingCase: V2ThinkingCase;
  steps: V2CaseStep[];
  fieldResponses: V2FieldResponse[];
  responseVersions: V2ResponseVersion[];
}

export interface SaveContextDraftResult {
  bundle: V2ThinkingCaseBundle;
  appendedVersions: V2ResponseVersion[];
}

export interface V2ThinkingCaseRepository {
  createCase(input: CreateCaseInput): Promise<V2ThinkingCase>;
  getCase(caseId: string): Promise<V2ThinkingCaseBundle | null>;
  resetLocalData(): Promise<void>;
  saveContextDraft(
    input: SaveContextDraftInput,
  ): Promise<SaveContextDraftResult>;
}
