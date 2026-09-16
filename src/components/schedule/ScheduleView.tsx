"use client";

import { useMemo, useState } from "react";

import { Button, ButtonLink } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { DateTabs } from "@/components/schedule/DateTabs";
import { ScheduleCard } from "@/components/schedule/ScheduleCard";
import { ScheduleFormModal } from "@/components/schedule/ScheduleFormModal";
import { TripNotFound } from "@/components/trip/TripNotFound";
import { buildDateRange, formatFullKoreanDate } from "@/lib/date";
import type { Schedule } from "@/lib/types";
import { sortSchedules, useHydrated, useTripStore } from "@/store/useTripStore";

export function ScheduleView({ tripId }: { tripId: string }) {
  const hydrated = useHydrated();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const schedules = useTripStore((state) => state.schedules);
  const places = useTripStore((state) => state.places);

  const [pickedDate, setPickedDate] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);

  const dates = useMemo(
    () => (trip ? buildDateRange(trip.startDate, trip.endDate) : []),
    [trip],
  );

  // 선택값이 없거나 여행 기간을 벗어나면 첫날을 사용한다. (effect 없이 파생)
  const selectedDate = dates.includes(pickedDate) ? pickedDate : (dates[0] ?? "");

  const tripSchedules = useMemo(
    () => schedules.filter((s) => s.tripId === tripId),
    [schedules, tripId],
  );

  const countByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const schedule of tripSchedules) {
      map[schedule.date] = (map[schedule.date] ?? 0) + 1;
    }
    return map;
  }, [tripSchedules]);

  const daySchedules = useMemo(
    () => sortSchedules(tripSchedules.filter((s) => s.date === selectedDate)),
    [tripSchedules, selectedDate],
  );

  if (!hydrated) return <ScheduleSkeleton />;
  if (!trip) return <TripNotFound />;

  const dayIndex = dates.indexOf(selectedDate);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold tracking-tight text-[#292533]">
            여행 일정
          </h1>
          <p className="mt-1 text-[13px] text-[#625d6d]">
            날짜를 선택해 하루 동선을 확인하세요.
          </p>
        </div>
        <Button
          className="shrink-0"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          ＋ 일정 추가
        </Button>
      </div>

      <DateTabs
        dates={dates}
        selectedDate={selectedDate}
        onSelect={setPickedDate}
        countByDate={countByDate}
      />

      <section className="space-y-3">
        <div className="flex items-baseline gap-2 px-1">
          <h2 className="text-[17px] font-bold text-[#292533]">
            DAY {dayIndex + 1}
          </h2>
          <span className="text-[13px] text-[#625d6d]">
            {selectedDate ? formatFullKoreanDate(selectedDate) : ""}
          </span>
          <span className="ml-auto text-[12px] text-[#918b9c]">
            일정 {daySchedules.length}개
          </span>
        </div>

        {daySchedules.length === 0 ? (
          <EmptyState
            icon="📅"
            title="이 날의 일정이 아직 없어요"
            description="저장한 장소를 시간에 맞춰 추가해보세요."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  onClick={() => {
                    setEditing(null);
                    setModalOpen(true);
                  }}
                >
                  ＋ 일정 추가
                </Button>
                <ButtonLink
                  href={`/trips/${tripId}/places`}
                  variant="ghost"
                >
                  장소 먼저 저장하기
                </ButtonLink>
              </div>
            }
          />
        ) : (
          <div className="space-y-2.5">
            {daySchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                place={places.find((p) => p.id === schedule.placeId)}
                onClick={() => {
                  setEditing(schedule);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {modalOpen ? (
        <ScheduleFormModal
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          tripId={tripId}
          dates={dates}
          defaultDate={selectedDate || dates[0] || ""}
          editing={editing}
        />
      ) : null}
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <div className="glass-soft h-[74px] animate-pulse rounded-[20px]" />
      <div className="glass-soft h-[132px] animate-pulse rounded-[20px]" />
      <div className="space-y-2.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass-soft h-[104px] animate-pulse rounded-[18px]"
          />
        ))}
      </div>
    </div>
  );
}
