"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Chip, TextInput } from "@/components/common/Field";
import { PlaceCard } from "@/components/place/PlaceCard";
import { PlaceFormModal } from "@/components/place/PlaceFormModal";
import { ScheduleFormModal } from "@/components/schedule/ScheduleFormModal";
import { TripNotFound } from "@/components/trip/TripNotFound";
import { PLACE_CATEGORIES } from "@/lib/constants";
import { buildDateRange } from "@/lib/date";
import type { PlaceCategory } from "@/lib/types";
import { useHydrated, useTripStore } from "@/store/useTripStore";

type Filter = PlaceCategory | "전체";

export function PlaceListView({ tripId }: { tripId: string }) {
  const hydrated = useHydrated();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const places = useTripStore((state) => state.places);

  const [filter, setFilter] = useState<Filter>("전체");
  const [keyword, setKeyword] = useState("");
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [presetPlaceId, setPresetPlaceId] = useState<string | null>(null);

  const dates = useMemo(
    () => (trip ? buildDateRange(trip.startDate, trip.endDate) : []),
    [trip],
  );

  const tripPlaces = useMemo(
    () => places.filter((p) => p.tripId === tripId),
    [places, tripId],
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return tripPlaces.filter((place) => {
      const matchCategory = filter === "전체" || place.category === filter;
      const matchKeyword =
        !q ||
        place.name.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q);
      return matchCategory && matchKeyword;
    });
  }, [tripPlaces, filter, keyword]);

  if (!hydrated) return <PlaceSkeleton />;
  if (!trip) return <TripNotFound />;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold tracking-tight text-[#292533]">
            📍 저장한 장소
          </h1>
          <p className="mt-1 text-[13px] text-[#625d6d]">
            가고 싶은 곳을 저장해두고 일정에 바로 넣어보세요.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => setPlaceModalOpen(true)}>
          ＋ 장소 추가
        </Button>
      </div>

      <div className="glass-base space-y-3 rounded-[20px] p-3.5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {(["전체", ...PLACE_CATEGORIES] as Filter[]).map((c) => (
            <Chip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              className="shrink-0"
            >
              {c}
            </Chip>
          ))}
        </div>
        <TextInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔍 장소 검색"
          aria-label="장소 검색"
          className="h-11"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📍"
          title={
            tripPlaces.length === 0
              ? "저장한 장소가 없어요"
              : "조건에 맞는 장소가 없어요"
          }
          description={
            tripPlaces.length === 0
              ? "방문하고 싶은 장소를 저장하면 일정에 추가할 수 있어요."
              : "카테고리나 검색어를 바꿔보세요."
          }
          action={
            tripPlaces.length === 0 ? (
              <Button onClick={() => setPlaceModalOpen(true)}>
                ＋ 장소 추가
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              tripId={tripId}
              onAddToSchedule={setPresetPlaceId}
            />
          ))}
        </div>
      )}

      {placeModalOpen ? (
        <PlaceFormModal
          onClose={() => setPlaceModalOpen(false)}
          tripId={tripId}
        />
      ) : null}

      {presetPlaceId !== null ? (
        <ScheduleFormModal
          onClose={() => setPresetPlaceId(null)}
          tripId={tripId}
          dates={dates}
          defaultDate={dates[0] ?? ""}
          presetPlaceId={presetPlaceId}
        />
      ) : null}
    </div>
  );
}

function PlaceSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <div className="glass-soft h-[74px] animate-pulse rounded-[20px]" />
      <div className="glass-soft h-[112px] animate-pulse rounded-[20px]" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass-soft h-[150px] animate-pulse rounded-[18px]"
          />
        ))}
      </div>
    </div>
  );
}
