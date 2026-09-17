"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button, ButtonLink } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/Modal";
import { PlaceFormModal } from "@/components/place/PlaceFormModal";
import { PlaceInfoContent } from "@/components/place/PlaceInfoContent";
import { ScheduleFormModal } from "@/components/schedule/ScheduleFormModal";
import { buildDateRange } from "@/lib/date";
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
    state.places.find((p) => p.id === placeId && p.tripId === tripId),
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

  return (
    <div className="space-y-5">
      <Link
        href={`/trips/${tripId}/places`}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#625d6d] transition hover:text-[#292533]"
      >
        ← 장소 상세
      </Link>

      <PlaceInfoContent place={place} />

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
        <PlaceFormModal
          onClose={() => setEditOpen(false)}
          tripId={tripId}
          editing={place}
        />
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
