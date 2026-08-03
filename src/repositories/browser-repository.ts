import { LocalStorageRepository } from "./local-storage/local-storage-repository";

export function createBrowserThinkingCaseRepository(): LocalStorageRepository {
  return new LocalStorageRepository();
}
