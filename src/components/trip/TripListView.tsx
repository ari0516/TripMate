"use client";

import Link from "next/link";

import { ButtonLink } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { TripCard } from "@/components/trip/TripCard";
import { useHydrated, useTripStore } from "@/store/useTripStore";

export function TripListView() {
  const hydrated = useHydrated();
  const trips = useTripStore((state) => state.trips);
  const schedules = useTripStore((state) => state.schedules);
  const expenses = useTripStore((state) => state.expenses);

  return (
    <div className="mx-auto w-full max-w-[880px] flex-1 px-4 pt-6 pb-16 sm:px-6">
      <header className="flex items-center gap-2 text-[17px] font-bold text-[#292533]">
        <span aria-hidden>✈️</span> TripMate
      </header>

      <div className="mt-8 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-tight text-[#292533]">
            내 여행
          </h1>
          <p className="mt-1 text-sm text-[#625d6d]">
            일정과 장소를 한곳에서 관리해보세요.
          </p>
        </div>
        <ButtonLink href="/trips/new" size="md" className="shrink-0">
          ＋ 새 여행 만들기
        </ButtonLink>
      </div>

      <section className="mt-6 space-y-3.5">
        {!hydrated ? (
          <div className="space-y-3.5" aria-hidden>
            {[0, 1].map((i) => (
              <div
                key={i}
                className="glass-soft h-[148px] animate-pulse rounded-[22px]"
              />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <EmptyState
            icon="🧳"
            title="아직 만든 여행이 없어요"
            description="첫 여행을 만들고 날짜별 일정을 채워보세요."
            action={
              <ButtonLink href="/trips/new">＋ 새 여행 만들기</ButtonLink>
            }
          />
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              scheduleCount={
                schedules.filter((s) => s.tripId === trip.id).length
              }
              expenseTotal={expenses
                .filter((e) => e.tripId === trip.id)
                .reduce((sum, e) => sum + e.amount, 0)}
            />
          ))
        )}
      </section>

      <p className="mt-10 text-center text-[12px] text-[#b8b3c0]">
        MVP Phase 1 · 더미 데이터로 동작합니다.{" "}
        <Link href="/trips/new" className="underline underline-offset-2">
          여행 만들기
        </Link>
      </p>
    </div>
  );
}
