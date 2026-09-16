import type { Expense, OpeningHours, Place, Schedule, Trip } from "./types";

/** 모든 요일에 동일한 영업시간을 적용하는 헬퍼 */
function everyday(open: string, close: string): OpeningHours {
  return {
    mon: [open, close],
    tue: [open, close],
    wed: [open, close],
    thu: [open, close],
    fri: [open, close],
    sat: [open, close],
    sun: [open, close],
  };
}

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    name: "도쿄 여행",
    startDate: "2026-10-12",
    endDate: "2026-10-16",
    dailyBudget: 100000,
    emoji: "🇯🇵",
  },
  {
    id: "trip-2",
    name: "방콕 여행",
    startDate: "2026-11-01",
    endDate: "2026-11-05",
    dailyBudget: 80000,
    emoji: "🇹🇭",
  },
];

export const mockPlaces: Place[] = [
  {
    id: "place-1",
    name: "센소지",
    category: "관광지",
    address: "일본 도쿄도 다이토구 아사쿠사",
    openingHours: everyday("06:00", "17:00"),
    closedDays: [],
    mapUrl: "https://maps.google.com/?q=Sensoji",
    blogUrl: "https://blog.naver.com/",
  },
  {
    id: "place-2",
    name: "멘야무사시",
    category: "맛집",
    address: "일본 도쿄도 신주쿠구",
    openingHours: everyday("11:00", "22:00"),
    closedDays: [],
    mapUrl: "https://maps.google.com/?q=Menya+Musashi",
  },
  {
    id: "place-3",
    name: "Blue Bottle Coffee 시부야",
    category: "카페",
    address: "일본 도쿄도 시부야구",
    openingHours: everyday("08:00", "14:00"),
    closedDays: ["wed"],
    mapUrl: "https://maps.google.com/?q=Blue+Bottle+Shibuya",
    blogUrl: "https://blog.naver.com/",
  },
  {
    id: "place-4",
    name: "긴자 식스",
    category: "쇼핑",
    address: "일본 도쿄도 주오구 긴자",
    openingHours: everyday("10:30", "20:30"),
    closedDays: [],
    mapUrl: "https://maps.google.com/?q=Ginza+Six",
  },
  {
    id: "place-5",
    name: "시부야 스카이",
    category: "관광지",
    address: "일본 도쿄도 시부야구 시부야 스크램블 스퀘어",
    openingHours: everyday("10:00", "22:30"),
    closedDays: [],
  },
  {
    id: "place-6",
    name: "호텔 그레이서리 신주쿠",
    category: "숙소",
    address: "일본 도쿄도 신주쿠구 가부키초",
    openingHours: {},
    closedDays: [],
  },
];

export const mockSchedules: Schedule[] = [
  {
    id: "sch-1",
    tripId: "trip-1",
    placeId: "place-1",
    date: "2026-10-12",
    startTime: "10:00",
    endTime: "11:30",
  },
  {
    id: "sch-2",
    tripId: "trip-1",
    placeId: "place-2",
    date: "2026-10-12",
    startTime: "12:30",
    endTime: "13:30",
  },
  {
    id: "sch-3",
    tripId: "trip-1",
    placeId: "place-3",
    date: "2026-10-12",
    startTime: "15:00",
    endTime: "16:00",
  },
  {
    id: "sch-4",
    tripId: "trip-1",
    placeId: "place-5",
    date: "2026-10-13",
    startTime: "09:30",
    endTime: "11:00",
  },
  {
    id: "sch-5",
    tripId: "trip-1",
    placeId: "place-4",
    date: "2026-10-13",
    startTime: "13:00",
    endTime: "15:00",
  },
];

/** Phase 2 (가계부)에서 사용할 초기 데이터 */
export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    tripId: "trip-1",
    date: "2026-10-12",
    amount: 18000,
    category: "식비",
    memo: "점심 라멘",
  },
  {
    id: "exp-2",
    tripId: "trip-1",
    date: "2026-10-12",
    amount: 5000,
    category: "교통",
    memo: "지하철",
  },
  {
    id: "exp-3",
    tripId: "trip-1",
    date: "2026-10-12",
    amount: 49000,
    category: "쇼핑",
    memo: "기념품",
  },
];
