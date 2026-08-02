import { z } from "zod";

import type { PracticeCase, ThinkingCase } from "../../domain";
import type {
  CreateCaseInput,
  ThinkingCaseRepository,
} from "../../repositories";

export const LOCAL_USER_ID = "local-user";

export const startPracticeCaseValuesSchema = z
  .object({
    initialImpression: z.string().trim().min(1, "내 첫 생각을 작성해주세요."),
    initialSolutionIdea: z
      .string()
      .trim()
      .min(1, "이미 떠오른 해결안을 작성해주세요."),
    decisionQuestion: z
      .string()
      .trim()
      .min(1, "핵심 의사결정 질문을 작성해주세요."),
  })
  .strict();

export type StartPracticeCaseValues = z.infer<
  typeof startPracticeCaseValuesSchema
>;

export interface StartPracticeCaseResult {
  thinkingCase: ThinkingCase;
  destination: string;
}

export function buildCreateCaseInput(
  practiceCase: PracticeCase,
  values: StartPracticeCaseValues,
): CreateCaseInput {
  const parsedValues = startPracticeCaseValuesSchema.parse(values);

  return {
    userId: LOCAL_USER_ID,
    practiceCaseId: practiceCase.id,
    origin: "practice_library",
    title: practiceCase.title,
    aiMode: "guide",
    initialImpression: parsedValues.initialImpression,
    initialSolutionIdea: parsedValues.initialSolutionIdea,
    decisionQuestion: parsedValues.decisionQuestion,
  };
}

export async function startPracticeCase(
  repository: ThinkingCaseRepository,
  practiceCase: PracticeCase,
  values: StartPracticeCaseValues,
): Promise<StartPracticeCaseResult> {
  const thinkingCase = await repository.createCase(
    buildCreateCaseInput(practiceCase, values),
  );

  return {
    thinkingCase,
    destination: `/cases/${thinkingCase.id}/workspace/${thinkingCase.currentStage}`,
  };
}
