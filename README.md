# Thinking Flow

사용자가 자신의 생각을 먼저 꺼내고, 문제 정의–구조화–가설–검증–의사결정–실행의 과정을 반복 훈련하도록 돕는 웹 기반 학습 서비스입니다. AI는 사용자의 첫 작성 이후에만 질문·반례·논리 공백 점검을 제공합니다.

현재 저장소는 `Task 00 — Repository Bootstrap`까지 구성되어 있습니다. 제품 기능과 도메인 모델은 후속 Task에서 문서 순서대로 구현합니다.

## 기술 구성

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- ESLint 9
- Vitest 4

## 요구 환경

- Node.js 20.9 이상
- npm 11 권장

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

Windows PowerShell의 실행 정책 때문에 `npm.ps1` 실행이 차단된 경우 다음처럼 `npm.cmd`를 사용할 수 있습니다.

```powershell
npm.cmd install
npm.cmd run dev
```

## 개발용 로컬 데이터 초기화

현재 localStorage는 `schemaVersion: 2`를 사용하며 기존 version 1 데이터를 자동 변환하지 않습니다. Case 시작 화면에서 version 불일치 또는 현재 구조와 맞지 않는 저장 데이터가 감지되면 데이터 삭제 안내와 함께 `기존 로컬 데이터 초기화` 버튼을 제공합니다. 사용자가 직접 누르기 전에는 기존 데이터를 변경하지 않습니다.

개발자 도구에서 직접 초기화해야 할 때는 Console에서 다음 명령을 실행한 뒤 페이지를 새로고침합니다.

```js
window.localStorage.removeItem("thinking-flow:repository");
```

코드에서는 `LocalStorageRepository.resetLocalData()`를 명시적으로 호출해 빈 version 2 문서로 초기화할 수 있습니다. 어느 방식도 자동으로 실행되지 않으며, 초기화 전 기존 데이터는 덮어쓰지 않습니다.

## 품질 검사

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 기본 구조

```text
thinking-flow/
├─ docs/                  # 제품·UX·데이터·Task 명세
├─ public/                # 정적 파일
├─ src/
│  ├─ app/                # Next.js App Router
│  ├─ components/         # 공용 UI 컴포넌트
│  ├─ domain/             # 도메인 타입과 규칙 (Task 01부터)
│  ├─ features/           # 기능 단위 모듈
│  ├─ lib/                # 프레임워크 독립 유틸리티
│  ├─ repositories/       # 저장소 인터페이스와 구현 (Task 02부터)
│  └─ test/               # 공용 테스트 지원 코드
├─ AGENTS.md              # 개발 원칙
└─ package.json
```

구현 순서와 범위는 [`docs/10_CODEX_TASKS.md`](docs/10_CODEX_TASKS.md)를 따릅니다. 확인되지 않은 올리브영 내부 정보는 사실로 표현하지 않으며, 원본 참고자료와 환경변수는 커밋하지 않습니다.
