# Thinking Flow — Codex Handoff Package

## 프로젝트 목표

AI를 잘 활용하고 싶은 사용자가 근본 역량인 논리적 사고력과 문제해결 역량을 반복 훈련하도록 돕고, 그 과정을 학습 리포트와 포트폴리오로 전환하는 웹 기반 학습 플랫폼을 만든다.

핵심 원칙은 **AI가 답을 대신 작성하지 않고, 사용자가 먼저 사고한 뒤 질문·반례·논리 공백 점검을 제공하는 것**이다.

## 현재 대표 Case

**올리브영 오프라인 상품 체험을 앱 탐색·구매로 연결하는 O2O 고객 여정 개선**

## 이 패키지의 사용 순서

1. 저장소 루트에 이 패키지의 파일을 복사한다.
2. `AGENTS.md`를 저장소 루트에 둔다.
3. `docs/` 폴더의 문서를 Codex가 읽을 수 있게 유지한다.
4. `09_CODEX_MASTER_PROMPT.md`의 프롬프트를 Codex 새 작업에 붙여 넣는다.
5. `10_CODEX_TASKS.md`의 Task 01부터 순서대로 구현한다.
6. 각 Task가 끝날 때마다 `docs/DECISION_LOG.md`와 `docs/IMPLEMENTATION_STATUS.md`를 갱신한다.
7. ChatGPT로 다시 가져올 때는 `11_CHATGPT_HANDOFF.md`의 절차를 따른다.

## 권장 프로젝트 구조

```text
thinking-flow/
├─ AGENTS.md
├─ README.md
├─ package.json
├─ src/
├─ public/
├─ supabase/
└─ docs/
   ├─ 01_PROJECT_CONTEXT.md
   ├─ 02_PRODUCT_CORE.md
   ├─ 03_LEAN_PRD.md
   ├─ 04_OLIVEYOUNG_CASE.md
   ├─ 05_GUIDED_FLOW_SPEC.md
   ├─ 06_AI_COACH_SPEC.md
   ├─ 07_UX_WIREFRAME.md
   ├─ 08_DATA_MODEL.md
   ├─ 09_CODEX_MASTER_PROMPT.md
   ├─ 10_CODEX_TASKS.md
   ├─ 11_CHATGPT_HANDOFF.md
   ├─ 12_SOURCE_MAP.md
   ├─ DECISION_LOG.md
   └─ IMPLEMENTATION_STATUS.md
```

## 권장 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- React Flow
- Zod
- React Hook Form
- Vitest 또는 Jest
- Playwright
- Vercel

초기 Vertical Slice에서는 Supabase 대신 localStorage 기반 Repository Adapter로 시작해도 된다. 단, 데이터 인터페이스는 추후 Supabase로 교체할 수 있게 분리한다.

## 첫 번째 개발 목표

AI가 없는 Vertical Slice를 먼저 완성한다.

```text
Case 생성
→ 8단계 작성
→ 자동 저장·재개
→ 가설·검증·대안·Action Plan
→ Logic Flow
→ Case Report
→ Portfolio Preview
```

LLM API, RAG, 로그인, 결제는 이후 단계로 미룬다.
