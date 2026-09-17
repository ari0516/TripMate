import Link from "next/link";

import { currencyOf, formatMoney } from "@/lib/currency";
import { formatDotDate, getDayCount } from "@/lib/date";
import type { Trip } from "@/lib/types";

interface TripCardProps {
  trip: Trip;
  scheduleCount: number;
  expenseTotal: number;
}

export function TripCard({ trip, scheduleCount, expenseTotal }: TripCardProps) {
  const days = getDayCount(trip.startDate, trip.endDate);
  const currency = currencyOf(trip.country);

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="glass-base group block rounded-[22px] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(80,60,120,0.14)]"
    >
      <div className="flex items-start gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(103,217,213,0.16))] text-[20px]"
          aria-hidden
        >
          {trip.emoji ?? "✈️"}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[17px] font-bold text-[#292533]">
            {trip.name}
          </h3>
          <p className="mt-0.5 text-[13px] text-[#625d6d]">
            {formatDotDate(trip.startDate)} ~ {formatDotDate(trip.endDate)}
          </p>
          <p className="mt-0.5 text-[12px] text-[#918b9c]">
            {days}일 · 일일 예산 {formatMoney(trip.dailyBudget, currency)}
          </p>
        </div>
        <span
          className="mt-1 text-[#b8b3c0] transition group-hover:translate-x-0.5 group-hover:text-[#8b5cf6]"
          aria-hidden
        >
          →
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/60 pt-3.5 text-[12px] text-[#625d6d]">
        <span className="rounded-full bg-white/60 px-2.5 py-1">
          일정 {scheduleCount}개
        </span>
        {expenseTotal > 0 ? (
          <span className="rounded-full bg-white/60 px-2.5 py-1">
            지출 {formatMoney(expenseTotal, currency)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
