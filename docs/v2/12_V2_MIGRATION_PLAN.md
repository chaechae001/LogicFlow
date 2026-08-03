# Thinking Flow V2 Migration Plan

## 1. 목적

V1 기준점을 보존하면서 V2 문서, 코드, UI와 저장 데이터를 단계적으로 전환한다. 이 문서는 선택지를 비교하고 권장 방향을 제시하지만 migration 코드를 구현하거나 최종 schema를 확정하지 않는다.

## 2. Migration 범위

### 문서 migration

- 현재 공식 문서는 V1 기준으로 유지한다.
- `docs/v2/`에서 V2 설계를 승인한다.
- 승인 후 별도 작업에서 V1 문서를 `docs/v1_archive/`로 이동하거나 index에서 V1/V2 상태를 표시한다.
- 오래된 handoff 문서를 V2 기준으로 복사하지 않는다.

### 코드 migration

- V1의 project, Repository, Zod, 3열 Shell과 오류 처리 기반을 재사용한다.
- V2 vertical slice가 요구하는 계약부터 확장한다.
- V1 모델을 한 번에 삭제하지 않으며 교체 시 참조와 테스트를 먼저 확인한다.

### localStorage migration

- 현재 V1 `schemaVersion: 2`와 V2 `schemaVersion: 3`을 구분한다.
- 지원하지 않는 데이터는 조용히 변환·삭제하지 않는다.
- reset은 사용자 명시적 동의와 Repository를 통해 수행한다.

### 사용자 데이터 migration

현재 실제 운영 사용자가 없다는 전제를 사용한다. 그래도 개발·검수 데이터의 손실 가능성을 알리고 자동 삭제하지 않는다. 운영 사용자나 보존 의무가 생기면 이 전제를 폐기하고 별도 migration 검증이 필요하다.

### UI migration

- V1 Practice 시작과 Workspace route를 유지하며 V2 Stage 콘텐츠부터 교체한다.
- 입력·저장·완료·AI를 vertical slice로 붙인다.
- feature flag 또는 분리 route 필요 여부는 첫 코드 Task 전에 결정한다.

### branch 전략

- `main`: 승인된 안정 기준.
- `backup/v1-task04`와 `v1-task04-final`: V1 Task 04 rollback 기준.
- `develop/v2`: V2 문서와 승인된 V2 작업 통합 후보 branch.
- 기능 작업 branch 전략은 repository 운영 방식에 맞춰 별도 결정한다.

### rollback 전략

- 코드: V1 tag/branch로 동작과 계약을 확인한다.
- 저장: V1·V2 key를 분리하면 각 문서를 독립적으로 보존한다.
- UI: V2 slice를 되돌려도 V1 key를 덮어쓰지 않게 한다.
- 문서: V2 승인 전에는 V1 공식 문서를 그대로 유지한다.

## 3. localStorage 선택지 비교

| 선택지 | 장점 | 위험·비용 | 적합 조건 |
| --- | --- | --- | --- |
| 1. V1 데이터 초기화 | 구현이 가장 단순, 오래된 구조 제거 | 개발 데이터 손실, 되돌리기 어려움, 명시적 동의 필요 | 운영 사용자 없음, 데이터 보존 가치 낮음 |
| 2. V1 → V2 migration | 기존 Case 연속성 | 미확정 V2 model에 조기 결합, 8/10단계 과거 구조·필드 변형 검증 비용 | 실제 보존할 사용자 데이터와 안정된 target schema 존재 |
| 3. V1·V2 저장 key 분리 | V1 보존, rollback과 병행 검수 용이, 조용한 덮어쓰기 방지 | key 선택 UI·용량·정리 정책 필요, 나중에 통합 결정 필요 | V2 실험과 V1 기준을 안전하게 병행 |

## 4. 확정안

첫 V2 구현은 **3. V1과 V2 저장 key 분리**를 사용한다.

- 운영 사용자가 없더라도 검수용 V1 데이터를 보존할 수 있다.
- V2 schema가 여러 vertical slice에서 변해도 V1 `schemaVersion: 2` 문서를 손상시키지 않는다.
- V2 실패 시 코드와 저장 데이터를 함께 V1 기준으로 되돌리기 쉽다.
- V2 저장 key 내부의 최초 version은 `schemaVersion: 3`으로 시작한다.

V2 key는 `thinking-flow:v2:repository`, V2 문서 version은 `schemaVersion: 3`으로 확정한다. V1 key `thinking-flow:repository`는 수정하거나 reset하지 않는다.

V2 모델이 안정되고 실제 이전 가치가 확인된 뒤 선택적으로 import 도구를 만들 수 있다. 보존할 가치가 없는 개발 데이터는 사용자 동의 후 초기화할 수 있다.

## 5. 권장 단계

1. V2 문서와 Open Decision 승인.
2. V2 storage key와 schemaVersion target 확정.
3. V1·V2 문서가 서로 영향을 주지 않는 Repository test 작성.
4. `context` 한 단계의 V2 저장·복원 vertical slice.
5. 손상, 지원하지 않는 version, quota/access 실패 복구 검증.
6. 10단계 확대 전에 V1 rollback과 V2 reset 수동 검수.
7. V2 model 안정 후 V1 import 필요성 재평가.
8. V2 승인 후 문서 archive와 main 통합 전략 실행.

## 6. Migration acceptance 후보

- V1 branch/tag가 기준 commit을 가리킨다.
- V2 코드가 V1 storage key를 조용히 수정하지 않는다.
- 제품 V2와 storage schema version이 UI·문서·오류에서 혼동되지 않는다.
- 손상·비호환 데이터는 명시적으로 구분되고 자동 삭제되지 않는다.
- reset 대상과 손실 범위를 사용자가 확인한다.
- rollback 뒤 V1 앱이 기존 `schemaVersion: 2` 문서를 읽을 수 있다.
- migration/import가 생기면 source·target fixture와 idempotency test가 있다.

## 7. 문서와 handoff 처리

현재 untracked인 `docs/IMPLEMENTATION_COMPLETION_REPORT.md`와 `docs/codex_handoff/`는 이번 V2 설계에 포함하지 않는다. 다음 작업에서 V1 기록 보존, `docs/v1_archive/` 이동, V2 재작성 또는 삭제 중 하나를 검토한다.

## 8. Open Decision

- V2 앱에서 V1 데이터 존재를 알릴지
- V1 데이터를 읽기 전용으로 볼 수 있게 할지
- 선택적 import의 지원 범위와 mapping
- V2 reset이 V2 key만 지우는지 관련 cache도 포함하는지
- feature flag, 별도 route, branch만으로 UI를 격리할지
- V2 안정 후 V1 key와 branch를 얼마나 오래 보존할지
