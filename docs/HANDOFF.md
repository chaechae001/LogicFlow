# LogicFlow 최신 인수인계

## 작업 위치

- 로컬: `E:\Project\LogicFlow\thinking_flow`
- 원격: https://github.com/chaechae001/LogicFlow
- 이번 브랜치: `chore/portfolio-handoff-20261027`
- 원격 주소를 이전 `Thinking_Flow.git`에서 현재 `LogicFlow.git`로 정비했습니다.

## 먼저 읽을 것

1. [현재 상태](PROJECT_STATUS.md)와 [검증](VERIFICATION.md).
2. `docs/v2/00_V2_MASTER_CONTEXT.md`와 V2 로드맵의 V2-03.
3. `src/features/workspace/workspace-shell.tsx`, `context-stage-config.ts`.
4. `src/repositories/v2/`와 테스트.

## 저장 데이터

V1·V2의 저장 계약이 다릅니다. 새로운 작업 전에 브라우저 데이터를 따로 보존하고, UI에 안내된 명시적 초기화 외에 임의 삭제·자동 이관을 추가하지 않습니다. 사용자가 먼저 작성하며 AI는 그 이후에만 보조합니다. 실제 AI는 아직 연결되지 않았습니다.

## 다음 작업의 완료 기준

V2-03 범위로 제한하여 context 양 mode 작성 → 저장 → mode 전환 → 새로고침 → 두 값 복원, 중복 저장 버전 방지, Case 간 격리와 손상 복구 안내를 브라우저에서 확인합니다. 통과 후 자동 저장 정책을 결정합니다.

`design/redesign`은 추후 검토 자료입니다. 그 화면 전체를 한 번에 제품으로 이식하지 않습니다.
