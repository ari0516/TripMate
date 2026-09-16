# Design System

첨부한 레퍼런스 이미지의 디자인 방향을 참고해서 전체 여행 앱 UI를 구현한다.

핵심 디자인 키워드:
- Liquid Glass UI
- Soft Pastel
- Lavender
- Purple
- Mint / Cyan
- Pink Accent
- Soft Gradient
- Frosted Glass
- Modern Travel App
- Clean & Premium
- Light and airy

단, 단순히 모든 컴포넌트에 Glass 효과를 적용하지 말고
레이어별로 Glass 효과의 강도를 다르게 사용한다.

---

## Main Colors

| 이름 | 값 |
|---|---|
| Primary | #8B5CF6 |
| Primary Light | #A78BFA |
| Primary Soft | #EDE9FE |
| Secondary | #67D9D5 |
| Secondary Soft | #D9F7F5 |
| Accent Pink | #F3A6C1 |
| Accent Blue | #91CFF5 |
| Background | #F7F3FA |
| Surface | #FFFFFF |

---

## Text Colors

| 이름 | 값 |
|---|---|
| Text Primary | #292533 |
| Text Secondary | #625D6D |
| Text Tertiary | #918B9C |
| Text Disabled | #B8B3C0 |
| Text On Primary | #FFFFFF |

검정색(#000000)은 가급적 사용하지 않고 부드러운 Dark Purple/Gray 계열을 사용한다.

---

## Semantic Colors

| 이름 | 값 |
|---|---|
| Success | #35C99A |
| Warning | #F4B860 |
| Error | #E8798F |
| Info | #72B7E8 |
| Neutral | #8E8999 |

**여행 앱 운영 상태 매핑**
- 영업중 → Success `#35C99A`
- 영업시간 외 → Warning `#F4B860`
- 휴무 → Error `#E8798F`
- 운영시간 정보 없음 → Neutral `#8E8999`

**예산 상태 매핑**
- 0~79% → 기본 상태
- 80~89% → Warning
- 90% 이상 → Error

---

## Glass UI

Glass surface 기본값:

```css
--glass-white: rgba(255,255,255,0.45);
--glass-white-strong: rgba(255,255,255,0.65);
--glass-white-soft: rgba(255,255,255,0.28);
--glass-border: rgba(255,255,255,0.55);
--glass-border-soft: rgba(255,255,255,0.35);
--glass-blur: blur(20px);
```

Glass Card shadow:
```css
box-shadow: 0 8px 32px rgba(80,60,120,0.10);
```

내부 상단 highlight:
```css
box-shadow: inset 0 1px 0 rgba(255,255,255,0.65);
```

**Glass 강도는 레이어별로 다르게 적용한다.**
- 일반 콘텐츠 카드 → 약한 Glass (`glass-white-soft`)
- 주요 Floating Card → 중간 정도 Glass (`glass-white`)
- Navigation / Modal → 강한 Glass (`glass-white-strong`)

Glass 효과는 과도하게 사용하지 않는다.

---

## Background

앱 전체 배경은 단색보다 매우 은은한 pastel gradient를 사용한다.
Lavender, Cyan, Pink가 자연스럽게 섞이도록 한다.

```css
background:
  radial-gradient(
    circle at 10% 10%,
    rgba(167,139,250,0.18),
    transparent 35%
  ),
  radial-gradient(
    circle at 90% 20%,
    rgba(103,217,213,0.14),
    transparent 35%
  ),
  radial-gradient(
    circle at 70% 90%,
    rgba(243,166,193,0.16),
    transparent 35%
  ),
  #F7F3FA;
```

배경의 색감은 눈에 피로하지 않을 정도로 매우 은은하게 사용한다.

---

## Typography

한국어 UI이므로 Pretendard를 우선 사용한다.

```css
font-family:
  "Pretendard",
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;
```

| 스타일 | 크기 / 굵기 |
|---|---|
| Display | 32px / 700 |
| H1 | 28px / 700 |
| H2 | 22px / 700 |
| H3 | 18px / 600 |
| Body Large | 16px / 500 |
| Body | 14px / 400~500 |
| Caption | 12px / 400 |
| Button | 14px / 600 |
| Large Number | 24px / 700 |

제목은 굵고 명확하게, 본문은 가볍고 여유 있게 표현한다.

---

## UI Style

- Border radius: 14~20px
- Button radius: 14~18px
- Input radius: 14px
- Card radius: 18~24px
- 충분한 whitespace
- 얇고 밝은 border
- 부드러운 shadow
- subtle gradient
- rounded icon
- line icon
- 과도한 색상 사용 금지
- 과도한 blur 사용 금지

**Primary Button** — Purple 중심의 gradient:
```css
background: linear-gradient(135deg, #8B5CF6, #A78BFA);
```

**Secondary Button** — Mint/Cyan 계열:
```css
background: linear-gradient(135deg, #67D9D5, #91CFF5);
```

---

## Travel App Mood

전체적인 앱의 인상은 "여행 계획을 세우는 즐겁고 가벼운 느낌"이어야 한다.

너무 금융 앱처럼 딱딱하거나 관리자 대시보드처럼 보이지 않도록 한다.

- 카드와 버튼은 둥글고 부드럽게
- 정보는 명확하고 깔끔하게
- 색상은 Lavender + Purple을 중심으로 Mint/Cyan/Pink를 보조적으로 사용

여행 사진이나 장소 정보가 들어가는 영역에서는 사진 위에 반투명 Glass Overlay를 사용할 수 있다.
단, MVP에서는 실제 이미지가 없는 경우 gradient와 glass surface를 활용해도 된다.

---

## 참고 사항 (스택)

- 배포: Vercel
- 데이터베이스/백엔드: Supabase
- MVP 단계에서는 Mock Data로 먼저 구현 → 이후 Supabase 스키마로 이관
