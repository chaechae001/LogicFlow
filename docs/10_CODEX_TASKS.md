# 10. Codex Task Specification

## Task 00 — Repository Bootstrap

### 목적
Next.js + TypeScript + Tailwind 기반 프로젝트 초기화.

### 완료 조건
- strict TypeScript
- lint/typecheck/test scripts
- 기본 폴더 구조
- docs 유지
- README 실행 방법

---

## Task 01 — Domain Types and Fixtures

### 구현
- `src/domain/` 타입
- Stage enum
- Practice Case fixture
- 올리브영 Case fixture
- Zod schema

### 테스트
fixture validation.

---

## Task 02 — Repository Adapter and Local Persistence

### 구현
- ThinkingCaseRepository
- LocalStorageRepository
- create/get/list
- ResponseVersion 저장
- migration version

### 테스트
새 버전이 기존 버전을 덮어쓰지 않는지.

---

## Task 03 — Practice Library and Case Start

### 구현
- `/practice`
- 올리브영 Case 카드
- `/cases/new?practiceCaseId=...`
- 첫 생각, 초기 해결안, 의사결정 질문
- Case 생성

### 제외
로그인, AI.

---

## Task 04 — Workspace Shell

### 구현
- 3열 Layout
- 8단계 Nav
- 저장 상태
- Soft Gate
- 단계 상태
- AI Panel empty state

---

## Task 05 — Step 1 Fact / Interpretation

### 구현
- 5개 카드
- 항목 추가·수정·삭제
- 최소 유효성
- 자동 저장
- 버전 기록

---

## Task 06 — Step 2 Problem Definition

### 구현
- 대상, 상황, 목표, 어려움, 영향, 가정, 질문
- 문제 문장 미리보기
- 기능 부재 표현 경고 규칙
- 버전 비교

---

## Task 07 — Step 3 Customer Journey

### 구현
- Journey Stage CRUD
- 가로 Canvas
- friction
- priority stage
- 간단한 Issue Group

---

## Task 08 — Step 4 Hypotheses

### 구현
- Hypothesis Card CRUD
- alternative hypothesis
- falsification
- category diversity validation

---

## Task 09 — Step 5 Validation Matrix

### 구현
- Hypothesis-linked rows
- quantitative/qualitative tag
- support/falsification criterion
- accessibility

---

## Task 10 — Step 6 Alternatives and Decision Matrix

### 구현
- alternatives
- criteria and weights
- scores and rationale
- selected alternative
- decision-changing condition

---

## Task 11 — Step 7 Action Plan

### 구현
- experiment specification
- success/revision/stop criteria
- next decision

---

## Task 12 — Step 8 Conclusion and Reflection

### 구현
- Top Message
- 3 reasons
- SCQA
- uncertainty
- reflection
- portfolio selection

---

## Task 13 — Logic Flow

### 구현
- React Flow
- entity-derived nodes
- basic edge relation
- read-only first
- stage filter

---

## Task 14 — Case Report

### 구현
- report snapshot
- all eight stages
- Logic Flow summary
- print-friendly UI

---

## Task 15 — Portfolio Preview

### 구현
- section selection
- order
- preview
- Markdown copy

---

## Task 16 — AI Coach Mock Contract

### 구현
- `CoachRequest`, `CoachFeedback`
- deterministic mock
- review request button
- feedback storage
- max 2 questions

### 제외
실제 API.

---

## Task 17 — Tests and Accessibility

### 구현
- domain unit tests
- repository tests
- stage flow integration
- Playwright happy path
- keyboard and labels

---

## Task 18 — Supabase Migration

Local adapter가 안정화된 후에만 진행.

---

## Task 19 — Real AI Coach

실제 API, 서버 route, structured output, safety, rate limit.

---

## Task 20 — My Case / AI Scenario

Practice Vertical Slice가 검증된 후 진행.
