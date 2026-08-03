# Thinking Flow V2 Development Roadmap

## 1. 원칙

- V2는 화면 층만 한꺼번에 만들지 않고 사용자가 끝까지 확인할 수 있는 vertical slice로 개발한다.
- 각 Task는 문서 결정, 도메인·Repository, UI, 테스트, 브라우저 검수를 함께 닫는다.
- 현재 V1 코드를 재사용하되 V2 계약과 충돌하면 교체 대상으로 기록한다.
- 이 문서는 계획이며 Task 시작 전 Open Decision을 확정한 별도 실행 명세가 필요하다.

## 2. 순서 요약

| Task | 결과 |
| --- | --- |
| V2-00 | V2 문서·기준 승인 |
| V2-01 | 콘텐츠를 수용하는 V2 Workspace 기본 구조 |
| V2-02 | `context` 학습 콘텐츠, 실제 입력과 명시적 저장·복원 |
| V2-03 | Context vertical slice 검수와 10단계 확장 준비 |
| V2-04 | 자동 저장과 version/checkpoint |
| V2-05 | 검증된 입력 패턴을 10단계로 확장 |
| V2-06 | 실제 완료 조건과 Soft Gate |
| V2-07 | 사용자 입력 기반 AI Coach |
| V2-08 | Thinking Analysis |
| V2-09 | Portfolio Builder |
| V2-10 | Export·공개 |

## 3. Task 상세

### V2-00 — 문서·기준 정렬

- **목적**: V2 제품, Stage 콘텐츠, 데이터와 migration의 기준을 승인한다.
- **선행 조건**: V1 백업 branch/tag.
- **포함**: `docs/v2/` 검토, Open Decision 해소 우선순위, V1 문서 archive 계획.
- **제외**: 코드·schema 수정.
- **예상 수정 파일**: `docs/v2/*.md`, 승인 후 필요한 index 문서.
- **테스트**: 문서 link·Stage key·용어 일관성 검사.
- **완료 조건**: 구현에 필요한 첫 slice 결정과 문서 우선순위 승인.
- **브라우저 검수**: 없음.
- **Git 단위**: V2 설계 문서 전용 commit.

### V2-01 — V2 Workspace 기본 구조

- **목적**: 단계별 학습 콘텐츠와 입력 상태를 수용할 화면 계약을 만든다.
- **선행 조건**: V2-00, 학습 콘텐츠 노출 방식 결정.
- **포함**: 3열 Shell 재사용, StageTemplate 표시 영역, 예시·도움말, mode 영역, AI panel slot.
- **제외**: 입력 영구 저장, 실제 AI, 완료 계산.
- **예상 수정 파일**: `src/features/workspace/*`, Stage 콘텐츠 adapter/fixture, 관련 route와 tests.
- **테스트**: 10단계 콘텐츠 render, keyboard/focus, responsive 기본 상태.
- **완료 조건**: 임의 Stage 콘텐츠가 중복 하드코딩 없이 3열에 표시됨.
- **브라우저 검수**: desktop/mobile 후보 layout, 콘텐츠 구분, 10단계 이동.
- **Git 단위**: Workspace 콘텐츠 architecture 한 commit.

### V2-02 — Context 단계 학습 콘텐츠와 입력

- **목적**: 하나의 Stage에서 자유 작성·구조화 입력 경험을 끝까지 검증한다.
- **선행 조건**: V2-01, `context` 질문·필수 후보 승인, fieldKey 결정.
- **포함**: `context` 설명·예시, 자유 작성 textarea, 구조화 질문 4개, mode 전환 시 양쪽 data 보존, V2 schemaVersion 3 명시적 초안 저장과 복원.
- **제외**: autosave, AI, 실제 완료 판정, 나머지 9단계 입력.
- **예상 수정 파일**: StageTemplate domain/fixture, input components, `workspace-shell`, tests.
- **테스트**: 미선택·두 mode, 전환 후 내용 유지, label/focus, 예시가 입력값으로 삽입되지 않음.
- **완료 조건**: 사용자가 한 session에서 양쪽 방식으로 작성하고 전환해도 내용이 유지됨.
- **브라우저 검수**: 입력, mode 전환, 새로고침 시 아직 보존되지 않는 범위 안내.
- **Git 단위**: `context` input slice 한 commit.

### V2-03 — Context 검수와 10단계 확장 준비

- **목적**: Context의 입력·저장·복원·version 계약을 브라우저에서 검증하고 나머지 Stage 확장 기준을 고정한다.
- **선행 조건**: V2-02 완료.
- **포함**: mode 전환, 양쪽 응답, 새로고침 복원, 중복 version 방지와 V2 오류 복구 검수.
- **제외**: 새로운 제품 기능, autosave, AI, 완료.
- **예상 수정 파일**: domain schemas, Repository interface/adapter, storage schema, workspace inputs, tests.
- **테스트**: schema validation, 양쪽 mode 동시 보존, 새로고침·단계 이동 복원, 오류 분류.
- **완료 조건**: UI가 저장소를 직접 호출하지 않고 `context` 상태가 안정적으로 복원됨.
- **브라우저 검수**: 저장 후 reload, mode 이동, 손상 데이터 recovery 범위.
- **Git 단위**: explicit persistence 한 commit.

### V2-04 — 자동 저장과 버전 이력

- **목적**: 작업 중 손실을 줄이면서 의미 있는 이력을 보존한다.
- **선행 조건**: V2-03, debounce·중복·checkpoint 규칙 승인.
- **포함**: debounce/blur 후보 autosave, 저장 상태, 중복 version 방지, append-only ResponseVersion, checkpoint·version 조회 최소 UI.
- **제외**: AI, 완료 계산, 고급 diff.
- **예상 수정 파일**: save service/hooks, Repository version methods, storage schema, version UI, tests.
- **테스트**: fake timer debounce, 같은 content 중복 방지, 실패·재시도, 순서와 append-only.
- **완료 조건**: 마지막 저장 상태와 과거 의미 있는 버전이 설명 가능하게 공존.
- **브라우저 검수**: 타이핑–저장 상태–reload–version 확인–오류 복구.
- **Git 단위**: autosave/version 한 commit, 범위가 크면 저장과 조회를 분리.

### V2-05 — 10단계 입력 확장

- **목적**: `context`에서 검증한 입력·저장 패턴을 정확한 10단계 템플릿에 적용한다.
- **선행 조건**: V2-04, 10단계 질문과 fieldKey 승인.
- **포함**: 각 Stage 설명·예시·질문, 응답 저장·복원, 프레임워크 선택 후보.
- **제외**: AI, 분석, 포트폴리오, 자동 완료.
- **예상 수정 파일**: Stage template fixtures/schemas, workspace renderer, repository tests, integration tests.
- **테스트**: 모든 Stage 질문 key 고유성, 각 Stage 양 mode, 이동·reload·version.
- **완료 조건**: 10단계 모두 동일 계약으로 작성·저장·복원되고 Case 간 응답이 격리됨.
- **브라우저 검수**: 10단계 sample 입력, 뒤로 이동, reload, mode 전환.
- **Git 단위**: 콘텐츠와 renderer를 한 Task로 하되 Stage 묶음별 commit 분할 검토.

### V2-06 — 단계 완료와 Soft Gate 고도화

- **목적**: 이동과 완료를 분리한 채 실제 누락 항목과 사용자 완료를 관리한다.
- **선행 조건**: V2-05, 필수 질문과 완료 정책 승인.
- **포함**: 완료 후보 계산, 사용자 완료 action, 실제 incomplete items, 수정 후 완료 상태 정책, checkpoint 연결.
- **제외**: AI가 완료 판정, 강제 이동 차단.
- **예상 수정 파일**: completion policy/service, CaseStep schema/repository, Soft Gate UI, tests.
- **테스트**: 미완료 이동, 경고 후 이동, 완료 action, 수정 후 상태, 10단계 진행 표시.
- **완료 조건**: 완료 이유가 설명 가능하고 이동만으로 완료되지 않음.
- **브라우저 검수**: 빈 Stage 이동, 일부 작성 이동, 완료·재수정.
- **Git 단위**: completion/Soft Gate 한 commit.

### V2-07 — AI Coach

- **목적**: 사용자가 작성한 내용에만 점검 질문을 제공하고 판단 이력을 남긴다.
- **선행 조건**: V2-05 이상, `ready` 기준, AI 계약·개인정보 정책.
- **포함**: payload adapter, 사용자 요청, locked/ready, feedback render, 채택·거절, interaction 저장. 실제 provider는 별도 adapter로 격리.
- **제외**: 작성 전 답안, 자동 완성, AI 완료 판정, RAG.
- **예상 수정 파일**: AI domain/contracts/adapters, API route 후보, coach UI, repository, tests.
- **테스트**: 작성 전 호출 차단, payload source, provider error, feedback decision append, prompt contract.
- **완료 조건**: 사용자 원문·AI 출력·사용자 판단이 분리되어 추적됨.
- **브라우저 검수**: locked→ready→요청→채택/거절→reload.
- **Git 단위**: mock/contract와 provider integration 분리 권장.

### V2-08 — Thinking Analysis

- **목적**: 사용자의 반복 사고 패턴을 설명 가능한 metric과 원본 link로 보여준다.
- **선행 조건**: 충분한 version/checkpoint 데이터, metric 정의 검증.
- **포함**: 최소 metric set, 계산 근거, Case/Stage drill-down, 데이터 부족 상태.
- **제외**: 근거 없는 역량 점수, 사용자 간 순위.
- **예상 수정 파일**: analytics domain/service, repository query, analysis routes/components, tests.
- **테스트**: 계산 fixture, 누락 데이터, 템플릿 버전 차이, 원본 link.
- **완료 조건**: 모든 표시 metric이 계산식과 원본으로 설명됨.
- **브라우저 검수**: 데이터 없음/한 Case/여러 Case, drill-down.
- **Git 단위**: metric별 작은 vertical slice 권장.

### V2-09 — Portfolio Builder

- **목적**: Case 기록을 원본 연결이 유지된 편집 가능한 포트폴리오로 변환한다.
- **선행 조건**: V2-05, 결과 상태·공개 정책, source link 모델.
- **포함**: Case portfolio 생성, section mapping, 사용자 수정, stale 표시, 원본 이동.
- **제외**: 다수 Case 역량 포트폴리오와 공개 URL은 첫 slice에서 제외 가능.
- **예상 수정 파일**: portfolio domain/repository, transformation service, builder routes/components, tests.
- **테스트**: 원본 없는 주장 방지, source version 연결, 수정 분리, stale 상태.
- **완료 조건**: 파생 섹션에서 사용한 원본 버전으로 돌아갈 수 있음.
- **브라우저 검수**: 생성–편집–원본 변경–stale–재검토.
- **Git 단위**: Case portfolio 한 commit, 확장 유형 별도.

### V2-10 — Export·공개

- **목적**: 사용자가 검토한 결과를 안전하게 내보내거나 공유한다.
- **선행 조건**: V2-09, 공개 기본값·민감 정보·export format 결정.
- **포함**: preview, 공개 범위 확인, export, 공유 철회 후보.
- **제외**: 협업·마켓플레이스·고급 브랜딩.
- **예상 수정 파일**: export service, privacy review UI, public route/storage 후보, tests.
- **테스트**: 비공개 기본, 제외 섹션, link 권한, export content.
- **완료 조건**: 원본 비공개 정보가 동의 없이 공개되지 않음.
- **브라우저 검수**: preview–범위 선택–export/share–철회.
- **Git 단위**: local export와 public sharing 분리 권장.

## 4. Roadmap Open Decision

- V2-01과 V2-02를 하나로 합칠지
- V2-04의 autosave와 version UI를 별도 Task로 나눌지
- V2-05를 2~3개 Stage 묶음으로 나눠 검수할지
- 실제 AI provider를 V2-07에 포함할지 adapter/mock 계약까지만 둘지
- Analysis와 Portfolio 중 어느 사용자 가치부터 검증할지
- 로그인·서버 저장을 어느 Task의 선행 조건으로 둘지
