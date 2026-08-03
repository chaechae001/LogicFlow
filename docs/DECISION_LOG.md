# Decision Log

## D-001
대표 사용자는 AI 활용 취업준비생·직무 전환자로 한다.

## D-002
대표 Practice Case는 올리브영 O2O 고객 여정 개선으로 한다.

## D-003
MVP는 Guided Practice부터 구현한다. My Case와 AI Scenario는 후속이다.

## D-004
첫 Vertical Slice에는 실제 AI를 연결하지 않는다.

## D-005
응답 수정은 덮어쓰지 않고 ResponseVersion으로 저장한다.

## D-006
Report는 학습 기록, Portfolio는 외부 역량 증명으로 분리한다.

## D-007
대표 Case의 미확인 올리브영 고객 행동과 성과는 가설로 표시한다.

## D-008
Primary Framework는 Customer Journey Map, 보조는 MECE Issue Tree, Hypothesis–Metric Matrix, Decision Matrix, SCQA/Minto다.

## D-009
Task 00의 웹 기반은 Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, npm으로 구성한다.

## D-010
소스 경계는 `app`, `components`, `domain`, `features`, `lib`, `repositories`, `test`로 시작한다. Task 00에서는 경계만 만들고 도메인 타입과 저장소 계약은 후속 Task에서 구현한다.

## D-011
단위 테스트 러너는 Vitest를 사용하고, 모든 Task에서 lint, typecheck, test, production build를 독립 스크립트로 검증할 수 있게 한다.

## D-012
도메인 식별자는 문자열, 저장·전송되는 날짜와 시간은 시간대 오프셋을 포함한 ISO 8601 문자열로 표현한다. 브라우저 저장소와 향후 원격 저장소 사이에서 직렬화 의미가 달라지지 않게 하기 위함이다.

## D-013
도메인 타입은 Zod 스키마에서 추론한다. 문서에 허용 값이 명시된 상태와 관계만 enum으로 제한하고, 아직 값 체계가 정해지지 않은 필드는 후속 기능 Task 전까지 문자열로 유지한다.

## D-014
올리브영 fixture의 `knownFacts`는 검증된 내부 사실이 아니라 Practice Case가 제공하는 연습 전제로 명시한다. 실제 고객 행동과 원인, 개선 효과는 `unknowns`와 후속 가설·검증 과정에 남긴다.

## D-015
**Superseded in part by D-025.** 초기 결정은 `thinking-flow:repository` 키 아래 `schemaVersion: 1`과 ThinkingCase, CaseStep, FieldResponse, ResponseVersion 배열을 가진 단일 JSON 문서로 저장하는 것이었다. 단일 JSON 문서, Zod 검증과 지원하지 않는 버전의 명시적 거부 원칙은 유지하되 현재 버전은 D-025에 따라 2를 사용한다.

## D-016
사용자 응답 수정은 기존 ResponseVersion을 변경하지 않고 새 버전을 append한다. FieldResponse는 최신 버전 ID만 가리키고, 새 버전은 `previousVersionId`로 직전 버전을 연결해 사고 이력을 보존한다.

## D-017
Repository 계약은 각 Task에서 실제 구현하는 기능만 포함해 확장한다. Task 02에서는 create/get/list/saveResponseVersion만 제공하고 Journey, Hypothesis, Validation, Alternative, Action Plan 저장 계약은 해당 기능 Task에서 추가한다.

## D-018
**Superseded by D-025.** 당시 결정은 Thinking Case 생성 시 8개 CaseStep을 함께 만들고 첫 단계만 `writing`으로 시작하는 것이었다. LocalStorageRepository의 ID 생성기와 시계는 주입 가능하게 해 브라우저 API 의존성과 테스트 결정성을 분리한다는 원칙은 유지한다.

## D-019
Practice Library와 Case 상세는 Task 01의 검증된 fixture catalog를 유일한 데이터 원천으로 사용한다. 화면용 올리브영 사실이나 예시 답안을 별도로 복제하지 않는다.

## D-020
로그인 도입 전 로컬 Thinking Case의 userId는 `local-user`로 고정한다. 이는 한 브라우저의 단일 사용자만 구분하기 위한 임시 식별자이며 인증이나 개인 식별을 의미하지 않는다.

## D-021
Case Start 화면은 localStorage를 직접 사용하지 않고 브라우저 Repository factory가 제공하는 `ThinkingCaseRepository`를 통해서만 Case를 생성한다. 생성 후 Repository가 반환한 Case ID와 currentStage로 다음 경로를 계산한다.

## D-022
Task 03에서는 생성 후 경로가 404가 되지 않도록 최소 전환 화면만 제공한다. 3열 레이아웃, 단계 내비게이션, 저장 상태, Soft Gate, AI 패널은 Task 04의 Workspace Shell에서 구현한다.

## D-023
Workspace Shell은 `ThinkingCaseRepository.getCase`로 ThinkingCase와 CaseStep을 조회하고 화면에서 localStorage를 직접 사용하지 않는다. 단계 상태는 저장된 CaseStep을 그대로 표시하며, Task 04의 단계 이동은 저장 데이터나 완료 상태를 임의로 변경하지 않는다.

## D-024
Soft Gate는 현재 단계가 완료되지 않은 상태에서 이후 단계로 이동할 때 미완성 항목을 경고하되 이동 자체는 허용한다. AI Panel은 사용자 작성 전에는 비활성 empty state만 표시하며 실제 점검과 단계별 응답 저장은 후속 Task로 남긴다.

## D-025
학습 FLOW, Workspace 내비게이션과 CaseStep은 `context`, `observation`, `problem_definition`, `problem_structuring`, `hypothesis`, `evidence_validation`, `decision`, `solution_execution`, `result_evaluation`, `conclusion_reflection`의 10단계를 사용한다. 새 Case는 10개 CaseStep을 만들고 `context`에서 시작한다. 기존 8단계의 schemaVersion 1은 자동 migration하지 않으며 localStorage schemaVersion 2에서 명시적으로 거부한다.

## D-026
각 단계의 작성 방식은 `freeform`과 `structured` 중 하나를 활성화한다. 별도 `both` 모드는 만들지 않으며, 방식 전환 시 양쪽의 기존 내용과 이력을 보존한다. Task 04에서는 선택 UI와 `locked`·`ready` AI Coach 상태 구조만 구현하고 WritingMode 영구 저장, 실제 입력, 버전 생성과 AI 호출은 Task 05 이후로 남긴다.

## D-027
Practice Case 시작 시 `내 첫 생각`, `이미 떠오른 해결안`, `핵심 의사결정 질문`의 사전 작성 단계를 제거한다. 사용자는 문제와 업무 요청을 확인한 뒤 Case를 생성하고 10단계 Workspace 안에서 자유 작성 또는 구조화 입력을 시작한다. 첫 생각은 `context`, 해결안은 `solution_execution`, 의사결정 질문은 `context` 또는 `problem_definition` 단계에서 다룬다. schemaVersion 1은 자동 migration하지 않고 전용 오류와 사용자가 직접 실행하는 로컬 데이터 초기화 동선을 제공한다.

## D-028
지원하지 않는 schemaVersion과 현재 version이지만 구조 검증에 실패한 로컬 데이터는 서로 다른 오류 타입으로 구분하되, 둘 다 자동 변환하거나 덮어쓰지 않는다. 사용자가 삭제 경고를 확인하고 명시적으로 초기화할 때만 Repository가 기존 데이터를 읽지 않고 유효한 빈 schemaVersion 2 문서를 기록한다. 이 두 복구 가능 오류와 입력·저장소 접근 오류는 UI에서 처리하고 개발 Console에는 warning으로 남기며, 예상하지 못한 오류만 error로 기록한다.
