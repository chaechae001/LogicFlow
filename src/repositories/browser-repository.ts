import { V2LocalStorageRepository } from "./v2/v2-local-storage-repository";

export function createBrowserThinkingCaseRepository(): V2LocalStorageRepository {
  return new V2LocalStorageRepository();
}
