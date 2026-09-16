"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { formatDayLabel, formatMonthDay } from "@/lib/date";

interface DateTabsProps {
  dates: string[];
  selectedDate: string;
  onSelect: (date: string) => void;
  /** 날짜별 일정 개수 — 점 표시에 사용 */
  countByDate: Record<string, number>;
}

/** 여행 날짜를 가로 탭으로 표시한다 (02-wireframe.md §7) */
export function DateTabs({
  dates,
  selectedDate,
  onSelect,
  countByDate,
}: DateTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // 선택된 날짜가 화면 밖이면 스크롤로 보이게 한다.
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedDate]);

  const index = dates.indexOf(selectedDate);

  function move(delta: number) {
    const next = dates[index + delta];
    if (next) onSelect(next);
  }

  return (
    <div className="glass-base rounded-[20px] p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={index <= 0}
          aria-label="이전 날짜"
          className="grid size-8 cursor-pointer place-items-center rounded-full text-[#625d6d] transition hover:bg-white/70 disabled:opacity-30"
        >
          ‹
        </button>
        <span className="text-[13px] font-semibold text-[#625d6d]">
          {dates.length > 0
            ? `${formatMonthDay(dates[0])} ~ ${formatMonthDay(dates[dates.length - 1])}`
            : "-"}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={index < 0 || index >= dates.length - 1}
          aria-label="다음 날짜"
          className="grid size-8 cursor-pointer place-items-center rounded-full text-[#625d6d] transition hover:bg-white/70 disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div
        ref={listRef}
        role="tablist"
        aria-label="여행 날짜"
        className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5"
      >
        {dates.map((date, i) => {
          const active = date === selectedDate;
          const count = countByDate[date] ?? 0;
          return (
            <button
              key={date}
              ref={active ? activeRef : undefined}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "flex w-[62px] shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-[14px] border py-2.5 transition",
                active
                  ? "border-transparent bg-[linear-gradient(135deg,#8b5cf6,#a78bfa)] text-white shadow-[0_6px_16px_rgba(139,92,246,0.28)]"
                  : "border-white/60 bg-white/50 text-[#625d6d] hover:bg-white/80",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  active ? "text-white/80" : "text-[#918b9c]",
                )}
              >
                DAY {i + 1}
              </span>
              <span className="text-[14px] font-bold">
                {formatMonthDay(date)}
              </span>
              <span
                className={cn(
                  "text-[10px]",
                  active ? "text-white/80" : "text-[#918b9c]",
                )}
              >
                {formatDayLabel(date)}
              </span>
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 size-1.5 rounded-full",
                  count > 0
                    ? active
                      ? "bg-white"
                      : "bg-[#8b5cf6]"
                    : active
                      ? "bg-white/35"
                      : "bg-[#d8d3e0]",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
