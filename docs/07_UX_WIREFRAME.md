# 07. UX and Text Wireframes

## Route Map

```text
/
├─ /practice
├─ /cases/new
├─ /cases/[caseId]/workspace/[stage]
├─ /cases/[caseId]/flow
├─ /cases/[caseId]/report
├─ /cases/[caseId]/portfolio
└─ /cases
```

## Landing

- Hero: 답을 대신 만드는 AI가 아니라 스스로 생각하게 하는 공간
- CTA: 실무 문제로 연습하기
- Secondary CTA: 예시 Case 보기
- Core Loop 시각화
- Report / Portfolio 결과물 예시

## Practice Library

카드 필드:
- 회사/도메인
- 문제 패턴
- 역할
- 난이도
- 예상 시간
- 추천 프레임워크
- 데이터 유무

MVP에는 올리브영 Case 1개만 실제 사용 가능하며 나머지는 Coming Soon.

## Case Start

```text
[Case title]
[Role] [Difficulty] [Time]

Situation
Task
What is known
What is unknown

내 첫 생각
내가 이미 떠올린 해결안
핵심 의사결정 질문

[Case 시작]
```

## Workspace

```text
┌─────────────────────────────────────────────────────────────┐
│ Case title      3/8      Auto-saved                         │
├─────────────┬────────────────────────────┬──────────────────┤
│ Stage Nav   │ Main Workspace             │ AI Coach         │
│             │                            │                  │
│ 1 Fact      │ Learning objective         │ Empty state:     │
│ 2 Problem   │ Guide                      │ 먼저 작성하세요  │
│ 3 Journey   │ Inputs / Cards / Canvas    │                  │
│ 4 Hypothesis│ Version history            │ Feedback         │
│ 5 Validate  │                            │                  │
│ 6 Decide    │                            │                  │
│ 7 Action    │                            │                  │
│ 8 Reflect   │                            │                  │
├─────────────┴────────────────────────────┴──────────────────┤
│ Prev | Save | AI Review | Flow | Complete | Next           │
└─────────────────────────────────────────────────────────────┘
```

## Soft Gate

필수 필드가 부족해도 이동은 가능하다. 경고와 미완성 목록을 보여준다.

## Dependency Warning

앞 단계 변경 시 연결된 가설·검증·대안에 `Needs review` 배지를 표시한다.

## Logic Flow

React Flow 기반.

노드:
- fact
- interpretation
- problem
- journey friction
- hypothesis
- evidence
- validation
- alternative
- decision
- action
- reflection

Edge:
- causes
- supports
- opposes
- validates
- addresses
- derived_from
- selected_over

## Report

1. Case 개요
2. 최초 생각
3. 사실·해석·가설
4. 문제 정의
5. Customer Journey
6. Issue Tree
7. 가설
8. 검증 계획
9. 대안 비교
10. 선택
11. Action Plan
12. SCQA
13. 사고 변화
14. 한계
15. 회고

## Portfolio Preview

사용자가 섹션을 선택하고 순서를 바꾼다. 외부 공개용이므로 AI 상호작용 전체는 기본적으로 숨긴다.
