# Thinking Flow V2 Thinking Data System

## 1. 목적

Thinking Data System은 최종 문장만 저장하지 않고 사용자의 최초 생각, 근거, 수정과 판단 변화를 시간 순서로 보존한다. 분석과 포트폴리오는 이 원본을 참조하며 원본을 덮어쓰지 않는다.

## 2. 현재 구현과 V2 후보

| 영역 | 현재 V1 구현 | V2 설계 후보 |
| --- | --- | --- |
| Case/Step | 10개 Stage의 `ThinkingCase`와 `CaseStep` | 템플릿 버전, 완료 근거, 시간 데이터 확장 |
| 작성 방식 | `WritingMode` 타입과 로컬 UI 선택 | Step별 선택값 영구 저장 |
| 응답 | 도메인 타입 일부 존재, Workspace 입력 미연결 | 자유 작성과 질문별 `FieldResponse` |
| 버전 | append-only `ResponseVersion` 저장 계약 | 의미 있는 변경, checkpoint, 작성 주체 연결 |
| AI | `locked`/`ready` UI 상태 | 상호작용과 채택·거절 기록 |
| 분석 | 미구현 | 사용자에게 설명 가능한 metric |
| 포트폴리오 | 기존 후보 타입, V2 흐름 미구현 | 원본 응답과 파생 섹션 연결 |

## 3. 저장할 사고 데이터 후보

- Case와 Stage의 시작·마지막 작성·완료 시점
- 최초 자유 작성 초안과 이후 버전
- 구조화 질문별 응답과 질문 템플릿 버전
- 활성 `WritingMode`와 양쪽 mode의 보존된 응답
- 선택한 프레임워크와 적용 메모
- 주장과 근거·출처 연결
- 단계별 판단과 불확실성
- AI 질문·피드백, 사용자의 채택·부분 채택·거절과 이유
- 수정 전후, 수정 이유와 checkpoint
- 회고, 사고 원칙, 다음 Case에 재사용할 교훈

## 4. 초안·응답·버전

### 최초 초안

첫 저장 내용은 이후 수정되어도 식별 가능해야 한다. “현재 내용” 조회를 빠르게 제공하더라도 최초 버전과 과거 버전은 삭제하지 않는다.

### `FieldResponse` 저장 단위

- 자유 작성은 Stage마다 하나의 안정된 `fieldKey`와 `FieldResponse`로 저장한다.
- 구조화 입력은 질문별 안정된 `fieldKey`와 `FieldResponse`로 분리한다.
- 두 mode의 응답은 동시에 존재할 수 있다.
- mode 전환은 데이터를 삭제하거나 통합하지 않는다.
- 현재 활성 `WritingMode | null`은 `CaseStep`에 저장한다.

Context 단계의 key는 `context.freeform`, `context.goal`, `context.current_situation`, `context.stakeholders`, `context.constraints_success`을 사용한다.

### `ResponseVersion`

append-only가 원칙이다. 매 key 입력마다 버전을 만드는 것은 이력 과다와 성능 문제를 만들 수 있으므로 다음 이벤트를 구분한다.

- 작업 중 현재 초안 저장
- debounce 또는 blur에 의한 안정화 저장
- 사용자가 의미 있는 상태로 남기는 checkpoint
- AI 피드백 적용 전후
- 단계 완료 시점

첫 Context vertical slice는 명시적 초안 저장만 제공한다. 한 번의 저장에서 화면의 모든 dirty field와 현재 WritingMode를 원자적으로 기록하고, 직전 content와 실제로 다른 field에만 `ResponseVersion`을 append한다. autosave와 별도 checkpoint는 후속 범위다.

## 5. AI feedback과 사용자 판단

AI 출력은 사용자 작성과 별도 주체로 저장한다. 사용자 결정 후보:

- `accepted`: 피드백을 채택
- `partially_accepted`: 일부만 채택
- `rejected`: 채택하지 않음
- `deferred`: 나중에 검토

상태명, 이유 필수 여부, 실제 텍스트 반영과의 연결은 Open Decision이다. 거절은 실패가 아니라 사용자의 판단 근거다.

## 6. Checkpoint 후보

checkpoint는 사용자가 “이 상태를 의미 있게 보존한다”고 표시하는 이력 경계다.

- AI 점검 요청 전
- AI 피드백 반영 후
- 단계 완료 시
- 사용자가 직접 이름을 붙인 시점

자동 저장과 checkpoint는 같은 개념으로 취급하지 않는다.

## 7. 성장 분석 데이터 후보

아래는 V2 설계 후보이지 확정 metric이 아니다.

- 단계별 작성량과 작성 시간
- 의미 있는 수정 횟수와 최초·최종 변화
- AI 호출 및 채택·거절 비율
- 근거·출처가 연결된 주장 비율
- 가설 생성·변경·기각 횟수
- 완료까지 걸린 시간과 중단 지점
- 반복 누락한 사고 요소
- 강점·취약 Stage의 변화
- Case 간 완료·수정 패턴
- 자유 작성·구조화 입력 사용 비율

“글이 길수록 좋다”, “AI를 적게 쓸수록 좋다”처럼 단순 점수화하지 않는다. metric 정의에는 교육적 의미, 설명 가능성, 조작 가능성 검토가 필요하다.

## 8. Case 간 비교

- 동일 Stage와 동일 템플릿 버전끼리 비교 가능한 범위를 표시한다.
- Case 난이도·유형 차이를 무시한 순위화를 피한다.
- 사용자 개인의 시간에 따른 변화와 절대 평가를 구분한다.
- 비교 결과에서 원본 응답과 해당 버전으로 이동할 수 있어야 한다.

## 9. 개인정보와 데이터 소유권 후보 원칙

- 사용자가 작성한 사고 기록은 사용자가 조회·내보내기·삭제 정책을 이해할 수 있어야 한다.
- AI 학습 활용 여부는 저장 동의와 별도로 명시되어야 한다.
- 기업 Case나 자유 주제에 민감 정보 입력을 피하도록 안내한다.
- 공개 포트폴리오에는 원본의 비공개 정보가 자동 포함되지 않아야 한다.
- metric과 AI 피드백에는 생성 근거와 한계를 설명한다.

실제 보존 기간, 계정 삭제, export format은 인증·서버 저장 도입 전 별도 결정한다.

## 10. 저장 버전

- 현재 코드: `schemaVersion: 2`.
- V2 제품의 첫 저장 모델: `thinking-flow:v2:repository`와 `schemaVersion: 3`.
- V2라는 제품 이름 때문에 현재 데이터를 자동으로 version 3으로 바꾸지 않는다.
- migration 선택지는 `12_V2_MIGRATION_PLAN.md`에서 비교한다.

## 11. Open Decision

- 현재 초안 저장과 append-only 버전의 역할 분리
- 후속 자동 저장 시점과 충돌 처리
- checkpoint 생성 주체와 이름
- AI 피드백 결정 상태와 수정본 연결 방식
- metric 정의, 최소 수집 범위, 보존 기간, export
- 템플릿 버전이 바뀐 Case의 비교 정책
