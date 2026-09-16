"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Chip, Field, SelectInput, TextInput } from "@/components/common/Field";
import { Modal } from "@/components/common/Modal";
import { cn } from "@/lib/cn";
import { DAY_KEYS, DAY_LABEL, PLACE_CATEGORIES } from "@/lib/constants";
import type { DayKey, OpeningHours, Place, PlaceCategory } from "@/lib/types";
import { useTripStore } from "@/store/useTripStore";

/**
 * 열릴 때만 마운트되는 폼 모달.
 * 호출하는 쪽에서 `{open && <PlaceFormModal ... />}` 형태로 렌더링한다.
 */
interface PlaceFormModalProps {
  onClose: () => void;
  /** 수정 모드일 때 대상 장소 */
  editing?: Place | null;
}

type HoursDraft = Record<DayKey, { open: string; close: string }>;

const EMPTY_HOURS: HoursDraft = DAY_KEYS.reduce((acc, key) => {
  acc[key] = { open: "", close: "" };
  return acc;
}, {} as HoursDraft);

function toDraft(hours: OpeningHours): HoursDraft {
  return DAY_KEYS.reduce((acc, key) => {
    const range = hours[key];
    acc[key] = { open: range?.[0] ?? "", close: range?.[1] ?? "" };
    return acc;
  }, {} as HoursDraft);
}

function toOpeningHours(draft: HoursDraft): OpeningHours {
  const result: OpeningHours = {};
  for (const key of DAY_KEYS) {
    const { open, close } = draft[key];
    result[key] = open && close ? [open, close] : null;
  }
  return result;
}

export function PlaceFormModal({
  onClose,
  editing,
}: PlaceFormModalProps) {
  const addPlace = useTripStore((state) => state.addPlace);
  const updatePlace = useTripStore((state) => state.updatePlace);

  const [name, setName] = useState(editing?.name ?? "");
  const [category, setCategory] = useState<PlaceCategory>(
    editing?.category ?? "관광지",
  );
  const [address, setAddress] = useState(editing?.address ?? "");
  const [hours, setHours] = useState<HoursDraft>(
    editing ? toDraft(editing.openingHours) : EMPTY_HOURS,
  );
  const [closedDays, setClosedDays] = useState<DayKey[]>(
    editing?.closedDays ?? [],
  );
  const [mapUrl, setMapUrl] = useState(editing?.mapUrl ?? "");
  const [blogUrl, setBlogUrl] = useState(editing?.blogUrl ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** 첫 요일 값을 나머지 요일에 그대로 복사한다 */
  function applyToAllDays() {
    const first = hours.mon;
    if (!first.open || !first.close) return;
    setHours(
      DAY_KEYS.reduce((acc, key) => {
        acc[key] = { ...first };
        return acc;
      }, {} as HoursDraft),
    );
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "장소명을 입력해주세요.";
    if (!address.trim()) nextErrors.address = "주소를 입력해주세요.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: name.trim(),
      category,
      address: address.trim(),
      openingHours: toOpeningHours(hours),
      closedDays,
      mapUrl: mapUrl.trim() || undefined,
      blogUrl: blogUrl.trim() || undefined,
    };

    if (editing) updatePlace(editing.id, payload);
    else addPlace(payload);
    onClose();
  }

  return (
    <Modal
      open
      title={editing ? "장소 수정" : "장소 추가"}
      onClose={onClose}
      footer={
        <Button size="lg" fullWidth onClick={handleSubmit}>
          저장하기
        </Button>
      }
    >
      <div className="space-y-5">
        <Field label="장소명" required htmlFor="place-name" error={errors.name}>
          <TextInput
            id="place-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 센소지"
          />
        </Field>

        <Field label="카테고리" required htmlFor="place-category">
          <SelectInput
            id="place-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PlaceCategory)}
          >
            {PLACE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field
          label="주소"
          required
          htmlFor="place-address"
          error={errors.address}
        >
          <TextInput
            id="place-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="예) 일본 도쿄도 다이토구 아사쿠사"
          />
        </Field>

        <Field
          label="영업시간"
          hint="비워두면 '영업시간 정보 없음'으로 표시됩니다."
        >
          <div className="space-y-2">
            {DAY_KEYS.map((key) => {
              const isClosed = closedDays.includes(key);
              return (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-6 shrink-0 text-[13px] font-semibold",
                      isClosed ? "text-[#c2506a]" : "text-[#625d6d]",
                    )}
                  >
                    {DAY_LABEL[key]}
                  </span>
                  <TextInput
                    type="time"
                    aria-label={`${DAY_LABEL[key]}요일 영업 시작`}
                    value={hours[key].open}
                    disabled={isClosed}
                    onChange={(e) =>
                      setHours((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], open: e.target.value },
                      }))
                    }
                    className="h-11 disabled:opacity-40"
                  />
                  <span className="shrink-0 text-[#b8b3c0]">~</span>
                  <TextInput
                    type="time"
                    aria-label={`${DAY_LABEL[key]}요일 영업 종료`}
                    value={hours[key].close}
                    disabled={isClosed}
                    onChange={(e) =>
                      setHours((prev) => ({
                        ...prev,
                        [key]: { ...prev[key], close: e.target.value },
                      }))
                    }
                    className="h-11 disabled:opacity-40"
                  />
                </div>
              );
            })}
            <button
              type="button"
              onClick={applyToAllDays}
              className="cursor-pointer text-[12px] font-semibold text-[#6d3fd4] underline underline-offset-2"
            >
              월요일 시간을 모든 요일에 적용
            </button>
          </div>
        </Field>

        <Field label="휴무일" hint="선택한 요일은 휴무로 표시됩니다.">
          <div className="flex flex-wrap gap-2">
            {DAY_KEYS.map((key) => (
              <Chip
                key={key}
                active={closedDays.includes(key)}
                onClick={() =>
                  setClosedDays((prev) =>
                    prev.includes(key)
                      ? prev.filter((d) => d !== key)
                      : [...prev, key],
                  )
                }
              >
                {DAY_LABEL[key]}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="지도 URL" htmlFor="place-map">
          <TextInput
            id="place-map"
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
            placeholder="https://maps.google.com/..."
            inputMode="url"
          />
        </Field>

        <Field label="블로그 URL" htmlFor="place-blog">
          <TextInput
            id="place-blog"
            value={blogUrl}
            onChange={(e) => setBlogUrl(e.target.value)}
            placeholder="https://blog.naver.com/..."
            inputMode="url"
          />
        </Field>
      </div>
    </Modal>
  );
}
