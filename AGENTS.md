> 현재 기준(2026-10-27): V2 context 초안 저장 구현입니다. `docs/HANDOFF.md`, `docs/PROJECT_STATUS.md`, `docs/VERIFICATION.md`를 먼저 읽고 `docs/v2/10_V2_DEVELOPMENT_ROADMAP.md`의 V2-03 검수를 이어갑니다. 아래 제품 원칙은 유지하되 V1 Task 순서만으로 현재 상태를 판단하지 않습니다.

# AGENTS.md — Thinking Flow 개발 규칙

## 1. 제품 철학

이 제품은 AI 답안 생성기가 아니다. 사용자가 스스로 사고하고, AI는 사용자가 먼저 작성한 이후에만 질문·반례·논리 공백 점검을 제공한다.

다음 원칙을 절대 훼손하지 않는다.

1. 사용자 선작성
2. 과정과 버전 보존
3. 사실·해석·가설 분리
4. 복수 가설과 기각 조건
5. 근거 기반 의사결정
6. 작은 검증 행동
7. 최초 생각과 최종 판단 비교
8. 리포트와 포트폴리오의 목적 분리

## 2. 대표 사용자

AI를 자주 활용하지만 자신의 논리적 사고력과 문제해결력을 키워 프로젝트와 포트폴리오로 증명하고 싶은 취업준비생·직무 전환자.

## 3. 대표 Case

올리브영 오프라인 상품 체험을 앱 탐색·구매로 연결하는 O2O 고객 여정 개선.

이 Case는 실제 올리브영 내부 데이터에 근거한 사실 확정이 아니라, 공개 정보와 가정을 기반으로 설계한 **가상 현업형 Practice Case**다. 모든 미검증 주장은 가설로 표시한다.

## 4. MVP 10단계

1. 목적·맥락 이해
2. 현상 관찰
3. 문제 정의
4. 문제 분해·구조화
5. 가설 설정
6. 근거 수집·검증
7. 대안 비교·의사결정
8. 해결안 설계·실행
9. 결과 평가
10. 결론 전달·회고

각 단계에서 사용자는 자유 작성 또는 구조화 입력 중 하나의 작성 화면을 활성화할 수 있다. 작성 방식을 전환해도 기존 방식의 내용과 수정 이력을 삭제하지 않는다.

## 5. 구현 우선순위

### P0
- Practice Case 생성 및 선택
- Guided Thinking Workspace
- 단계별 응답 저장
- Response Version 관리
- Hypothesis / Validation / Alternative / Action Plan
- Logic Flow
- Case Report
- Portfolio Preview

### P1
- AI Coach 계약과 Mock 응답
- Growth Flow
- Rubric
- My Case 인터뷰
- AI Scenario 생성

### P2
- 실제 LLM
- RAG
- 통계·머신러닝 분석
- 데이터 업로드
- 외부 연동

## 6. 코딩 규칙

- TypeScript strict mode
- `any` 금지
- 도메인 타입과 UI 타입 분리
- 입력 검증은 Zod
- 비즈니스 로직은 컴포넌트 밖에 둔다
- Repository 인터페이스를 통해 저장소를 추상화한다
- 사용자 응답을 수정할 때 덮어쓰지 않고 새 버전을 생성한다
- AI 제안과 사용자 작성 내용을 명확히 구분한다
- 접근성: label, keyboard navigation, focus state
- 모바일은 반응형이되 MVP는 데스크톱 우선
- 테스트 없는 핵심 비즈니스 로직 추가 금지

## 7. 작업 방식

한 번에 전체 앱을 만들지 않는다. `docs/10_CODEX_TASKS.md`의 Task 단위로 구현하고 매 Task마다 아래를 수행한다.

1. 변경 파일 목록 제시
2. 구현 내용 요약
3. 테스트 실행
4. 미해결 이슈 기록
5. `docs/IMPLEMENTATION_STATUS.md` 갱신
6. 중요한 결정은 `docs/DECISION_LOG.md`에 기록

## 8. 금지 사항

- 사용자 입력 전에 완성 답안 노출
- 검증되지 않은 올리브영 내부 성과·지표를 사실처럼 표현
- 문제 정의 단계에서 특정 기능을 정답으로 고정
- 최종 텍스트만 저장하고 사고 이력 삭제
- AI가 최종 대안을 자동 선택
- 대규모 RAG부터 구현
- 전체 기능을 한 Task에서 구현
