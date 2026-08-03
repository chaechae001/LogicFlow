# Thinking Flow V2 Data Model

## 1. 문서 원칙

이 문서는 **현재 구현 모델**과 **V2 후보 모델**을 구분한다. 후보 엔티티나 필드는 구현 완료를 뜻하지 않는다. 정확한 Zod schema와 migration은 vertical slice에서 결정·테스트한다.

## 2. 버전 구분

- 제품: Thinking Flow V1 / Thinking Flow V2
- 현재 localStorage: `schemaVersion: 2`
- V2 저장 모델: `thinking-flow:v2:repository` key와 `schemaVersion: 3`

V2 제품 문서 작성만으로 schemaVersion을 올리거나 기존 데이터를 변환하지 않는다.

## 3. 현재 구현 요약

- 10개 `ThinkingStage` key와 순서
- `PracticeCase`, `ThinkingCase`, 10개 `CaseStep`
- `WritingMode = "freeform" | "structured"` 도메인 개념
- `FieldResponse`, `ResponseVersion` 등 기존 타입·Zod schema
- `ThinkingCaseRepository`를 통한 Case 생성·조회·목록과 append-only 응답 버전 저장
- localStorage `schemaVersion: 2` 문서와 명시적 reset
- Workspace의 실제 FieldResponse 입력·WritingMode 저장은 미구현

현재 정확한 계약은 source code가 기준이며, V2 후보 문서가 이를 소급 변경하지 않는다.

## 4. V2 엔티티 후보

| 엔티티 | 책임 | 상태 |
| --- | --- | --- |
| `User` | 소유권, 설정, 공개 정책 | 후보, 로그인 미구현 |
| `PracticeCase` | 훈련 상황과 metadata | 현재 기반 확장 후보 |
| `ThinkingCase` | 사용자가 시작한 사고 Case | 현재 기반 확장 후보 |
| `CaseStep` | Case의 Stage 인스턴스, 상태와 `writingMode: WritingMode | 현재 기반 확장 |
| `StageTemplate` | Stage 학습 콘텐츠의 버전 | 신규 후보 |
| `StructuredQuestion` | 안정된 질문 key와 field type | 신규 후보 |
| `FieldResponse` | Stage·field별 현재 응답 식별 | 현재 타입 재검토 |
| `ResponseVersion` | append-only 응답 snapshot | 현재 계약 확장 후보 |
| `AiCoachInteraction` | 요청 맥락과 AI 피드백 | 신규 후보 |
| `FeedbackDecision` | 채택·부분 채택·거절 판단 | 신규 후보 |
| `Checkpoint` | 의미 있는 Case/Step 상태 경계 | 신규 후보 |
| `ThinkingMetric` | 계산식·기간·원본이 있는 분석 결과 | 신규 후보 |
| `PortfolioArtifact` | Case 또는 다수 Case 파생 결과물 | 후보 재설계 |
| `PortfolioSection` | 원본 버전과 연결된 파생 섹션 | 신규 후보 |
| `SourceReference` | 근거의 URL·문헌·사용자 자료 상태 | 신규 후보 |

## 5. 관계 후보

```text
User
 ├─ ThinkingCase*
 ├─ PortfolioArtifact*
 └─ user settings

PracticeCase 1 ── * ThinkingCase
ThinkingCase 1 ── 10 CaseStep
CaseStep * ── 1 StageTemplate(version)
StageTemplate 1 ── * StructuredQuestion
CaseStep 1 ── * FieldResponse
FieldResponse 1 ── * ResponseVersion
CaseStep 1 ── * AiCoachInteraction
AiCoachInteraction 1 ── * FeedbackDecision
ThinkingCase 1 ── * Checkpoint
ThinkingCase 1 ── * ThinkingMetric
PortfolioArtifact 1 ── * PortfolioSection
PortfolioSection * ── * ResponseVersion
FieldResponse/ResponseVersion * ── * SourceReference
```

다대다 관계의 실제 구현 방식은 저장소 선택 후 결정한다.

## 6. ID 규칙 후보

- 모든 저장 엔티티는 충돌 가능성이 낮고 클라이언트 생성 가능한 불투명 ID를 사용한다.
- Stage와 질문의 의미 식별자는 ID와 별도로 안정된 key를 가진다.
- 템플릿 수정은 기존 key의 의미를 바꾸기보다 template version을 올린다.
- ID에 사용자 정보나 시간 의미를 노출하지 않는다.

UUID/ULID 선택은 Open Decision이다.

## 7. Stage key

```text
context
observation
problem_definition
problem_structuring
hypothesis
evidence_validation
decision
solution_execution
result_evaluation
conclusion_reflection
```

순서와 key는 V2 공통 기준이며 변경하려면 V2 Decision Log와 migration 검토가 필요하다.

## 8. WritingMode

`type WritingMode = "freeform" | "structured";`

- CaseStep의 현재 활성 mode이며 새 Step은 `null`
- `both` 값 없음
- 양쪽 응답의 동시 존재 허용
- mode 전환 시 데이터 삭제 없음

`writingMode`는 `CaseStep`에 저장한다.

## 9. fieldKey 후보

- 자유 작성: Stage마다 하나의 `<stage>.freeform` key
- 구조화 질문: 질문마다 하나의 안정 key
- 시스템 필드는 사용자 질문 key와 namespace를 분리
- 표시 문구가 바뀌어도 fieldKey는 유지
- template version과 함께 해석

Context는 `context.goal`, `context.current_situation`, `context.stakeholders`, `context.constraints_success`을 사용한다.

## 10. contentJson 후보

초기에는 텍스트 중심이지만 출처, 선택, 목록 같은 field를 수용할 수 있도록 discriminated payload를 검토한다.

```json
{ "type": "text", "text": "..." }
{ "type": "choice", "optionKeys": ["..."] }
{ "type": "source-list", "sourceIds": ["..."] }
```

무제한 JSON은 검증과 migration을 어렵게 하므로 각 `type`을 Zod union으로 검증한다. 첫 vertical slice에서 text만 구현할 수 있다.

## 11. Versioning 후보

- `FieldResponse`는 field의 안정된 identity와 현재 version 참조를 담당할 수 있다.
- `ResponseVersion`은 append-only content snapshot, 생성 시점, 작성 주체와 변경 이유 후보를 가진다.
- 동일 content 중복 버전 방지 규칙이 필요하다.
- autosave draft와 checkpoint version의 의미를 분리한다.
- AI 적용 전후 버전 연결을 검토한다.
- 템플릿이 바뀌어도 과거 응답은 당시 question/template version으로 해석한다.

## 12. schemaVersion과 migration

V2는 `thinking-flow:v2:repository`와 `schemaVersion: 3`을 사용한다. V1 `thinking-flow:repository`의 version 2 데이터를 읽거나 수정하거나 자동 migration하지 않는다.

## 13. Repository 계약 후보

현재 계약을 교체한다고 확정하지 않고 다음 capability를 후보로 검토한다.

- Case와 Step 조회
- StageTemplate/version 조회
- FieldResponse 현재값·버전 조회
- 명시적 draft 저장
- append-only version/checkpoint 생성
- WritingMode 저장
- AI interaction과 feedback decision 기록
- source 연결
- metric 계산 원본 조회
- portfolio artifact와 source link 저장
- V2 local data reset/export

UI는 localStorage나 향후 Supabase를 직접 호출하지 않는다.

## 14. Open Decision

- contentJson 첫 지원 type과 Zod union
- draft와 immutable version을 한 엔티티로 둘지 분리할지
- checkpoint의 snapshot 범위
- source와 claim의 관계
- 후속 엔티티가 추가될 때 schemaVersion 3 내부 구조를 어떻게 확장할지
- localStorage와 향후 서버 Repository 간 동시성·충돌 계약
- User 도입 전 로컬 소유권 표현
