import type {
  BudgetStatus,
  Country,
  CurrencyCode,
  DayKey,
  DocumentCategory,
  ExpenseCategory,
  OpenStatus,
  PlaceCategory,
} from "./types";

export const PLACE_CATEGORIES: PlaceCategory[] = [
  "맛집",
  "카페",
  "관광지",
  "쇼핑",
  "숙소",
  "기타",
];

export const PLACE_CATEGORY_EMOJI: Record<PlaceCategory, string> = {
  맛집: "🍜",
  카페: "☕",
  관광지: "📍",
  쇼핑: "🛍",
  숙소: "🛏",
  기타: "✨",
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "식비",
  "교통",
  "쇼핑",
  "관광",
  "숙박",
  "기타",
];

export const EXPENSE_CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  식비: "🍜",
  교통: "🚃",
  쇼핑: "🛍",
  관광: "🎡",
  숙박: "🛏",
  기타: "✨",
};

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  "티켓",
  "쿠폰",
  "서류",
  "기타",
];

export const DOCUMENT_CATEGORY_EMOJI: Record<DocumentCategory, string> = {
  티켓: "🎫",
  쿠폰: "🏷",
  서류: "📄",
  기타: "✨",
};

export const COUNTRIES: Country[] = [
  "대한민국",
  "일본",
  "태국",
  "베트남",
  "대만",
  "홍콩",
  "싱가포르",
  "필리핀",
  "중국",
  "미국",
  "영국",
  "유럽",
];

export const COUNTRY_INFO: Record<
  Country,
  { emoji: string; currency: CurrencyCode }
> = {
  대한민국: { emoji: "🇰🇷", currency: "KRW" },
  일본: { emoji: "🇯🇵", currency: "JPY" },
  태국: { emoji: "🇹🇭", currency: "THB" },
  베트남: { emoji: "🇻🇳", currency: "VND" },
  대만: { emoji: "🇹🇼", currency: "TWD" },
  홍콩: { emoji: "🇭🇰", currency: "HKD" },
  싱가포르: { emoji: "🇸🇬", currency: "SGD" },
  필리핀: { emoji: "🇵🇭", currency: "PHP" },
  중국: { emoji: "🇨🇳", currency: "CNY" },
  미국: { emoji: "🇺🇸", currency: "USD" },
  영국: { emoji: "🇬🇧", currency: "GBP" },
  유럽: { emoji: "🇪🇺", currency: "EUR" },
};

export const CURRENCY_STYLE: Record<
  CurrencyCode,
  { symbol: string; position: "prefix" | "suffix" }
> = {
  KRW: { symbol: "원", position: "suffix" },
  JPY: { symbol: "¥", position: "prefix" },
  THB: { symbol: "฿", position: "prefix" },
  VND: { symbol: "₫", position: "suffix" },
  TWD: { symbol: "NT$", position: "prefix" },
  HKD: { symbol: "HK$", position: "prefix" },
  SGD: { symbol: "S$", position: "prefix" },
  PHP: { symbol: "₱", position: "prefix" },
  CNY: { symbol: "¥", position: "prefix" },
  USD: { symbol: "$", position: "prefix" },
  GBP: { symbol: "£", position: "prefix" },
  EUR: { symbol: "€", position: "prefix" },
};

export const DAY_KEYS: DayKey[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const DAY_LABEL: Record<DayKey, string> = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

/** 03-design-system.md 운영 상태 매핑 */
export const OPEN_STATUS_STYLE: Record<
  OpenStatus,
  { dot: string; text: string; chip: string }
> = {
  open: {
    dot: "bg-[#35c99a]",
    text: "text-[#1f8f6c]",
    chip: "bg-[#35c99a]/12 border-[#35c99a]/30",
  },
  closed: {
    dot: "bg-[#f4b860]",
    text: "text-[#b07a22]",
    chip: "bg-[#f4b860]/14 border-[#f4b860]/35",
  },
  dayoff: {
    dot: "bg-[#e8798f]",
    text: "text-[#c2506a]",
    chip: "bg-[#e8798f]/12 border-[#e8798f]/30",
  },
  unknown: {
    dot: "bg-[#8e8999]",
    text: "text-[#6e697a]",
    chip: "bg-[#8e8999]/12 border-[#8e8999]/28",
  },
};

/** 03-design-system.md 예산 상태 매핑 (0~79 기본 / 80~89 주의 / 90+ 경고) */
export const BUDGET_STATUS_STYLE: Record<
  BudgetStatus,
  { bar: string; text: string; chip: string; label: string | null }
> = {
  normal: {
    bar: "bg-[linear-gradient(135deg,#8b5cf6,#a78bfa)]",
    text: "text-[#6d3fd4]",
    chip: "bg-[#8b5cf6]/10 border-[#8b5cf6]/25",
    label: null,
  },
  warning: {
    bar: "bg-[#f4b860]",
    text: "text-[#b07a22]",
    chip: "bg-[#f4b860]/14 border-[#f4b860]/35",
    label: "주의",
  },
  danger: {
    bar: "bg-[#e8798f]",
    text: "text-[#c2506a]",
    chip: "bg-[#e8798f]/12 border-[#e8798f]/30",
    label: "경고",
  },
};
