# TripMate

여행 일정, 장소, 예산을 한 화면에서 관리하는 여행 계획 웹앱.
`docs/` 의 기능정의서·와이어프레임·디자인시스템 문서를 기준으로 구현했습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint
```

## 스택

| 항목 | 선택 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 (`@theme` 토큰) |
| 상태 관리 | Zustand + persist (localStorage) |
| 데이터 | Mock Data (Phase 3에서 Supabase 이관 예정) |

## 폴더 구조

```
src/
├── app/
│   ├── layout.tsx                              # 루트 레이아웃
│   ├── page.tsx                                # 여행 목록
│   └── trips/
│       ├── new/page.tsx                        # 여행 생성
│       └── [tripId]/
│           ├── layout.tsx                      # 사이드바 / 하단 내비 셸
│           ├── page.tsx                        # 여행 대시보드
│           ├── schedule/page.tsx               # 날짜별 일정
│           └── places/
│               ├── page.tsx                    # 장소 목록
│               └── [placeId]/page.tsx          # 장소 상세
├── components/
│   ├── common/    GlassCard · Button · Field · Modal · StatusBadge · EmptyState
│   ├── layout/    TripShell · navigation
│   ├── trip/      TripCard · TripListView · TripCreateForm · TripDashboard
│   ├── schedule/  DateTabs · ScheduleCard · ScheduleFormModal · ScheduleView
│   └── place/     PlaceCard · PlaceFormModal · PlaceListView · PlaceDetailView
├── lib/
│   ├── types.ts          # Trip · Place · Schedule · Expense
│   ├── constants.ts      # 카테고리 · 요일 · 상태 색상 매핑
│   ├── date.ts           # 날짜 범위 생성, 포맷, 시간 파싱
│   ├── opening-hours.ts  # 영업 상태 판정 로직
│   ├── mock-data.ts      # 초기 더미 데이터
│   └── cn.ts
└── store/
    └── useTripStore.ts   # 전역 상태 + localStorage 영속화
```

## Phase 1 구현 범위

- **여행 생성** — 여행명·기간·일별 예산 입력, 검증(필수값 / 시작일 ≤ 종료일 / 예산 ≥ 0), 기간만큼 날짜 자동 생성
- **여행 목록 / 대시보드** — 여행 카드, 일정·장소 요약, 날짜별 일정 미리보기
- **날짜별 일정** — DAY 탭, 시작 시간 오름차순 정렬, 일정 추가 / 수정 / 삭제(일정만 삭제, 장소는 유지)
- **장소 저장** — 카테고리 6종, 요일별 영업시간, 휴무일, 지도·블로그 URL, 카테고리 필터 + 검색
- **운영 상태 표시** — 영업중 / 영업시간 외 / 휴무 / 정보 없음 을 색상 + 텍스트로 함께 표시
- **운영시간 경고** — 일정 추가·수정 시 경고 문구를 띄우되 저장은 항상 가능
- **외부 링크** — URL이 저장된 경우에만 [지도에서 보기] / [블로그 보기] 버튼 노출

### 데이터

`localStorage` 키 `tripmate-store-v1` 에 저장됩니다. 초기 상태로 되돌리려면 브라우저 콘솔에서:

```js
localStorage.removeItem("tripmate-store-v1"); location.reload();
```

## 다음 단계 (Phase 2)

가계부 화면, 지출 등록, 일별 예산 대비 사용률(80% 주의 / 90% 경고) 표시.
`Expense` 타입과 `addExpense` / `removeExpense` 액션, mock 지출 데이터는 이미 스토어에 들어 있어 화면만 추가하면 됩니다.

## 디자인 시스템

`src/app/globals.css` 에 Tailwind `@theme` 토큰과 Glass 레이어 클래스가 정의되어 있습니다.

| 클래스 | 용도 |
|---|---|
| `glass-soft` | 일반 콘텐츠 카드 |
| `glass-base` | 주요 Floating Card |
| `glass-strong` | Navigation · Modal |

폰트는 Pretendard(jsDelivr CDN), 배경은 Lavender/Cyan/Pink 라디얼 그라디언트를 사용합니다.
