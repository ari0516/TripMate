"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Chip, Field, SelectInput, TextArea, TextInput } from "@/components/common/Field";
import { ConfirmDialog, Modal } from "@/components/common/Modal";
import { EXPENSE_CATEGORIES, CURRENCY_STYLE } from "@/lib/constants";
import { formatDotDate } from "@/lib/date";
import type { CurrencyCode, Expense, ExpenseCategory } from "@/lib/types";
import { useTripStore } from "@/store/useTripStore";

/**
 * 열릴 때만 마운트되는 폼 모달.
 * 호출하는 쪽에서 `{open && <ExpenseFormModal ... />}` 형태로 렌더링한다.
 */
interface ExpenseFormModalProps {
  onClose: () => void;
  tripId: string;
  /** 여행 기간의 날짜 목록 */
  dates: string[];
  /** 기본 선택 날짜 */
  defaultDate: string;
  /** 수정 모드일 때 대상 지출 */
  editing?: Expense | null;
  currency: CurrencyCode;
}

export function ExpenseFormModal({
  onClose,
  tripId,
  dates,
  defaultDate,
  editing,
  currency,
}: ExpenseFormModalProps) {
  const addExpense = useTripStore((state) => state.addExpense);
  const updateExpense = useTripStore((state) => state.updateExpense);
  const removeExpense = useTripStore((state) => state.removeExpense);

  const [date, setDate] = useState(editing?.date ?? defaultDate);
  const [amount, setAmount] = useState(
    editing ? String(editing.amount) : "",
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    editing?.category ?? "식비",
  );
  const [memo, setMemo] = useState(editing?.memo ?? "");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSubmit() {
    const parsed = Number(amount);
    if (!amount.trim() || Number.isNaN(parsed) || parsed <= 0) {
      setError("금액을 올바르게 입력해주세요.");
      return;
    }

    const payload = {
      tripId,
      date,
      amount: parsed,
      category,
      memo: memo.trim() || undefined,
    };

    if (editing) updateExpense(editing.id, payload);
    else addExpense(payload);
    onClose();
  }

  function handleDelete() {
    if (editing) removeExpense(editing.id);
    setConfirmDelete(false);
    onClose();
  }

  return (
    <>
      <Modal
        open
        title={editing ? "지출 수정" : "지출 추가"}
        onClose={onClose}
        footer={
          <div className="flex gap-2">
            {editing ? (
              <Button
                variant="danger"
                size="lg"
                onClick={() => setConfirmDelete(true)}
                className="px-5"
              >
                삭제
              </Button>
            ) : null}
            <Button size="lg" fullWidth onClick={handleSubmit}>
              {editing ? "저장" : "지출 추가"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <Field label="날짜" required htmlFor="expense-date">
            <SelectInput
              id="expense-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            >
              {dates.map((d, i) => (
                <option key={d} value={d}>
                  DAY {i + 1} · {formatDotDate(d)}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="금액" required htmlFor="expense-amount" error={error}>
            <div className="relative">
              <TextInput
                id="expense-amount"
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="예) 18000"
                className={
                  CURRENCY_STYLE[currency].position === "prefix"
                    ? "pl-12"
                    : "pr-12"
                }
              />
              <span
                className={
                  CURRENCY_STYLE[currency].position === "prefix"
                    ? "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[#918b9c]"
                    : "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#918b9c]"
                }
              >
                {CURRENCY_STYLE[currency].symbol}
              </span>
            </div>
          </Field>

          <Field label="카테고리" required>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="메모" htmlFor="expense-memo">
            <TextArea
              id="expense-memo"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예) 점심 라멘"
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="지출 내역을 삭제할까요?"
        description="삭제한 지출 내역은 복구할 수 없습니다."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
