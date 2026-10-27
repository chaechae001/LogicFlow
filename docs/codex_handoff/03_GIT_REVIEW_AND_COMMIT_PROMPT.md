> 이전 인수인계 자료입니다. 현재 코드·브랜치·다음 작업은 [최신 인수인계](../HANDOFF.md)를 우선합니다.

# Codex 세 번째 요청 — 검토 후 add·commit·push

Task 04 수정과 사용자 브라우저 검수가 완료되었습니다.

## 1. 먼저 상태 확인

```bash
git status
git diff --stat
git diff
```

변경 파일을 다음으로 분류해주세요.

- Task 04에 필요한 파일
- 문서 갱신 파일
- 자동 생성 또는 우발 변경 파일
- 패키지 참고 파일
- 커밋에서 제외할 파일

## 2. 검증 재실행

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

하나라도 실패하면 add·commit·push를 중단하고 원인을 보고해주세요.

## 3. staging 원칙

- `git add -A`를 사용하지 마세요.
- 승인된 Task 04 관련 파일만 경로를 명시해 staging하세요.
- 자동 생성 파일과 Task와 무관한 파일은 제외하세요.
- staging할 정확한 파일 목록을 먼저 보여주세요.

사용자가 파일 목록을 승인한 뒤에만 `git add <explicit paths>`를 실행하세요.

## 4. staging 후 검토

```bash
git diff --cached --stat
git diff --cached
```

staged diff가 승인 범위와 일치하는지 보고해주세요.

## 5. 커밋

사용자 최종 승인 후 다음 형식의 커밋 메시지를 사용합니다.

```text
feat: revise workspace for ten-stage dual-input thinking flow
```

## 6. push

커밋 결과와 브랜치 상태를 보고한 뒤, 사용자가 push를 승인한 경우에만 push하세요.

## 완료 보고

- 커밋 해시
- 커밋 파일 목록
- 제외한 변경 파일
- 검증 결과
- push 결과
- 다음 Task 시작 전 남은 항목
