import { DAY_KEYS, DAY_LABEL } from "./constants";
import type { DayKey } from "./types";

/** "2026-10-12" → Date (로컬 타임존 자정, 타임존 밀림 방지) */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Date → "2026-10-12" */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayString(): string {
  return toDateString(new Date());
}

/** 시작일~종료일 사이의 모든 날짜를 YYYY-MM-DD 배열로 반환 */
export function buildDateRange(startDate: string, endDate: string): string[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  if (start > end) return [];

  const dates: string[] = [];
  const cursor = new Date(start);
  // 안전장치: 최대 365일
  while (cursor <= end && dates.length < 365) {
    dates.push(toDateString(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function getDayCount(startDate: string, endDate: string): number {
  return buildDateRange(startDate, endDate).length;
}

/** 해당 날짜의 요일 키 (mon~sun) */
export function getDayKey(dateStr: string): DayKey {
  const jsDay = parseDate(dateStr).getDay(); // 0(일) ~ 6(토)
  return DAY_KEYS[(jsDay + 6) % 7];
}

/** "10/12" */
export function formatMonthDay(dateStr: string): string {
  const d = parseDate(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** "월" */
export function formatDayLabel(dateStr: string): string {
  return DAY_LABEL[getDayKey(dateStr)];
}

/** "2026.10.12" */
export function formatDotDate(dateStr: string): string {
  return dateStr.replaceAll("-", ".");
}

/** "10월 12일 월요일" */
export function formatFullKoreanDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${formatDayLabel(dateStr)}요일`;
}

/** "HH:mm" → 분 단위 정수. 형식이 잘못되면 null */
export function timeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

/** 금액 포맷: 100000 → "100,000" */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}
