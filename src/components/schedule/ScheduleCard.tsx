"use client";

import { StatusBadge } from "@/components/common/StatusBadge";
import { PLACE_CATEGORY_EMOJI } from "@/lib/constants";
import { getOpenStatus } from "@/lib/opening-hours";
import type { Place, Schedule } from "@/lib/types";

interface ScheduleCardProps {
  schedule: Schedule;
  place: Place | undefined;
  onClick: () => void;
}

export function ScheduleCard({ schedule, place, onClick }: ScheduleCardProps) {
  const status = place
    ? getOpenStatus(place, schedule.date, schedule.startTime)
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-soft flex w-full cursor-pointer items-stretch gap-3.5 rounded-[18px] p-4 text-left transition hover:bg-white/60 hover:shadow-[0_8px_24px_rgba(80,60,120,0.1)]"
    >
      <div className="flex w-[52px] shrink-0 flex-col items-start">
        <span className="text-[15px] font-bold text-[#292533]">
          {schedule.startTime}
        </span>
        <span className="text-[11px] text-[#918b9c]">{schedule.endTime}</span>
      </div>

      <div className="w-px shrink-0 bg-[linear-gradient(180deg,rgba(139,92,246,0.35),rgba(103,217,213,0.25))]" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span aria-hidden>
            {place ? PLACE_CATEGORY_EMOJI[place.category] : "❔"}
          </span>
          <h4 className="truncate text-[15px] font-semibold text-[#292533]">
            {place?.name ?? "삭제된 장소"}
          </h4>
        </div>
        <p className="mt-0.5 text-[12px] text-[#918b9c]">
          {place?.category ?? "정보 없음"}
          {place?.address ? ` · ${place.address}` : ""}
        </p>
        {status ? (
          <div className="mt-2">
            <StatusBadge status={status} showHours />
          </div>
        ) : null}
      </div>

      <span className="self-center text-[#c9c4d2]" aria-hidden>
        ›
      </span>
    </button>
  );
}
