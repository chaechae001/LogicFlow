> 이전 인수인계 자료입니다. 현재 코드·브랜치·다음 작업은 [최신 인수인계](../HANDOFF.md)를 우선합니다.

# Codex 첫 요청 — Task 04 영향 분석만 수행

기존 작업을 이어서 진행합니다.

이번 요청에서는 파일을 수정하지 말고, 현재 Task 04 구현과 최신 확정 결정의 차이만 분석해주세요.

## 작업 전 필수 확인

다음 파일은 현재 저장소의 실제 경로입니다.

1. `AGENTS.md`
2. `docs/DECISION_LOG.md`
3. `docs/03_LEAN_PRD.md`
4. `docs/02_PRODUCT_CORE.md`
5. `docs/IMPLEMENTATION_STATUS.md`
6. `docs/IMPLEMENTATION_COMPLETION_REPORT.md`
7. `docs/codex_handoff/00_START_HERE.md`
8. `docs/codex_handoff/04_PROJECT_OPERATING_RULES.md`
9. `docs/codex_handoff/05_CURRENT_IMPLEMENTATION_STATE.md`
10. `docs/codex_handoff/06_THINKING_FLOW_ALIGNMENT.md`
11. `docs/codex_handoff/10_CONFIRMED_PRODUCT_DECISIONS.md`

`docs/codex_handoff/08_FULL_HANDOFF.md`는 위 문서만으로 맥락이 부족할 때만 참고해주세요.

이전 채팅의 기억보다 현재 저장소의 파일과 실제 Git 상태를 우선해주세요. 문서가 없거나 서로 충돌하면 추정하지 말고 먼저 보고해주세요.

## 먼저 실행할 조회 명령

```bash
git status
git diff --stat
git diff
```

조회 외 Git 변경 명령은 실행하지 마세요.

## 최신 확정 결정

### 사고 FLOW

기존 8단계가 아니라 다음 10단계를 Workspace, CaseStep, 내비게이션 기준으로 사용합니다.

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

10단계를 8개 단계로 축약하지 않습니다.

### 작성 방식

각 단계에서 사용자는 다음 중 하나를 선택할 수 있어야 합니다.

- 자유 작성
- 구조화 입력

두 방식은 동일한 CaseStep 안에서 사용됩니다. 사용자는 방식을 변경하거나 함께 사용할 수 있고, 기존 입력은 삭제하지 않습니다.

Task 04에서는 선택 UI와 상태 구조까지만 다루며, 실제 입력 저장·버전 생성·자동 저장은 Task 05 이후 범위입니다.

### AI와 단계 이동

- 사용자가 먼저 작성합니다.
- 사용자 작성 전 AI Coach는 비활성입니다.
- AI는 완성 답안을 먼저 제공하지 않습니다.
- 단계 이동과 단계 완료는 분리합니다.
- Soft Gate는 유지합니다.

## 분석 형식

A. 현재 Git 상태  
B. 유지할 Task 04 구조  
C. Task 04에서 수정할 구조  
D. Task 05로 미룰 구조  
E. 문서 충돌 및 수정 필요 사항  
F. 도메인 타입과 데이터 모델 영향  
G. localStorage schemaVersion 및 기존 데이터 영향  
H. route와 stage key 영향  
I. 테스트 수정 범위  
J. 사용자 결정이 추가로 필요한 사항  

## 반드시 구체적으로 확인할 항목

- 기존 `ThinkingStage` 8단계 정의 위치와 모든 참조 위치
- Thinking Case 생성 시 CaseStep 개수와 생성 로직
- 첫 Workspace 경로와 stage key
- Practice fixture가 8단계에 종속되는지
- 기존 localStorage 데이터 호환 여부
- schemaVersion 변경 필요 여부
- 마이그레이션, 초기화, 호환 처리 중 권장안
- 자유 작성/구조화 선택 상태를 Task 04 도메인 타입에 포함해야 하는지
- Task 04에서는 선택 상태를 영구 저장하지 않고 UI 상태로만 표현할 수 있는지
- Task 04 Shell 구현 범위와 Task 05 실제 입력 기능의 경계
- 수정 예상 파일 목록
- 기존 테스트 중 수정·추가해야 할 항목
- `docs/codex_handoff/`가 이번 Task 04 코드 커밋에 포함되어야 하는지 별도 문서 커밋으로 분리해야 하는지

## 금지 사항

- 파일 수정 금지
- `git add`, `commit`, `push` 금지
- Task 05 기능 구현 금지
- 문서 충돌을 임의로 해결하지 말 것
