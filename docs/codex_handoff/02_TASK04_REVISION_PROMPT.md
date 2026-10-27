> 이전 인수인계 자료입니다. 현재 코드·브랜치·다음 작업은 [최신 인수인계](../HANDOFF.md)를 우선합니다.

# Codex 두 번째 요청 — Task 04 수정

앞서 제출한 영향 분석과 사용자의 승인 내용을 기준으로 Task 04만 수정해주세요.

## 작업 전 확인

- `AGENTS.md`
- `docs/DECISION_LOG.md`
- `docs/03_LEAN_PRD.md`
- `docs/02_PRODUCT_CORE.md`
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/IMPLEMENTATION_COMPLETION_REPORT.md`
- `docs/codex_handoff/04_PROJECT_OPERATING_RULES.md`
- `docs/codex_handoff/06_THINKING_FLOW_ALIGNMENT.md`
- `docs/codex_handoff/10_CONFIRMED_PRODUCT_DECISIONS.md`
- 사용자가 승인한 영향 분석 결과

## 목표

미커밋 Task 04 Workspace Shell을 최신 기준에 맞춘다.

### 1. 10단계 FLOW

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

- 왼쪽 내비게이션은 10개 단계
- 진행률은 `n/10`
- Case 생성 구조는 10개 CaseStep을 수용
- 첫 단계는 목적·맥락 이해
- 기존 8단계를 단순 숫자 치환하지 말고 타입·route·fixture·Repository·테스트 정합성을 함께 맞춘다.

### 2. 작성 방식 선택 UI

각 단계 중앙 영역에 다음 선택지를 제공한다.

- 자유 작성
- 구조화 입력

요구사항:

- 선택 전 상태가 명확해야 한다.
- 두 선택지 중 어느 하나를 기본 정답처럼 강제하지 않는다.
- 자유 작성 선택 상태와 구조화 입력 선택 상태를 Shell에서 표현한다.
- 작성 방식을 바꾸거나 함께 사용할 수 있는 미래 구조를 막지 않는다.
- 기존 입력 보존 원칙을 UI 문구와 타입 구조가 위반하지 않는다.
- 실제 텍스트 입력, 영구 저장, 자동 저장, ResponseVersion 생성은 구현하지 않는다.

### 3. AI Coach

- 사용자 입력 전 비활성 상태 유지
- 자유 작성 또는 구조화 입력 후 점검을 요청할 수 있다는 문구 제공
- 실제 AI 호출은 구현하지 않는다.

### 4. 유지할 구현

- Practice Library
- Practice Case 상세 화면
- Case 시작 전 최초 생각 작성
- Repository 기반 Case 생성·조회
- Workspace 3열 기본 골격
- AI Coach Panel
- Soft Gate
- 저장 상태 표시
- 로딩·오류·Case 없음 상태
- append-only ResponseVersion 원칙

## Task 04 범위

- 10단계 타입·구성·내비게이션·진행률
- 10개 CaseStep 생성 정렬
- stage key와 route 정렬
- 자유 작성/구조화 선택 UI와 Shell 상태
- AI 활성·비활성 상태 문구
- Case 시작 기록 참고 영역 개선
- 관련 테스트
- 필요한 기준 문서 상태 업데이트

## Task 05로 미룰 범위

- 실제 입력 CRUD
- WritingMode 영구 저장
- 자동 저장
- ResponseVersion 생성
- AI 호출
- 단계 완료 판정
- 미완성 항목 안내
- 버전 비교

## 데이터 처리

기존 localStorage schemaVersion 처리 방식은 사용자가 승인한 분석 결과를 따른다. 승인 없이 임의 마이그레이션 또는 데이터 삭제를 하지 않는다.

## 검증

저장소에서 정의한 스크립트 이름을 먼저 확인한 뒤 다음 검증을 모두 수행한다.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 완료 보고 형식

1. 수정한 파일
2. 10단계 타입·route·CaseStep 변경 내용
3. 자유 작성/구조화 선택 Shell 구현 내용
4. 유지한 기존 구조
5. Task 05로 남긴 범위
6. localStorage/schemaVersion 처리 결과
7. 테스트 결과
8. 브라우저에서 사용자가 확인해야 할 항목
9. 남은 위험과 미결정 사항
10. `docs/codex_handoff/` 파일을 이번 커밋에 포함할지에 대한 권장안

아직 `git add`, `commit`, `push`는 실행하지 마세요.
