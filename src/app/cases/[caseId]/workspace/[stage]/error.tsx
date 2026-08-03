"use client";

import { RouteErrorState } from "../../../../../components/route-error-state";

interface WorkspaceErrorProps {
  reset: () => void;
}

export default function WorkspaceError({ reset }: WorkspaceErrorProps) {
  return (
    <RouteErrorState
      description="Workspace 경로를 준비하지 못했습니다. 잠시 후 다시 시도해주세요."
      reset={reset}
      title="Workspace를 열지 못했습니다."
    />
  );
}
