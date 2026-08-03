# Thinking Flow V2 Master Context

## 1. 이 문서의 역할

이 문서는 Thinking Flow V2 설계의 최상위 진입점이다. 제품 방향을 판단할 때는 이 문서에서 전체 맥락을 확인하고, 세부 사항은 `docs/v2/`의 책임별 문서를 참조한다.

- 현재 공식 문서와 현재 코드는 Thinking Flow V1 기준이다.
- `docs/v2/`는 승인 전 V2 설계 기준이다.
- V2 승인 전에는 V1 문서를 이동하거나 삭제하지 않는다.
- 승인 후 V1 문서를 `docs/v1_archive/`로 옮길지는 별도 작업에서 결정한다.

## 2. 버전 용어

| 용어 | 의미 | 현재 상태 |
| --- | --- | --- |
| Thinking Flow V1 | Task 04까지 구현된 제품 기준 | 기준점 `697b0e032223a06e18590da0542bf35302b45257` |
| Thinking Flow V2 | 학습·데이터·포트폴리오를 연결하는 다음 제품 설계 | 문서 설계 중, 기능 미구현 |
| `schemaVersion: 2` | V1 localStorage 문서 형식 | 현재 구현 |
| `schemaVersion: 3` | V2 전용 localStorage 문서 형식 | 제품 결정 확정, 코드 미구현 |

제품 버전과 저장 스키마 버전은 서로 다른 개념이다. “V2”라는 이름만으로 `schemaVersion: 2`를 뜻하지 않는다.

## 3. 전환 이유

V1은 10단계 Workspace의 안전한 기반을 검증했다. V2는 이 기반을 단순 입력 화면이 아니라 반복 학습, 사고 과정 데이터, 결과물 전환이 연결되는 제품으로 확장하기 위해 별도로 설계한다. 기존 상세 문서를 부분 수정하며 발생할 수 있는 V1·V2 기준 혼재를 막는 것도 전환 목적이다.

## 4. V1에서 해결된 것

- Next.js, React, TypeScript, Tailwind 기반
- 10개 `ThinkingStage`와 10개 `CaseStep`
- Practice Case를 사전 작성 없이 시작하고 `/workspace/context`로 진입
- Repository 추상화와 Zod 검증
- `schemaVersion: 2` localStorage 저장 및 비호환·손상 데이터의 명시적 초기화
- 3열 Workspace Shell
- 자유 작성·구조화 입력 선택 Shell
- AI Coach `locked | ready` 상태 구조
- 이동과 완료를 분리한 Soft Gate 골격
- append-only `ResponseVersion` 제품 원칙
- 로딩·오류·Case 없음 상태와 테스트 기반 개발 방식

## 5. V1의 한계

- 단계별 학습 설명, 질문, 예시, 구조화 템플릿이 제품 콘텐츠로 완성되지 않았다.
- 실제 단계 응답, 작성 방식, 자동 저장과 복원은 구현되지 않았다.
- `ResponseVersion`이 실제 단계 입력 흐름과 연결되지 않았다.
- AI Coach는 상태 Shell이며 실제 입력 기반 준비 판정과 호출 계약이 없다.
- 단계 완료 조건, checkpoint, 실제 미완성 항목 계산이 없다.
- 사고 분석·시각화와 포트폴리오 변환 흐름이 없다.
- V2 후보 데이터 모델과 현재 `schemaVersion: 2` 사이의 migration 정책이 확정되지 않았다.

## 6. V2 제품 정의

> 사용자가 자신의 생각을 먼저 꺼내고, 10단계 논리적 사고 절차에 따라 반복적으로 훈련하며, 그 사고 과정과 수정 이력을 데이터로 축적하고, 이를 분석·시각화·포트폴리오로 전환하는 웹 기반 사고 학습 서비스

V2의 목적은 AI가 좋은 답을 대신 생성하는 것이 아니다. 사용자가 사고 절차를 내재화하고, 최종 결과뿐 아니라 생각의 변화와 근거를 자신의 데이터로 남기게 하는 것이다.

## 7. 세 시스템

1. **Thinking Learning System**: 설명, 예시, 자유 작성, 구조화 템플릿, AI 점검으로 10단계를 반복 훈련한다.
2. **Thinking Data System**: 최초 초안, 수정본, 근거, 판단, AI 피드백 채택 여부와 회고를 시간 순서로 보존한다.
3. **Thinking Portfolio System**: 원본 사고 기록과 연결된 Case 결과물, 역량 포트폴리오, 블로그·면접용 파생물을 만든다.

세 시스템의 상세 기준은 각각 `02_V2_THINKING_FLOW.md`, `05_V2_THINKING_DATA_SYSTEM.md`, `07_V2_PORTFOLIO_SYSTEM.md`를 따른다.

## 8. 최종 10단계

| 순서 | Stage key | 표시명 |
| ---: | --- | --- |
| 1 | `context` | 목적·맥락 이해 |
| 2 | `observation` | 현상 관찰 |
| 3 | `problem_definition` | 문제 정의 |
| 4 | `problem_structuring` | 문제 분해·구조화 |
| 5 | `hypothesis` | 가설 설정 |
| 6 | `evidence_validation` | 근거 수집·검증 |
| 7 | `decision` | 대안 비교·의사결정 |
| 8 | `solution_execution` | 해결안 설계·실행 |
| 9 | `result_evaluation` | 결과 평가 |
| 10 | `conclusion_reflection` | 결론 전달·회고 |

이 key와 순서는 도메인, Workspace, 템플릿, AI 점검, 분석과 포트폴리오 연결의 공통 식별자다.

## 9. V2 구현 원칙

1. 사용자가 먼저 작성하며 AI는 작성 전 답안을 노출하지 않는다.
2. 자유 작성과 구조화 입력 중 하나만 활성화하지만 양쪽의 저장된 내용은 보존한다. `both` mode는 만들지 않는다.
   기본 권장 흐름은 짧은 자유 작성 후 구조화 질문으로 빠진 요소를 보완하는 방식이며, 사용자는 처음부터 구조화 입력을 선택할 수도 있다.
3. 수정은 과거 기록을 덮어쓰지 않고 버전으로 남긴다.
4. 단계 이동과 완료를 분리하고 Soft Gate를 유지한다.
5. 사실, 해석, 가설과 근거의 상태를 구분한다.
6. AI 피드백의 채택·거절도 사용자의 판단 데이터로 기록한다.
7. 분석과 포트폴리오는 원본 사고 기록으로 돌아갈 수 있어야 한다.
8. 현재 구현과 예정 기능을 문서에서 명시적으로 구분한다.
9. 한 번에 전체를 교체하지 않고 vertical slice로 검증한다.
10. V2 데이터는 `thinking-flow:v2:repository`와 `schemaVersion: 3`에 저장하며 V1 저장 key를 수정하거나 자동 migration하지 않는다.
11. Case Summary/Report는 전체 논리와 불확실성을 검토하는 내부 산출물이고, Portfolio는 외부 설명을 위해 사용자가 선택·편집하는 파생 결과물이다.

## 10. 재사용과 교체 후보

| 구분 | 항목 |
| --- | --- |
| 우선 재사용 | 프로젝트 기반, 디자인 톤, Practice Library 골격, 3열 Shell, 10단계 key, Repository, Zod, 저장 오류 복구, Soft Gate, 테스트 설정 |
| 계약을 확장해 재사용 | `ThinkingCaseRepository`, `FieldResponse`, `ResponseVersion`, WritingMode, AI 상태 |
| V2 기준 재설계 | 학습 콘텐츠, 구조화 질문, 저장 시점, 완료 판정, AI 계약, 분석 metric, 포트폴리오 모델 |
| 교체 가능 | V2 요구와 충돌하는 V1 저장 필드나 UI. 억지로 호환하지 않고 migration 계획에서 다룬다. |

## 11. 문서 우선순위와 참조 순서

1. 이 문서와 `11_V2_DECISION_LOG.md`에서 확정 기준을 확인한다.
2. `01_V2_PRODUCT_VISION.md`에서 문제와 비목표를 확인한다.
3. `02_V2_THINKING_FLOW.md`와 `03_V2_STAGE_TEMPLATES.md`에서 학습 기준을 확인한다.
4. Practice, Data, AI, Portfolio, UX 책임 문서를 확인한다.
5. `09_V2_DATA_MODEL.md`에서 구현 후보 계약을 확인한다.
6. `10_V2_DEVELOPMENT_ROADMAP.md`와 `12_V2_MIGRATION_PLAN.md`에 따라 작업을 나눈다.

## 12. Open Decision

- 단계별 필수 여부의 세부 기준과 향후 사용자 완료 UI
- autosave와 checkpoint의 도입 시점 및 세부 규칙
- AI Coach `ready` 판정과 실제 공급자·비용·안전 정책
- 분석 metric의 최소 공개 범위와 “AI 의존도”의 공정한 정의
- 포트폴리오 생성 조건, 편집 방식과 공개 범위
- V1 데이터를 장기적으로 읽기 전용 제공하거나 선택적으로 import할지
