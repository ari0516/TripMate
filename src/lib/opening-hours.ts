import { getDayKey, timeToMinutes } from "./date";
import type { OpenStatusResult, Place } from "./types";

/**
 * 장소의 openingHours / closedDays 를 기준으로
 * 특정 날짜·시간의 방문 가능 여부를 판단한다.
 * 02-wireframe.md §13 / 01-feature-spec.md §4 기준.
 *
 * @param place 대상 장소
 * @param dateStr YYYY-MM-DD
 * @param timeStr HH:mm — 생략하면 해당 요일의 영업 정보만 판단한다.
 */
export function getOpenStatus(
  place: Place,
  dateStr: string,
  timeStr?: string,
): OpenStatusResult {
  const dayKey = getDayKey(dateStr);

  // 1. 휴무일 우선 판단
  if (place.closedDays?.includes(dayKey)) {
    return {
      status: "dayoff",
      label: "휴무",
      warning: "해당 날짜는 휴무일입니다.",
      hoursText: null,
    };
  }

  // 2. 영업시간 정보 확인
  const range = place.openingHours?.[dayKey];
  if (!range || !range[0] || !range[1]) {
    return {
      status: "unknown",
      label: "영업시간 정보 없음",
      warning: "운영시간 정보를 확인할 수 없습니다.",
      hoursText: null,
    };
  }

  const openMin = timeToMinutes(range[0]);
  const closeMin = timeToMinutes(range[1]);
  const hoursText = `${range[0]} ~ ${range[1]}`;

  if (openMin === null || closeMin === null) {
    return {
      status: "unknown",
      label: "영업시간 정보 없음",
      warning: "운영시간 정보를 확인할 수 없습니다.",
      hoursText: null,
    };
  }

  // 3. 시간 미지정이면 영업시간 표시만 한다.
  if (!timeStr) {
    return { status: "open", label: "영업중", warning: null, hoursText };
  }

  const target = timeToMinutes(timeStr);
  if (target === null) {
    return {
      status: "unknown",
      label: "영업시간 정보 없음",
      warning: "운영시간 정보를 확인할 수 없습니다.",
      hoursText,
    };
  }

  // 자정을 넘기는 영업시간 (예: 18:00 ~ 02:00) 지원
  const isOvernight = closeMin <= openMin;
  const isOpen = isOvernight
    ? target >= openMin || target < closeMin
    : target >= openMin && target < closeMin;

  if (isOpen) {
    return { status: "open", label: "영업중", warning: null, hoursText };
  }

  return {
    status: "closed",
    label: "영업시간 외",
    warning: "해당 시간은 영업시간이 아닙니다.",
    hoursText,
  };
}

/** 현재 시각 기준 상태 — 장소 목록/상세의 "지금 영업중" 표시에 사용 */
export function getCurrentOpenStatus(place: Place): OpenStatusResult {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return getOpenStatus(place, dateStr, timeStr);
}
