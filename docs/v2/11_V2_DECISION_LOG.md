# Thinking Flow V2 Decision Log

이 문서는 V2 결정만 기록한다. V1의 과거 결정은 기존 `docs/DECISION_LOG.md`와 Git history에 남긴다. 상태가 “확정”인 항목만 구현 기준으로 사용하며 Open Decision은 별도 표에서 관리한다.

## 확정 결정

### V2-D001 — V1 기준점 백업 후 V2 설계

- **상태**: 확정
- **결정**: Task 04 완료 commit을 V1 기준점으로 branch와 annotated tag에 보존하고 V2는 별도 branch와 문서 체계에서 설계한다.
- **이유**: V1의 검증된 동작과 V2의 미확정 설계를 혼합하지 않고 rollback 기준을 유지한다.

### V2-D002 — 기존 저장소와 기술 기반 재사용

- **상태**: 확정
- **결정**: Next.js·React·TypeScript·Tailwind, 디자인 톤, Repository, Zod, 테스트 설정, 3열 Shell과 오류 복구 기반을 우선 재사용한다.
- **제약**: V2 계약과 충돌하면 억지로 호환하지 않고 교체·migration 대상으로 명시한다.

### V2-D003 — 10단계 FLOW 유지

- **상태**: 확정
- **결정**: `context`부터 `conclusion_reflection`까지 정확한 10개 key와 순서를 공통 기준으로 사용한다.
- **영향**: CaseStep, 콘텐츠, 입력, AI, 분석, 포트폴리오가 같은 Stage identity를 사용한다.

### V2-D004 — 세 시스템을 하나의 흐름으로 연결

- **상태**: 확정
- **결정**: Thinking Learning System, Thinking Data System, Thinking Portfolio System을 V2 제품의 세 축으로 둔다.

### V2-D005 — 자유 작성과 구조화 입력

- **상태**: 확정
- **결정**: `WritingMode = "freeform" | "structured"`만 사용한다. 한 시점에는 하나를 활성화하고 전환해도 양쪽에 저장된 데이터를 보존한다. `both` 값은 만들지 않는다.

### V2-D006 — 사용자 선작성과 AI 후개입

- **상태**: 확정
- **결정**: 사용자가 먼저 작성하기 전 AI는 `locked`다. 작성 조건 충족 후 `ready`가 되더라도 사용자의 요청으로 점검하며 답안을 대신 완성하지 않는다.

### V2-D007 — 과정 데이터와 버전 보존

- **상태**: 확정
- **결정**: 최초 초안, 수정본, 근거, 판단과 AI 피드백 결정을 보존하고 사용자 응답을 조용히 덮어쓰지 않는다.

### V2-D008 — 포트폴리오의 원본 연결

- **상태**: 확정
- **결정**: 포트폴리오는 파생 artifact이며 원래 사고 기록과 사용한 version으로 돌아갈 수 있어야 한다.

### V2-D009 — V2 문서를 별도 폴더에서 관리

- **상태**: 확정
- **결정**: V2 승인 전 `docs/v2/`에서 설계하고 기존 공식 V1 문서를 유지한다. V1 archive 이동은 승인 후 별도 작업이다.

### V2-D010 — 제품 버전과 저장 schemaVersion 분리

- **상태**: 확정
- **결정**: Thinking Flow V1/V2와 localStorage `schemaVersion`을 별개 개념으로 관리한다.
- **현재**: V1 코드의 `schemaVersion: 2`는 구현 상태다. V2는 별도 key와 `schemaVersion: 3`을 사용하기로 확정했으며 첫 Context slice에서 구현한다.

### V2-D011 — 이동과 완료 분리

- **상태**: 확정
- **결정**: 미완료 Stage도 Soft Gate 후 이동할 수 있고, 이동만으로 완료 처리하지 않는다. AI도 완료를 대신 결정하지 않는다.

### V2-D012 — 자유 작성 우선 권장과 저장 단위

- **상태**: 확정
- **결정**: 짧은 자유 작성 후 구조화 질문으로 보완하는 흐름을 기본 권장하되 구조화 입력으로 바로 시작할 수 있다. 자유 작성은 Stage당 하나, 구조화 입력은 질문당 하나의 `FieldResponse`로 저장하며 `WritingMode | null`은 `CaseStep`에 둔다.

### V2-D013 — V2 전용 저장소

- **상태**: 확정
- **결정**: V2는 `thinking-flow:v2:repository`와 `schemaVersion: 3`을 사용한다. V1 key를 수정·삭제하거나 자동 migration하지 않는다.

### V2-D014 — 명시적 초안 저장과 변경 version

- **상태**: 확정
- **결정**: 첫 Context slice는 화면의 모든 dirty field를 명시적으로 저장한다. 직전 content가 실제로 달라진 field에만 append-only `ResponseVersion`을 만든다. autosave와 별도 checkpoint는 구현하지 않는다.

### V2-D015 — Summary와 Portfolio 분리

- **상태**: 확정
- **결정**: Case Summary/Report는 내부 논리 검토 산출물이고 Portfolio는 외부 설명용 파생 결과물이다. 사용자 원본 없이 역할·성과·수치를 생성하지 않는다.

### V2-D016 — 첫 Context slice에서 AI 제외

- **상태**: 확정
- **결정**: 기존 `locked | ready` 구조는 유지할 수 있으나 첫 Context slice의 일반 상태는 `locked`이며 실제 호출, mock 답변과 provider adapter를 구현하지 않는다.

## Open Decision

| ID | 질문 | 영향 문서 |
| --- | --- | --- |
| V2-O004 | 단계별 필수 질문과 완료 조건은 무엇인가? | 03, 08, 10 |
| V2-O005 | AI `ready` 조건과 전달할 입력 범위는 무엇인가? | 06, 09 |
| V2-O006 | 첫 Thinking Analysis metric과 계산식은 무엇인가? | 01, 05, 10 |
| V2-O007 | Portfolio 생성 최소 조건과 공개 기본값은 무엇인가? | 07, 08, 10 |
| V2-O008 | 로그인·서버 저장을 V2 roadmap 어디에 둘 것인가? | 09, 10, 12 |

## 결정 변경 규칙

- 확정 결정을 바꾸면 기존 항목을 삭제하지 않고 superseded 상태와 대체 결정 ID를 기록한다.
- 코드·schema에 영향을 주는 결정은 migration과 rollback 영향을 함께 기록한다.
- Open Decision을 구현자가 임의로 확정하지 않는다.
