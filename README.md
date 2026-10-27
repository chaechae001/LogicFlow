# LogicFlow

사용자가 먼저 생각을 작성하고, 문제 정의·가설·검증·판단 과정을 보존하며 논리적 사고를 훈련하는 웹 서비스입니다. 기존 코드와 문서에는 개발명 **Thinking Flow**가 남아 있습니다.

## 현재 구현

- Practice Library와 가상 올리브영 O2O Case 시작.
- 10단계 Workspace shell, 단계 이동과 Soft Gate.
- V2 `context` 단계의 자유 작성·구조화 입력, 명시적 초안 저장·복원, 버전 보존.
- localStorage Repository와 스키마 검증·손상 데이터 복구 경로.
- 퍼널·네이밍·IA·디자인 시스템·HTML 시안을 `design/`에 보존.

**10단계 전체 입력·자동 저장·실제 LLM·리포트/포트폴리오 생성이 모두 완료된 상태는 아닙니다.** 대표 Case는 공개 정보와 가정으로 만든 연습용이며 실제 올리브영 성과가 아닙니다.

기술: Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, Zod, Vitest, Testing Library.

## 실행·검증

```powershell
npm ci
npm run dev
```

http://localhost:3000 → Practice Case 선택 → Workspace `context` → 두 입력 방식 작성 → 명시적 저장 → 새로고침 복원을 확인합니다. 현재 기본 저장은 해당 브라우저의 localStorage이며 계정·서버 동기화는 없습니다.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## 이어서 작업하기

- [현재 진행 현황](docs/PROJECT_STATUS.md)
- [최신 인수인계](docs/HANDOFF.md)
- [검증 결과](docs/VERIFICATION.md)
- [V2 로드맵](docs/v2/10_V2_DEVELOPMENT_ROADMAP.md)
- [퍼널 설계](design/funnel/README.md), [리디자인 제안](design/redesign/README.md)

`docs/IMPLEMENTATION_COMPLETION_REPORT.md`, `docs/codex_handoff/`는 이전 기준선의 보관 자료입니다. 리디자인 시안은 현재 앱에 모두 적용된 구현이 아닙니다.
