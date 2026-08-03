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

export function getPracticeCaseById(
  practiceCaseId: string,
): PracticeCase | null {
  const practiceCase = practiceCaseFixtures.find(
    (candidate) => candidate.id === practiceCaseId,
  );

  return practiceCase ? practiceCaseSchema.parse(practiceCase) : null;
}

export async function findPracticeCase(
  practiceCaseId: string,
): Promise<PracticeCase | null> {
  return getPracticeCaseById(practiceCaseId);
}
