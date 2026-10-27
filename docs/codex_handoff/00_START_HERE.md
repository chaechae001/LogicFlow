> 이전 인수인계 자료입니다. 현재 코드·브랜치·다음 작업은 [최신 인수인계](../HANDOFF.md)를 우선합니다.

# Thinking Flow Codex 인수인계 패키지 — 시작 안내

> 최신 기준: 2026-08-03  
> 실제 저장소 문서 경로를 반영한 V2 패키지

이 패키지는 기존 Task 00~04 구현을 폐기하지 않고, 미커밋 Task 04를 최신 제품 결정에 맞춰 수정하기 위한 자료다.

## 1. 설치 위치

이 ZIP은 저장소 루트에서 압축을 풀면 다음 경로에 배치되도록 구성되어 있다.

```text
docs/codex_handoff/
```

기존 `AGENTS.md`, `docs/DECISION_LOG.md`, `docs/03_LEAN_PRD.md`, `docs/02_PRODUCT_CORE.md`, 소스 코드를 덮어쓰지 않는다.

## 2. 실제 저장소 기준 문서

현재 저장소에서 사용하는 실제 경로는 다음과 같다.

| 역할 | 실제 경로 |
|---|---|
| 최상위 작업 규칙 | `AGENTS.md` |
| 제품 핵심 원칙 | `docs/02_PRODUCT_CORE.md` |
| Lean PRD | `docs/03_LEAN_PRD.md` |
| 결정 기록 | `docs/DECISION_LOG.md` |
| 구현 상태 | `docs/IMPLEMENTATION_STATUS.md` |
| 구현 완료 보고 | `docs/IMPLEMENTATION_COMPLETION_REPORT.md` |

과거 자료에 등장하는 `04_PRODUCT_PRINCIPLES.md`, `05_MVP_PRD.md`, `06_DECISION_LOG.md`는 현재 저장소의 실제 파일명이 아니다. 실행 프롬프트에서는 위 실제 경로만 사용한다.

## 3. 사용 순서

1. `01_CODEX_MASTER_PROMPT.md`로 현재 상태와 영향 범위만 분석한다.
2. 분석 결과를 사용자가 검토하고 미결정 사항을 확정한다.
3. `02_TASK04_REVISION_PROMPT.md`로 Task 04 수정만 수행한다.
4. `09_BROWSER_REVIEW_CHECKLIST.md`로 브라우저를 직접 검수한다.
5. 검수 후 `03_GIT_REVIEW_AND_COMMIT_PROMPT.md`로 승인 파일만 add·commit·push한다.

## 4. 최신 확정 결정

상세 내용은 `10_CONFIRMED_PRODUCT_DECISIONS.md`를 따른다.

- 학습 FLOW, Workspace 내비게이션, CaseStep은 10단계다.
- 기존 8단계와 8개 Workspace 통합안은 최신 기준이 아니다.
- 각 단계에서 자유 작성과 구조화 입력 중 하나를 선택할 수 있다.
- 작성 방식을 바꿔도 기존 입력은 삭제하지 않는다.
- 사용자가 작성하기 전 AI Coach는 비활성이다.
- 단계 이동과 완료는 분리한다.

## 5. 문서 우선순위

문서가 충돌하면 다음 순서를 적용한다.

1. 사용자의 현재 메시지
2. `docs/DECISION_LOG.md`의 최신 결정
3. `docs/codex_handoff/10_CONFIRMED_PRODUCT_DECISIONS.md`
4. 활성 Task 명세
5. `docs/03_LEAN_PRD.md`
6. `docs/02_PRODUCT_CORE.md`
7. `docs/codex_handoff/04_PROJECT_OPERATING_RULES.md`
8. 나머지 저장소 기준 문서
9. `docs/codex_handoff/08_FULL_HANDOFF.md`

`08_FULL_HANDOFF.md`는 역사와 배경 참고용이며, 최신 결정의 근거 문서가 아니다.

## 6. 현재 작업 목표

Task 05로 넘어가기 전에 미커밋 Task 04를 다음 기준에 맞춘다.

- 8단계 → 10단계
- 단일 placeholder → 자유 작성/구조화 입력 선택 구조
- 기존 3열 Shell, Repository, Soft Gate, AI empty state 등 재사용 가능한 부분 유지
- 실제 입력 저장과 AI 호출은 Task 05 이후로 분리
