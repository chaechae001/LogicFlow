import { LocalStorageRepository } from "./local-storage/local-storage-repository";
import type { ThinkingCaseRepository } from "./thinking-case-repository";

export function createBrowserThinkingCaseRepository(): ThinkingCaseRepository {
  return new LocalStorageRepository();
}
