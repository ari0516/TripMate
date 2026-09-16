"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { BudgetCard } from "@/components/expense/BudgetCard";
import { ExpenseFormModal } from "@/components/expense/ExpenseFormModal";
import { TripNotFound } from "@/components/trip/TripNotFound";
import { getBudgetSummary } from "@/lib/budget";
import { EXPENSE_CATEGORY_EMOJI } from "@/lib/constants";
import { buildDateRange, formatFullKoreanDate, formatNumber } from "@/lib/date";
import type { Expense } from "@/lib/types";
import { useHydrated, useTripStore } from "@/store/useTripStore";

export function ExpenseView({ tripId }: { tripId: string }) {
  const hydrated = useHydrated();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const expenses = useTripStore((state) => state.expenses);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [editing, setEditing] = useState<Expense | null>(null);

  const dates = useMemo(
    () => (trip ? buildDateRange(trip.startDate, trip.endDate) : []),
    [trip],
  );

  const tripExpenses = useMemo(
    () => expenses.filter((e) => e.tripId === tripId),
    [expenses, tripId],
  );

  if (!hydrated) return <ExpenseSkeleton />;
  if (!trip) return <TripNotFound />;

  const totalSpent = tripExpenses.reduce((sum, e) => sum + e.amount, 0);

  function openAddModal(date: string) {
    setEditing(null);
    setModalDate(date);
    setModalOpen(true);
  }

  function openEditModal(expense: Expense) {
    setEditing(expense);
    setModalDate(expense.date);
    setModalOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold tracking-tight text-[#292533]">
            💳 가계부
          </h1>
          <p className="mt-1 text-[13px] text-[#625d6d]">
            여행 전체 지출 {formatNumber(totalSpent)}원
          </p>
        </div>
        <Button className="shrink-0" onClick={() => openAddModal(dates[0] ?? "")}>
          ＋ 지출 추가
        </Button>
      </div>

      <div className="space-y-6">
        {dates.map((date, index) => {
          const dayExpenses = tripExpenses.filter((e) => e.date === date);
          const summary = getBudgetSummary(trip.dailyBudget, dayExpenses);

          return (
            <section key={date} className="space-y-3">
              <div className="flex items-baseline justify-between px-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[17px] font-bold text-[#292533]">
                    DAY {index + 1}
                  </h2>
                  <span className="text-[13px] text-[#625d6d]">
                    {formatFullKoreanDate(date)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openAddModal(date)}
                  className="cursor-pointer text-[13px] font-semibold text-[#6d3fd4]"
                >
                  ＋ 추가
                </button>
              </div>

              <BudgetCard summary={summary} />

              {dayExpenses.length === 0 ? (
                <p className="glass-soft rounded-[16px] px-4 py-5 text-center text-[13px] text-[#918b9c]">
                  아직 지출 내역이 없어요.
                </p>
              ) : (
                <div className="glass-soft divide-y divide-white/50 rounded-[18px]">
                  {dayExpenses.map((expense) => (
                    <button
                      key={expense.id}
                      type="button"
                      onClick={() => openEditModal(expense)}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition first:rounded-t-[18px] last:rounded-b-[18px] hover:bg-white/50"
                    >
                      <span className="text-[18px]" aria-hidden>
                        {EXPENSE_CATEGORY_EMOJI[expense.category]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-[#292533]">
                          {expense.category}
                        </p>
                        {expense.memo ? (
                          <p className="truncate text-[12px] text-[#918b9c]">
                            {expense.memo}
                          </p>
                        ) : null}
                      </div>
                      <span className="shrink-0 text-[14px] font-bold text-[#292533]">
                        {formatNumber(expense.amount)}원
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {modalOpen ? (
        <ExpenseFormModal
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          tripId={tripId}
          dates={dates}
          defaultDate={modalDate || dates[0] || ""}
          editing={editing}
        />
      ) : null}
    </div>
  );
}

function ExpenseSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <div className="glass-soft h-[74px] animate-pulse rounded-[20px]" />
      {[0, 1].map((i) => (
        <div key={i} className="glass-soft h-[220px] animate-pulse rounded-[20px]" />
      ))}
    </div>
  );
}
