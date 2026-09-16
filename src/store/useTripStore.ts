"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  mockExpenses,
  mockPlaces,
  mockSchedules,
  mockTrips,
} from "@/lib/mock-data";
import { timeToMinutes } from "@/lib/date";
import type { Expense, Place, Schedule, Trip } from "@/lib/types";

const STORAGE_KEY = "tripmate-store-v1";

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface TripState {
  trips: Trip[];
  places: Place[];
  schedules: Schedule[];
  expenses: Expense[];

  // Trip
  addTrip: (input: Omit<Trip, "id">) => Trip;
  updateTrip: (id: string, patch: Partial<Omit<Trip, "id">>) => void;
  removeTrip: (id: string) => void;

  // Place
  addPlace: (input: Omit<Place, "id">) => Place;
  updatePlace: (id: string, patch: Partial<Omit<Place, "id">>) => void;
  removePlace: (id: string) => void;

  // Schedule
  addSchedule: (input: Omit<Schedule, "id">) => Schedule;
  updateSchedule: (id: string, patch: Partial<Omit<Schedule, "id">>) => void;
  removeSchedule: (id: string) => void;

  // Expense
  addExpense: (input: Omit<Expense, "id">) => Expense;
  updateExpense: (id: string, patch: Partial<Omit<Expense, "id">>) => void;
  removeExpense: (id: string) => void;

  /** 모든 데이터를 초기 mock 상태로 되돌린다. */
  resetToMock: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      trips: mockTrips,
      places: mockPlaces,
      schedules: mockSchedules,
      expenses: mockExpenses,

      addTrip: (input) => {
        const trip: Trip = { ...input, id: createId("trip") };
        set((state) => ({ trips: [...state.trips, trip] }));
        return trip;
      },
      updateTrip: (id, patch) =>
        set((state) => ({
          trips: state.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      removeTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
          schedules: state.schedules.filter((s) => s.tripId !== id),
          expenses: state.expenses.filter((e) => e.tripId !== id),
        })),

      addPlace: (input) => {
        const place: Place = { ...input, id: createId("place") };
        set((state) => ({ places: [...state.places, place] }));
        return place;
      },
      updatePlace: (id, patch) =>
        set((state) => ({
          places: state.places.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      /** 장소를 삭제하면 해당 장소를 사용하는 일정도 함께 정리한다. */
      removePlace: (id) =>
        set((state) => ({
          places: state.places.filter((p) => p.id !== id),
          schedules: state.schedules.filter((s) => s.placeId !== id),
        })),

      addSchedule: (input) => {
        const schedule: Schedule = { ...input, id: createId("sch") };
        set((state) => ({ schedules: [...state.schedules, schedule] }));
        return schedule;
      },
      updateSchedule: (id, patch) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...patch } : s,
          ),
        })),
      /** 일정만 삭제하며 Place 데이터는 유지한다. */
      removeSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),

      addExpense: (input) => {
        const expense: Expense = { ...input, id: createId("exp") };
        set((state) => ({ expenses: [...state.expenses, expense] }));
        return expense;
      },
      updateExpense: (id, patch) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...patch } : e,
          ),
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      resetToMock: () =>
        set({
          trips: mockTrips,
          places: mockPlaces,
          schedules: mockSchedules,
          expenses: mockExpenses,
        }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        trips: state.trips,
        places: state.places,
        schedules: state.schedules,
        expenses: state.expenses,
      }),
    },
  ),
);

/**
 * localStorage 복원이 끝났는지 여부.
 * 서버 렌더 결과와 클라이언트 첫 렌더를 맞추기 위해 사용한다.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useTripStore.persist.onFinishHydration(onStoreChange),
    () => useTripStore.persist.hasHydrated(),
    () => false,
  );
}

/* ------------------------------------------------------------------
   Selector 헬퍼 — 컴포넌트에서 반복되는 파생 계산을 모아 둔다.
------------------------------------------------------------------- */

export function selectTrip(state: TripState, tripId: string): Trip | undefined {
  return state.trips.find((t) => t.id === tripId);
}

export function selectPlace(
  state: TripState,
  placeId: string,
): Place | undefined {
  return state.places.find((p) => p.id === placeId);
}

/** 특정 여행·날짜의 일정을 시작 시간 오름차순으로 반환 */
export function sortSchedules(schedules: Schedule[]): Schedule[] {
  return [...schedules].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (timeToMinutes(a.startTime) ?? 0) - (timeToMinutes(b.startTime) ?? 0);
  });
}
