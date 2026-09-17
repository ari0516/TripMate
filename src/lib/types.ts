/**
 * TripMate 도메인 타입
 * 01-feature-spec.md §7 / 02-wireframe.md §17 데이터 구조 기준
 * MVP 단계에서는 mock data + localStorage 로 동작하며,
 * 이후 Supabase 스키마로 그대로 이관할 수 있도록 형태를 맞춘다.
 */

export type PlaceCategory = "맛집" | "카페" | "관광지" | "쇼핑" | "숙소" | "기타";

/** 여행 국가 — 일일 예산·지출 통화를 결정한다 */
export type Country =
  | "대한민국"
  | "일본"
  | "태국"
  | "베트남"
  | "대만"
  | "홍콩"
  | "싱가포르"
  | "필리핀"
  | "중국"
  | "미국"
  | "영국"
  | "유럽";

export type CurrencyCode =
  | "KRW"
  | "JPY"
  | "THB"
  | "VND"
  | "TWD"
  | "HKD"
  | "SGD"
  | "PHP"
  | "CNY"
  | "USD"
  | "GBP"
  | "EUR";

export type ExpenseCategory = "식비" | "교통" | "쇼핑" | "관광" | "숙박" | "기타";

/** 요일 키 — openingHours / closedDays 에서 공통으로 사용 */
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** ["09:00", "18:00"] 형태. 해당 요일 영업 정보가 없으면 null */
export type OpeningHourRange = [string, string];

export type OpeningHours = Partial<Record<DayKey, OpeningHourRange | null>>;

export interface Trip {
  id: string;
  name: string;
  /** 예산·지출 통화를 결정한다 */
  country: Country;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  dailyBudget: number;
  /** 카드 상단 장식용 이모지 (선택) */
  emoji?: string;
}

export interface Place {
  id: string;
  tripId: string;
  name: string;
  category: PlaceCategory;
  address: string;
  openingHours: OpeningHours;
  /** 휴무 요일 목록 */
  closedDays: DayKey[];
  mapUrl?: string;
  blogUrl?: string;
  /** Google Places 사진 리소스 이름 목록 (장소 검색으로 자동 입력했을 때 채워짐) */
  photos?: string[];
}

export interface Schedule {
  id: string;
  tripId: string;
  placeId: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  startTime: string;
  /** HH:mm */
  endTime: string;
  memo?: string;
}

/** Phase 2 (가계부)에서 사용. 데이터 구조는 미리 정의해 둔다. */
export interface Expense {
  id: string;
  tripId: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  memo?: string;
}

/** 장소 운영 상태 */
export type OpenStatus = "open" | "closed" | "dayoff" | "unknown";

export interface OpenStatusResult {
  status: OpenStatus;
  /** 배지에 표시할 짧은 라벨 */
  label: string;
  /** 경고 메시지 (정상 영업이면 null) */
  warning: string | null;
  /** 해당 날짜의 영업시간 문자열 (예: "06:00 ~ 17:00") */
  hoursText: string | null;
}

/** 예산 사용률 상태 — 01-feature-spec.md §5-2 기준 (0~79 기본 / 80~89 주의 / 90+ 경고) */
export type BudgetStatus = "normal" | "warning" | "danger";

export interface BudgetSummary {
  budget: number;
  spent: number;
  remaining: number;
  /** 사용률(%), 예산 초과 시 100을 넘을 수 있다 */
  ratio: number;
  status: BudgetStatus;
}
