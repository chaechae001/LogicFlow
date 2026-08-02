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
