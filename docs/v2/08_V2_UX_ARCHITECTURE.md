# Thinking Flow V2 UX Architecture

## 1. 전체 사용자 흐름

```text
Landing
→ Practice Library
→ Case Detail
→ Case 시작
→ 10단계 Workspace
→ 단계별 입력·AI 점검·수정
→ Case Summary
→ Thinking Analysis
→ Portfolio Builder
→ Export
```

현재 V1은 Practice Library, Case Detail/시작, 10단계 Workspace Shell까지 구현되어 있다. 실제 입력 이후 흐름은 V2 예정 기능이다.

## 2. 화면별 책임

| 화면 | 핵심 책임 | V2 상태 |
| --- | --- | --- |
| Landing | 제품 원칙과 시작점 안내 | 기존 화면 재검토 |
| Practice Library | Case 탐색·필터·진행 상태 | 기본 구조 재사용, 분류 확장 후보 |
| Case Detail | 문제 상황·전제·난이도 확인 | 기본 구조 재사용, metadata 확장 후보 |
| Case 시작 | 사전 답안 없이 Case 생성 | V1 흐름 유지 |
| Workspace | 학습, 작성, 점검, 이동 | Shell 재사용, 실제 입력 재설계 |
| Case Summary | 10단계 산출물과 미완료·불확실성 검토 | 미구현 |
| Thinking Analysis | 패턴·변화와 원본 연결 | 미구현 |
| Portfolio Builder | 파생 섹션 편집과 원본 확인 | 미구현 |
| Export | 공개 범위 확인과 내보내기 | 미구현 |

## 3. Workspace — 데스크톱

### 왼쪽: 10단계 Flow

- 정확한 Stage 순서와 `n / 10` 진행 위치
- 현재 Stage, 완료·미완료·수정됨 상태 후보
- 이전·다음 이동
- 미완료 이동 시 Soft Gate

### 가운데: 학습과 작성

- 단계 목적, 쉬운 설명, 왜 필요한가
- 좋은 예시·좋지 않은 예시와 자주 하는 실수
- 추천 프레임워크와 도움말
- `freeform | structured` 선택
- 활성 mode 입력과 비활성 mode 내용 보존 안내
- 저장·복원·version/checkpoint 상태

### 오른쪽: AI Coach와 단계 점검

- `locked | ready`
- 사용자 요청 기반 점검
- 피드백, 채택·거절, 원문 위치
- 최소 산출물과 자기 점검
- AI가 완료를 결정하지 않는 안내

## 4. Stage 화면 상태 후보

- 로딩
- 정상/미작성
- 작성 중/저장 전
- 저장 중
- 저장 완료
- 저장 실패/재시도
- AI locked
- AI ready
- AI 요청 중/응답/실패
- 완료 후보 충족/미충족
- 과거 버전 보기

현재 V1의 “저장 시각” 표시는 실제 단계 입력 저장과 연결되지 않았으므로 V2 구현 때 의미를 재정의해야 한다.

## 5. WritingMode UX

- 처음에는 미선택 상태를 허용할 수 있다.
- 화면은 짧은 자유 작성을 권장하고 이후 구조화 질문으로 빠진 요소를 보완하는 흐름을 안내한다. 사용자는 처음부터 구조화 입력을 선택할 수도 있다.
- 선택 후 한 번에 하나의 작성 UI만 활성화한다.
- mode를 전환해도 양쪽 데이터가 보존됨을 전환 위치에서 알린다.
- `both` mode는 없다.
- 비활성 mode에 저장된 내용이 있으면 존재 여부를 보여주는 후보를 검토한다.
- mode의 영구 저장과 복원은 V2 입력 slice에서 구현한다.
- 첫 입력 slice는 명시적 “초안 저장”만 제공하며 autosave는 후속 범위다.

## 6. Soft Gate

- 이동과 완료는 별개다.
- 미완료 이동 시 일반 경고 또는 실제 누락 항목을 보여준다.
- 사용자는 “계속 이동”할 수 있다.
- 이동만으로 완료 처리하지 않는다.
- 실제 필수 항목과 완료 판정이 정해지기 전에는 구체적 누락 계산을 확정하지 않는다.

## 7. 저장 오류와 초기화

V1의 Repository 기반 복구를 유지한다.

- 지원하지 않는 storage version과 손상된 현재 version을 구분한다.
- UI에서 localStorage를 직접 조작하지 않는다.
- 사용자의 명시적 동의 없이 자동 삭제하지 않는다.
- 초기화 대상과 손실 범위를 경고한다.
- 복구 가능한 오류는 사용자 UI에서 처리하고 개발 오류 overlay로 중복 노출하지 않는다.
- V2 저장 key 분리 시 V1과 V2 중 어느 데이터를 초기화하는지 명확히 표시한다.

## 8. Case Summary·Analysis·Portfolio

- Case Summary는 원본 10단계의 현재 버전과 미완료·불확실성을 검토한다.
- Analysis는 metric 카드에서 해당 원본 Stage와 계산 근거로 이동하게 한다.
- Portfolio Builder는 파생 섹션과 원본 버전을 나란히 확인할 수 있어야 한다.
- Export 직전 결과 상태, 공개 범위, 민감 정보와 출처를 확인한다.
- Case Summary/Report는 내부 검토 화면이고 Portfolio Builder는 외부 설명용 파생 결과물을 편집하는 별도 화면이다.

첫 Context 입력 slice에서는 AI Coach를 `locked`로 유지하고 실제 호출, mock 응답과 provider adapter를 구현하지 않는다.

## 9. 반응형 후보

### 데스크톱

3열을 기본으로 하되 가운데 작성 영역을 가장 넓게 둔다. 왼쪽·오른쪽 panel 접기와 keyboard focus 순서를 제공한다.

### 모바일

- 상단 Stage selector와 `n / 10`
- 본문 탭 후보: “학습·작성” / “AI 점검”
- 예시·프레임워크는 accordion
- 이전·다음과 저장 상태를 화면 하단에서 접근
- Soft Gate dialog의 focus trap과 복귀 위치 보장

모바일 IA는 사용자 검증 전 후보이며 데스크톱 3열을 그대로 축소하지 않는다.

## 10. 접근성 기준

- 모든 입력에 label과 오류 연결
- mode와 Stage 선택 상태를 색상 외 텍스트·ARIA로 표시
- keyboard 이동과 명확한 focus state
- dialog focus 관리와 Escape 정책
- 저장·AI 상태를 필요 시 live region으로 알림
- 예시와 사용자 작성, AI 피드백의 시각·의미 구분

## 11. Open Decision

- 학습 콘텐츠를 항상 노출할지 접을지
- mode 미선택 상태를 새 Stage마다 유지할지 최근 선택을 제안할지
- 저장 상태와 version UI의 정보 밀도
- 완료 버튼 위치와 완료 후보 조건
- 모바일의 tab/accordion 구조
- Analysis와 Portfolio를 Workspace 안에서 연결할지 별도 화면으로 둘지
- export format과 공개 흐름
