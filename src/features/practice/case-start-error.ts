import { z } from "zod";

import {
  InvalidStoredDataError,
  StorageAccessError,
  UnsupportedStorageVersionError,
} from "../../repositories";

export type CaseStartErrorKind =
  | "unsupported_storage_version"
  | "invalid_stored_data"
  | "storage_access"
  | "validation"
  | "unknown";

export interface CaseStartErrorMessage {
  canResetLocalData: boolean;
  kind: CaseStartErrorKind;
  message: string;
}

export function getCaseStartErrorMessage(
  error: unknown,
): CaseStartErrorMessage {
  if (error instanceof UnsupportedStorageVersionError) {
    return {
      canResetLocalData: true,
      kind: "unsupported_storage_version",
      message:
        "이전에 저장된 V2 데이터가 현재 버전과 호환되지 않습니다. 계속하려면 V2 로컬 데이터만 초기화해야 합니다.",
    };
  }

  if (error instanceof InvalidStoredDataError) {
    return {
      canResetLocalData: true,
      kind: "invalid_stored_data",
      message:
        "이전에 저장된 V2 데이터가 현재 구조와 호환되지 않습니다. V2 로컬 데이터를 초기화한 후 다시 시작해주세요.",
    };
  }

  if (error instanceof StorageAccessError) {
    return {
      canResetLocalData: false,
      kind: "storage_access",
      message:
        "브라우저 저장소에 접근할 수 없습니다. 브라우저의 저장소 사용 설정을 확인한 뒤 다시 시도해주세요.",
    };
  }

  if (error instanceof z.ZodError) {
    return {
      canResetLocalData: false,
      kind: "validation",
      message:
        "Practice Case 정보가 올바르지 않아 시작할 수 없습니다. Case를 다시 선택해주세요.",
    };
  }

  return {
    canResetLocalData: false,
    kind: "unknown",
    message:
      "Case를 시작하지 못했습니다. 잠시 후 다시 시도하거나 Practice Case를 다시 선택해주세요.",
  };
}
