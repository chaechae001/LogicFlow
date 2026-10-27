# Logic Flow — 디자인 변경 이력 (CHANGELOG)

> 앞으로 디자인/구조를 바꿀 때마다 여기에 기록하고, 직전 상태를 `versions/<버전>/` 폴더에
> 스냅샷으로 남깁니다. 기존 `mockups/`는 **현재 최신 작업본**이고, 과거 버전은 `versions/`에서
> 브라우저로 바로 열어 비교할 수 있습니다.

## 버전 열어보는 법
- 최신 작업본: `mockups/index.html`
- 과거 버전: `versions/<버전>/index.html` (예: `versions/v2_pre-warmgray/index.html`)
- Windows에서 탐색기로 해당 html을 더블클릭하면 브라우저로 열립니다.

---

## 버전 목록

### v2 — 청회색 · 스틸블루 (웜그레이 전환 직전)
- 폴더: `versions/v2_pre-warmgray/`
- 지면: 밝은 청회색 `#F6F7F9` · 주색: 스틸블루 `#2A5A87` · 주의: 테라코타 `#B05A3C`
- 서체: Bricolage Grotesque(디스플레이) + IBM Plex Sans KR(본문) + IBM Plex Mono(라벨)
- 서비스명: Think Flow
- 비고: **원본 v2 `app.css`는 백업이 없어 소실됨.** `index.html`에 남아 있던 색 스와치 값으로
  `app.css`를 재구성한 **근사 복원본**입니다. HTML 마크업(landing·start·library·portfolio·index)은
  당시 원본 그대로라 색감·레이아웃 확인에는 충분합니다.
  (workspace·community는 v3에서 새로 쓴 화면이라 이 폴더에선 v2 색만 입혀진 상태)

### v3 — 웜그레이 · 딥블루 (현재 mockups의 직전 스냅샷)
- 폴더: `versions/v3_warmgray/`
- 지면: 웜그레이 `#F6F4F1` · 주색: 딥블루 `#23456E` · 주의: 테라코타 `#A85D3E`
- 서체: Pretendard(본문) + IBM Plex Mono(라벨)
- 서비스명: Logic Flow
- 추가: Interactive Prompt(하이라이트→확장 질문), 다크모드 토글, 커뮤니티 화면, 10단계 인포그래픽
- 피드백: **전반적으로 색이 너무 어둡고 무겁다. v2의 밝은 톤이 더 낫다.**

---

## v4 — 워크스페이스 재설계 후보 (검토 중)
- 폴더: `candidates/` (허브: `candidates/index.html`)
- 공통 기반: 색 = v2 청회색·스틸블루 / 서체 = Pretendard(v3) / 커뮤니티 네비 포함
- 반영한 요청: 제목·소제목 축소(소제목 1줄) · 자유작성 우선 · 좌중우 sticky · 좌측 라벨 굵기 ·
  예시/코치/저장소에 **도식화 연습장** 추가 · 좌우 패널 토글 · 사고 흐름 항상 표시 · 예시는 토글(기본 숨김)
- 두 후보:
  - `candidates/A_v2refined/` — v2 구조 정제. 10단계 질문 카드 + 단계별 인포그래픽 유지.
  - `candidates/B_outline/` — 안3 구조 아웃라인. 좌측 아웃라인이 사고 뼈대, 노드 단위 작성.
- 두 후보의 차이는 워크스페이스에 집중. 나머지 페이지는 공통.
- 다음: 사용자 비교 후 방향(또는 A·B 조합) 확정 → 확정본을 `mockups/`로 승격.

### v4.1 — 노션 1차 수정 (후보 A, `candidates/A_v2refined/`)
노션 "LogicFlow_UI 수정사항" 15개 반영:
- 브랜드명 `LogicFlow`, 로고 아이콘을 나뭇가지·잎 모티프로
- 상단 진행바를 잎이 자라는 나무 바로 (완료=초록잎, 현재=강조)
- stepicon 정사각 고정(flex 상속 버그 수정) · zone-r 상단 여백 제거(rtabs top:0)
- 다크/라이트 전 페이지 공통 적용(theme.js) · 스크롤바 얇게
- 좌·우 패널 구분선 드래그 리사이즈 · 접기 버튼을 우측 상단 −/+ 로
- 메뉴 "결과물"→"포트폴리오" · 작업 화면 상단바 2줄(공통 네비 + 케이스바)
- 작업 화면 하단 여백 축소 · 템플릿 블록 숨김 · 사고 흐름 10단계 블럭화
- 훈련 시작: 주제→단계 순서 교체 · "이어서 작업하기" 카드 · 상단 설명 폭 확대
- 브라우저 도구가 localhost 차단으로 렌더 검증은 미완 — 사용자 로컬 확인 필요
