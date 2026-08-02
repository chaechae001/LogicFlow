"use client";

import { RouteErrorState } from "../../../components/route-error-state";

interface NewCaseErrorProps {
  reset: () => void;
}

export default function NewCaseError({ reset }: NewCaseErrorProps) {
  return (
    <RouteErrorState
      description="Practice Case 정보를 불러오지 못했습니다. 다시 불러오기를 선택해주세요."
      reset={reset}
      title="Case 시작 화면을 열지 못했습니다."
    />
  );
}
