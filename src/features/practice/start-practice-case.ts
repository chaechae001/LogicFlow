import type { PracticeCase, ThinkingCase } from "../../domain";
import type {
  CreateCaseInput,
  V2ThinkingCaseRepository,
} from "../../repositories";

export const LOCAL_USER_ID = "local-user";

export interface StartPracticeCaseResult {
  thinkingCase: ThinkingCase;
  destination: string;
}

export function buildCreateCaseInput(
  practiceCase: PracticeCase,
): CreateCaseInput {
  return {
    userId: LOCAL_USER_ID,
    practiceCaseId: practiceCase.id,
    origin: "practice_library",
    title: practiceCase.title,
    aiMode: "guide",
  };
}

export async function startPracticeCase(
  repository: Pick<V2ThinkingCaseRepository, "createCase">,
  practiceCase: PracticeCase,
): Promise<StartPracticeCaseResult> {
  const thinkingCase = await repository.createCase(
    buildCreateCaseInput(practiceCase),
  );

  return {
    thinkingCase,
    destination: `/cases/${thinkingCase.id}/workspace/${thinkingCase.currentStage}`,
  };
}
