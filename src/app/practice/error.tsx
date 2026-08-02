"use client";

import { RouteErrorState } from "../../components/route-error-state";

interface PracticeErrorProps {
  reset: () => void;
}

export default function PracticeError({ reset }: PracticeErrorProps) {
  return (
    <RouteErrorState
      description="Practice Case 목록을 불러오지 못했습니다. 다시 불러오기를 선택해주세요."
      reset={reset}
      title="연습 문제를 불러오지 못했습니다."
    />
  );
}
