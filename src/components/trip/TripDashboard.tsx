"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ButtonLink } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TripNotFound } from "@/components/trip/TripNotFound";
import { PLACE_CATEGORY_EMOJI } from "@/lib/constants";
import {
  buildDateRange,
  formatDayLabel,
  formatDotDate,
  formatMonthDay,
  formatNumber,
} from "@/lib/date";
import { getOpenStatus } from "@/lib/opening-hours";
import { sortSchedules, useHydrated, useTripStore } from "@/store/useTripStore";

export function TripDashboard({ tripId }: { tripId: string }) {
  const hydrated = useHydrated();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const schedules = useTripStore((state) => state.schedules);
  const allPlaces = useTripStore((state) => state.places);

  const dates = useMemo(
    () => (trip ? buildDateRange(trip.startDate, trip.endDate) : []),
    [trip],
  );

  const places = useMemo(
    () => allPlaces.filter((p) => p.tripId === tripId),
    [allPlaces, tripId],
  );

  const tripSchedules = useMemo(
    () => sortSchedules(schedules.filter((s) => s.tripId === tripId)),
    [schedules, tripId],
  );

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-hidden>
        <div className="glass-soft h-[96px] animate-pulse rounded-[20px]" />
        <div className="glass-soft h-[220px] animate-pulse rounded-[20px]" />
      </div>
    );
  }
  if (!trip) return <TripNotFound />;

  const savedPlaceIds = new Set(tripSchedules.map((s) => s.placeId));

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/"
          className="hidden text-sm font-medium text-[#625d6d] transition hover:text-[#292533] lg:inline-flex"
        >
          ← 내 여행
        </Link>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight text-[#292533]">
          {trip.emoji ?? "✈️"} {trip.name}
        </h1>
        <p className="mt-1 text-[13px] text-[#625d6d]">
          {formatDotDate(trip.startDate)} ~ {formatDotDate(trip.endDate)} ·{" "}
          {dates.length}일
        </p>
      </header>

      <section className="grid grid-cols-3 gap-2.5">
        <SummaryTile label="전체 일정" value={`${tripSchedules.length}개`} />
        <SummaryTile label="저장한 장소" value={`${places.length}개`} />
        <SummaryTile
          label="일일 예산"
          value={`${formatNumber(trip.dailyBudget)}원`}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[17px] font-bold text-[#292533]">📅 여행 일정</h2>
          <Link
            href={`/trips/${tripId}/schedule`}
            className="text-[13px] font-semibold text-[#6d3fd4]"
          >
            전체 보기 →
          </Link>
        </div>

        {tripSchedules.length === 0 ? (
          <EmptyState
            icon="📅"
            title="아직 일정이 없어요"
            description="저장한 장소를 날짜와 시간에 맞춰 추가해보세요."
            action={
              <ButtonLink href={`/trips/${tripId}/schedule`}>
                일정 만들러 가기
              </ButtonLink>
            }
          />
        ) : (
          <div className="space-y-4">
            {dates.map((date, index) => {
              const daySchedules = tripSchedules.filter(
                (s) => s.date === date,
              );
              if (daySchedules.length === 0) return null;

              return (
                <div key={date}>
                  <p className="mb-2 px-1 text-[13px] font-semibold text-[#625d6d]">
                    {formatMonthDay(date)} {formatDayLabel(date)} · DAY{" "}
                    {index + 1}
                  </p>
                  <div className="glass-soft divide-y divide-white/50 rounded-[18px]">
                    {daySchedules.map((schedule) => {
                      const place = places.find(
                        (p) => p.id === schedule.placeId,
                      );
                      const status = place
                        ? getOpenStatus(place, schedule.date, schedule.startTime)
                        : null;
                      return (
                        <Link
                          key={schedule.id}
                          href={`/trips/${tripId}/schedule`}
                          className="flex items-center gap-3 px-4 py-3 transition first:rounded-t-[18px] last:rounded-b-[18px] hover:bg-white/50"
                        >
                          <span className="w-[46px] shrink-0 text-[14px] font-bold text-[#292533]">
                            {schedule.startTime}
                          </span>
                          <span aria-hidden>
                            {place
                              ? PLACE_CATEGORY_EMOJI[place.category]
                              : "❔"}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[14px] text-[#292533]">
                            {place?.name ?? "삭제된 장소"}
                          </span>
                          {status ? <StatusBadge status={status} /> : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[17px] font-bold text-[#292533]">📍 저장한 장소</h2>
          <Link
            href={`/trips/${tripId}/places`}
            className="text-[13px] font-semibold text-[#6d3fd4]"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
          {places.slice(0, 8).map((place) => (
            <Link
              key={place.id}
              href={`/trips/${tripId}/places/${place.id}`}
              className="glass-soft w-[150px] shrink-0 rounded-[16px] p-3.5 transition hover:bg-white/60"
            >
              <span className="text-[18px]" aria-hidden>
                {PLACE_CATEGORY_EMOJI[place.category]}
              </span>
              <p className="mt-1.5 truncate text-[14px] font-semibold text-[#292533]">
                {place.name}
              </p>
              <p className="truncate text-[11px] text-[#918b9c]">
                {place.category}
                {savedPlaceIds.has(place.id) ? " · 일정에 있음" : ""}
              </p>
            </Link>
          ))}
          {places.length === 0 ? (
            <p className="px-1 text-[13px] text-[#918b9c]">
              저장한 장소가 없습니다.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-base rounded-[18px] px-3.5 py-4 text-center">
      <p className="text-[11px] font-medium text-[#918b9c]">{label}</p>
      <p className="mt-1 text-[17px] font-bold text-[#292533]">{value}</p>
    </div>
  );
}
