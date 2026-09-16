"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { Field, SelectInput, TextInput } from "@/components/common/Field";
import { ConfirmDialog, Modal } from "@/components/common/Modal";
import { StatusBadge, StatusWarning } from "@/components/common/StatusBadge";
import { PLACE_CATEGORY_EMOJI } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { formatDotDate, timeToMinutes } from "@/lib/date";
import { getOpenStatus } from "@/lib/opening-hours";
import type { Place, Schedule } from "@/lib/types";
import { useTripStore } from "@/store/useTripStore";

/**
 * 열릴 때만 마운트되는 폼 모달.
 * 호출하는 쪽에서 `{open && <ScheduleFormModal ... />}` 형태로 렌더링하면
 * 초기값이 매번 새로 설정되므로 별도의 초기화 effect 가 필요 없다.
 */
interface ScheduleFormModalProps {
  onClose: () => void;
  tripId: string;
  /** 여행 기간의 날짜 목록 */
  dates: string[];
  /** 기본 선택 날짜 */
  defaultDate: string;
  /** 수정 모드일 때 대상 일정 */
  editing?: Schedule | null;
  /** 장소 목록에서 "일정에 추가" 로 진입한 경우 미리 선택된 장소 */
  presetPlaceId?: string | null;
}

export function ScheduleFormModal({
  onClose,
  tripId,
  dates,
  defaultDate,
  editing,
  presetPlaceId,
}: ScheduleFormModalProps) {
  const places = useTripStore((state) => state.places);
  const addSchedule = useTripStore((state) => state.addSchedule);
  const updateSchedule = useTripStore((state) => state.updateSchedule);
  const removeSchedule = useTripStore((state) => state.removeSchedule);

  const [placeId, setPlaceId] = useState(
    editing?.placeId ?? presetPlaceId ?? "",
  );
  const [date, setDate] = useState(editing?.date ?? defaultDate);
  const [startTime, setStartTime] = useState(editing?.startTime ?? "10:00");
  const [endTime, setEndTime] = useState(editing?.endTime ?? "11:00");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedPlace: Place | undefined = useMemo(
    () => places.find((p) => p.id === placeId),
    [places, placeId],
  );

  const filteredPlaces = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return places;
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.category.includes(q),
    );
  }, [places, keyword]);

  // 선택한 장소/날짜/시간 기준 운영 상태 — 경고가 있어도 저장은 가능하다.
  const status = selectedPlace
    ? getOpenStatus(selectedPlace, date, startTime)
    : null;

  function handleSubmit() {
    if (!placeId) {
      setError("장소를 선택해주세요.");
      return;
    }
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    if (start === null || end === null) {
      setError("시간을 올바르게 입력해주세요.");
      return;
    }
    if (end <= start) {
      setError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    if (editing) {
      updateSchedule(editing.id, { placeId, date, startTime, endTime });
    } else {
      addSchedule({ tripId, placeId, date, startTime, endTime });
    }
    onClose();
  }

  function handleDelete() {
    if (editing) removeSchedule(editing.id);
    setConfirmDelete(false);
    onClose();
  }

  return (
    <>
      <Modal
        open
        title={editing ? "일정 수정" : "일정 추가"}
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
              {editing ? "저장" : "일정 추가"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* 장소 선택 */}
          <Field label="장소 선택" required error={error}>
            <TextInput
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="🔍 장소를 검색하세요"
              aria-label="장소 검색"
            />
            <div className="mt-2 max-h-[220px] space-y-1.5 overflow-y-auto pr-0.5">
              {filteredPlaces.length === 0 ? (
                <p className="rounded-[14px] bg-white/50 px-4 py-6 text-center text-[13px] text-[#918b9c]">
                  저장된 장소가 없습니다. 장소 화면에서 먼저 추가해주세요.
                </p>
              ) : (
                filteredPlaces.map((place) => {
                  const active = place.id === placeId;
                  const placeStatus = getOpenStatus(place, date, startTime);
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => {
                        setPlaceId(place.id);
                        setError(null);
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left transition",
                        active
                          ? "border-[#a78bfa]/60 bg-[#ede9fe]/70"
                          : "border-white/60 bg-white/50 hover:bg-white/80",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border text-[10px]",
                          active
                            ? "border-[#8b5cf6] bg-[#8b5cf6] text-white"
                            : "border-[#cfc9d8] text-transparent",
                        )}
                        aria-hidden
                      >
                        ✓
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-[#292533]">
                          {PLACE_CATEGORY_EMOJI[place.category]} {place.name}
                        </p>
                        <p className="truncate text-[12px] text-[#918b9c]">
                          {place.category} · {place.address}
                        </p>
                      </div>
                      <StatusBadge status={placeStatus} />
                    </button>
                  );
                })
              )}
            </div>
          </Field>

          {/* 날짜 */}
          <Field label="날짜" required htmlFor="schedule-date">
            <SelectInput
              id="schedule-date"
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

          {/* 시간 */}
          <Field label="시간" required>
            <div className="flex items-center gap-2">
              <TextInput
                type="time"
                aria-label="시작 시간"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <span className="shrink-0 text-[#b8b3c0]">~</span>
              <TextInput
                type="time"
                aria-label="종료 시간"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </Field>

          {status?.warning ? <StatusWarning status={status} /> : null}
          {status && !status.warning ? (
            <div className="flex items-center gap-2 rounded-[14px] border border-[#35c99a]/28 bg-[#35c99a]/10 px-3.5 py-3 text-[13px] text-[#1f8f6c]">
              <StatusBadge status={status} showHours />
              <span>방문 가능한 시간입니다.</span>
            </div>
          ) : null}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="일정을 삭제할까요?"
        description="삭제한 일정은 복구할 수 없습니다. 저장된 장소는 그대로 유지됩니다."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
