"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { Field, SelectInput, TextInput } from "@/components/common/Field";
import { COUNTRIES, COUNTRY_INFO, CURRENCY_STYLE } from "@/lib/constants";
import { currencyOf, formatMoney } from "@/lib/currency";
import { getDayCount } from "@/lib/date";
import type { Country } from "@/lib/types";
import { useTripStore } from "@/store/useTripStore";

interface FormErrors {
  name?: string;
  date?: string;
  budget?: string;
}

export function TripCreateForm() {
  const router = useRouter();
  const addTrip = useTripStore((state) => state.addTrip);

  const [name, setName] = useState("");
  const [country, setCountry] = useState<Country>("일본");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("100000");
  const [errors, setErrors] = useState<FormErrors>({});

  const currency = currencyOf(country);

  const dayCount = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return getDayCount(startDate, endDate);
  }, [startDate, endDate]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "여행명을 입력해주세요.";
    if (!startDate || !endDate) {
      next.date = "여행 기간을 선택해주세요.";
    } else if (startDate > endDate) {
      next.date = "시작일은 종료일보다 늦을 수 없습니다.";
    }
    const budgetValue = Number(budget.replaceAll(",", ""));
    if (!Number.isFinite(budgetValue) || budgetValue < 0) {
      next.budget = "예산은 0 이상 입력해주세요.";
    }
    return next;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const trip = addTrip({
      name: name.trim(),
      country,
      startDate,
      endDate,
      dailyBudget: Number(budget.replaceAll(",", "")),
      emoji: COUNTRY_INFO[country].emoji,
    });

    router.push(`/trips/${trip.id}/schedule`);
  }

  return (
    <div className="mx-auto w-full max-w-[560px] flex-1 px-4 pt-6 pb-16 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#625d6d] transition hover:text-[#292533]"
      >
        ← 여행 만들기
      </Link>

      <h1 className="mt-6 text-[24px] font-bold tracking-tight text-[#292533]">
        새로운 여행을 만들어보세요
      </h1>
      <p className="mt-1.5 text-sm text-[#625d6d]">
        여행 기간을 설정하면 날짜별 일정이 자동으로 만들어집니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <div className="glass-base space-y-5 rounded-[22px] p-5">
          <Field
            label="여행 이름"
            required
            htmlFor="trip-name"
            error={errors.name}
          >
            <TextInput
              id="trip-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예) 도쿄 여행"
              maxLength={40}
            />
          </Field>

          <Field label="나라" required htmlFor="trip-country">
            <SelectInput
              id="trip-country"
              value={country}
              onChange={(e) => setCountry(e.target.value as Country)}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {COUNTRY_INFO[c].emoji} {c}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="여행 기간" required error={errors.date}>
            <div className="flex items-center gap-2">
              <TextInput
                type="date"
                aria-label="시작일"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="shrink-0 text-[#b8b3c0]">~</span>
              <TextInput
                type="date"
                aria-label="종료일"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </Field>

          <Field
            label="일별 기본 예산"
            htmlFor="trip-budget"
            error={errors.budget}
            hint="각 날짜에 동일하게 적용됩니다. 나중에 변경할 수 있어요."
          >
            <div className="relative">
              <TextInput
                id="trip-budget"
                inputMode="numeric"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value.replace(/[^0-9]/g, ""))
                }
                className={
                  CURRENCY_STYLE[currency].position === "prefix"
                    ? "pl-12"
                    : "pr-12"
                }
                placeholder="100000"
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

          {dayCount > 0 ? (
            <p className="rounded-[14px] bg-[#ede9fe]/70 px-4 py-3 text-center text-[13px] font-semibold text-[#6d3fd4]">
              총 {dayCount}일 · 예상 총 예산{" "}
              {formatMoney(dayCount * Number(budget || 0), currency)}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" fullWidth>
          여행 만들기
        </Button>
      </form>
    </div>
  );
}
