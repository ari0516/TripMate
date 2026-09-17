"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/common/StatusBadge";
import { PlacePhotoStrip } from "@/components/place/PlacePhotoStrip";
import { PLACE_CATEGORY_EMOJI } from "@/lib/constants";
import { getCurrentOpenStatus } from "@/lib/opening-hours";
import type { Place } from "@/lib/types";

interface PlaceCardProps {
  place: Place;
  tripId: string;
  onAddToSchedule: (placeId: string) => void;
}

export function PlaceCard({ place, tripId, onAddToSchedule }: PlaceCardProps) {
  const status = getCurrentOpenStatus(place);

  return (
    <article className="glass-soft rounded-[18px] p-4">
      <div className="flex items-start gap-3">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-white/70 text-[18px]"
          aria-hidden
        >
          {PLACE_CATEGORY_EMOJI[place.category]}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/trips/${tripId}/places/${place.id}`}
            className="block truncate text-[16px] font-bold text-[#292533] hover:underline hover:underline-offset-4"
          >
            {place.name}
          </Link>
          <p className="mt-0.5 text-[12px] text-[#918b9c]">
            {place.category} · {place.address}
          </p>
          <div className="mt-2">
            <StatusBadge status={status} showHours />
          </div>
        </div>
      </div>

      {place.photos && place.photos.length > 0 ? (
        <div className="mt-3.5">
          <PlacePhotoStrip photos={place.photos} size={72} />
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/60 pt-3.5">
        {/* URL 이 없으면 버튼 자체를 렌더링하지 않는다 (01-feature-spec.md §6) */}
        {place.mapUrl ? (
          <a
            href={place.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[12px] font-medium text-[#625d6d] transition hover:bg-white/90"
          >
            🗺 지도에서 보기
          </a>
        ) : null}
        {place.blogUrl ? (
          <a
            href={place.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[12px] font-medium text-[#625d6d] transition hover:bg-white/90"
          >
            📝 블로그 보기
          </a>
        ) : null}

        <button
          type="button"
          onClick={() => onAddToSchedule(place.id)}
          className="ml-auto cursor-pointer rounded-full bg-[linear-gradient(135deg,#8b5cf6,#a78bfa)] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(139,92,246,0.25)] transition hover:brightness-105"
        >
          일정에 추가
        </button>
      </div>
    </article>
  );
}
