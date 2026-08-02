# 11. Codex ↔ ChatGPT Handoff Guide

## A. ChatGPT에서 Codex로 옮기는 방법

### 최초 이동

1. 이 패키지를 저장소 루트에 복사한다.
2. 원본 참고자료는 저장소에 직접 커밋하지 않아도 된다.
3. 참고자료가 필요하면 로컬의 `docs/references/`에 배치하고 `.gitignore` 처리한다.
4. `AGENTS.md`를 루트에 둔다.
5. `09_CODEX_MASTER_PROMPT.md`를 Codex에 입력한다.
6. Task 00 또는 현재 상태에 맞는 Task 하나만 지정한다.

### Codex에 넣을 짧은 시작 프롬프트

```text
저장소의 AGENTS.md와 docs 문서를 모두 읽어주세요.
docs/10_CODEX_TASKS.md의 Task 00만 수행합니다.
먼저 현재 상태와 구현 계획을 설명하고, 이후 구현·테스트·상태 문서 갱신까지 완료해주세요.
다른 Task는 구현하지 마세요.
```

## B. Codex 작업을 ChatGPT로 가져오는 방법

가장 안전한 방법은 GitHub 저장소를 연결하고, 변경 내용을 커밋한 뒤 ChatGPT에 저장소·브랜치·커밋 또는 PR을 알려주는 것이다.

### 권장 방식 1 — GitHub

1. Codex에서 작업 완료
2. `git status`
3. 테스트 실행
4. 커밋
5. 원격 저장소 push
6. ChatGPT에 다음 정보 제공
   - 저장소 이름
   - 브랜치
   - 커밋 SHA 또는 PR 번호
   - 검토할 목적
   - 특별히 고민되는 파일

예시:

```text
Thinking Flow 저장소의 feature/workspace 브랜치에서
commit abc123까지 Task 04를 구현했어.

다음 관점으로 검토해줘.
1. PRD와 UX 명세 충족 여부
2. 데이터 버전 보존 여부
3. 컴포넌트 구조
4. 누락된 예외 처리

특히 src/features/workspace와
docs/IMPLEMENTATION_STATUS.md를 확인해줘.
```

ChatGPT가 GitHub 연결을 사용할 수 있는 환경에서는 저장소를 검색하고 파일을 읽을 수 있다.

### 권장 방식 2 — 변경 파일 업로드

GitHub 연결을 사용하지 않을 경우 다음을 업로드한다.

- 변경한 소스 파일
- `git diff` 결과
- `package.json`
- 관련 테스트
- 오류 로그
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/DECISION_LOG.md`

폴더 전체가 필요하면 zip으로 압축한다. `node_modules`, `.next`, 환경변수, 비밀키는 제외한다.

### 권장 zip 명령

```bash
git archive --format=zip --output=thinking-flow-review.zip HEAD
```

작업 트리의 미커밋 변경도 포함하려면 운영체제의 압축 기능을 사용하되 다음은 제외한다.

```text
node_modules/
.next/
.env*
coverage/
dist/
```

## C. ChatGPT에 제공할 역방향 Handoff Prompt

```text
첨부한 파일은 Codex에서 구현한 Thinking Flow 프로젝트야.

기준 문서:
- AGENTS.md
- docs/02_PRODUCT_CORE.md
- docs/03_LEAN_PRD.md
- docs/05_GUIDED_FLOW_SPEC.md
- docs/08_DATA_MODEL.md

현재 완료 Task:
[Task 번호와 이름]

검토 목적:
[버그 수정 / PRD 정합성 / UX 개선 / 다음 Task 설계]

반드시 다음 순서로 검토해줘.
1. 구현 상태 요약
2. 요구사항 대비 누락
3. 데이터·상태 관리 문제
4. UI/UX 문제
5. 테스트 부족
6. 수정 우선순위
7. Codex에 다시 보낼 구체적인 수정 프롬프트

확인되지 않은 파일 내용은 추측하지 말고,
필요한 파일이 빠졌으면 먼저 알려줘.
```

## D. 대화를 오갈 때 반드시 유지할 파일

- `AGENTS.md`
- `docs/DECISION_LOG.md`
- `docs/IMPLEMENTATION_STATUS.md`
- 핵심 PRD 문서
- 변경된 데이터 모델
- 최신 Task 문서

채팅 기록만으로 상태를 전달하지 않는다. 저장소 문서를 단일 진실 공급원으로 사용한다.

## E. 민감정보 주의

절대 업로드하거나 커밋하지 않는다.

- `.env`
- API key
- Supabase service role key
- 개인 데이터
- 실제 고객 데이터
- 회사 내부 기밀
