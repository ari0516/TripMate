"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/Modal";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PlaceFormModal } from "@/components/place/PlaceFormModal";
import { ScheduleFormModal } from "@/components/schedule/ScheduleFormModal";
import { ButtonLink } from "@/components/common/Button";
import { DAY_KEYS, DAY_LABEL, PLACE_CATEGORY_EMOJI } from "@/lib/constants";
import { buildDateRange } from "@/lib/date";
import { getCurrentOpenStatus } from "@/lib/opening-hours";
import { useHydrated, useTripStore } from "@/store/useTripStore";

interface PlaceDetailViewProps {
  tripId: string;
  placeId: string;
}

export function PlaceDetailView({ tripId, placeId }: PlaceDetailViewProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const place = useTripStore((state) =>
    state.places.find((p) => p.id === placeId),
  );
  const removePlace = useTripStore((state) => state.removePlace);

  const [editOpen, setEditOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dates = useMemo(
    () => (trip ? buildDateRange(trip.startDate, trip.endDate) : []),
    [trip],
  );

  if (!hydrated) {
    return (
      <div className="glass-soft h-[420px] animate-pulse rounded-[20px]" aria-hidden />
    );
  }

  if (!place) {
    return (
      <EmptyState
        icon="📍"
        title="장소를 찾을 수 없어요"
        description="삭제되었거나 존재하지 않는 장소입니다."
        action={
          <ButtonLink href={`/trips/${tripId}/places`}>
            장소 목록으로
          </ButtonLink>
        }
      />
    );
  }

  const status = getCurrentOpenStatus(place);

  return (
    <div className="space-y-5">
      <Link
        href={`/trips/${tripId}/places`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#625d6d] transition hover:text-[#292533]"
      >
        ← 장소 상세
      </Link>

      <section className="glass-base rounded-[22px] p-5">
        <div className="flex items-start gap-3">
          <span
            className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(103,217,213,0.16))] text-[22px]"
            aria-hidden
          >
            {PLACE_CATEGORY_EMOJI[place.category]}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold tracking-tight text-[#292533]">
              {place.name}
            </h1>
            <p className="mt-0.5 text-[13px] text-[#625d6d]">
              {place.category}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <StatusBadge status={status} showHours />
        </div>

        <p className="mt-3 text-[13px] text-[#625d6d]">📍 {place.address}</p>

        {place.mapUrl || place.blogUrl ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {place.mapUrl ? (
              <ButtonLink href={place.mapUrl} variant="ghost" size="sm">
                🗺 지도에서 보기
              </ButtonLink>
            ) : null}
            {place.blogUrl ? (
              <ButtonLink href={place.blogUrl} variant="ghost" size="sm">
                📝 블로그 보기
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="glass-soft rounded-[20px] p-5">
        <h2 className="text-[15px] font-bold text-[#292533]">영업시간</h2>
        <ul className="mt-3 space-y-1.5">
          {DAY_KEYS.map((key) => {
            const range = place.openingHours[key];
            const isClosed = place.closedDays.includes(key);
            return (
              <li
                key={key}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-[#625d6d]">{DAY_LABEL[key]}</span>
                <span
                  className={
                    isClosed
                      ? "font-medium text-[#c2506a]"
                      : range
                        ? "text-[#292533]"
                        : "text-[#b8b3c0]"
                  }
                >
                  {isClosed
                    ? "휴무"
                    : range
                      ? `${range[0]} ~ ${range[1]}`
                      : "정보 없음"}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 border-t border-white/60 pt-3.5">
          <h3 className="text-[13px] font-semibold text-[#625d6d]">휴무일</h3>
          <p className="mt-1 text-[13px] text-[#292533]">
            {place.closedDays.length === 0
              ? "없음"
              : place.closedDays.map((d) => DAY_LABEL[d]).join(", ")}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button fullWidth className="sm:flex-1" onClick={() => setScheduleOpen(true)}>
          일정에 추가
        </Button>
        <Button
          variant="ghost"
          fullWidth
          className="sm:flex-1"
          onClick={() => setEditOpen(true)}
        >
          장소 수정
        </Button>
        <Button variant="danger" onClick={() => setConfirmDelete(true)}>
          삭제
        </Button>
      </div>

      {editOpen ? (
        <PlaceFormModal onClose={() => setEditOpen(false)} editing={place} />
      ) : null}

      {scheduleOpen ? (
        <ScheduleFormModal
          onClose={() => setScheduleOpen(false)}
          tripId={tripId}
          dates={dates}
          defaultDate={dates[0] ?? ""}
          presetPlaceId={place.id}
        />
      ) : null}

      <ConfirmDialog
        open={confirmDelete}
        title="장소를 삭제할까요?"
        description="이 장소를 사용하는 일정도 함께 삭제됩니다. 복구할 수 없습니다."
        onConfirm={() => {
          removePlace(place.id);
          setConfirmDelete(false);
          router.push(`/trips/${tripId}/places`);
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
