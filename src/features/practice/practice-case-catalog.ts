import {
  oliveyoungPracticeCase,
  practiceCaseSchema,
  type PracticeCase,
} from "../../domain";

const practiceCaseFixtures: readonly PracticeCase[] = [
  oliveyoungPracticeCase,
];

export async function listPracticeCases(): Promise<PracticeCase[]> {
  return practiceCaseFixtures.map((practiceCase) =>
    practiceCaseSchema.parse(practiceCase),
  );
}

export async function findPracticeCase(
  practiceCaseId: string,
): Promise<PracticeCase | null> {
  const practiceCases = await listPracticeCases();

  return (
    practiceCases.find((practiceCase) => practiceCase.id === practiceCaseId) ??
    null
  );
}
