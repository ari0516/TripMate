"use client";

import { Button, ButtonLink } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { PlaceInfoContent } from "@/components/place/PlaceInfoContent";
import type { Place, Schedule } from "@/lib/types";

interface SchedulePlaceSheetProps {
  schedule: Schedule;
  place: Place;
  tripId: string;
  onClose: () => void;
  onEditSchedule: () => void;
}

/**
 * 일정 카드를 누르면 뜨는 바텀시트.
 * 일정을 바로 수정하지 않고, 저장한 장소의 영업시간·휴무일·사진 등을 먼저 보여준다.
 * 일정 자체를 수정하려면 "일정 수정" 버튼을 눌러야 한다.
 */
export function SchedulePlaceSheet({
  schedule,
  place,
  tripId,
  onClose,
  onEditSchedule,
}: SchedulePlaceSheetProps) {
  return (
    <Modal
      open
      title={place.name}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <ButtonLink
            href={`/trips/${tripId}/places/${place.id}`}
            variant="ghost"
            size="lg"
            className="flex-1"
          >
            장소 상세로 이동
          </ButtonLink>
          <Button size="lg" className="flex-1" onClick={onEditSchedule}>
            일정 수정
          </Button>
        </div>
      }
    >
      <p className="mb-4 text-[13px] font-semibold text-[#6d3fd4]">
        🕐 {schedule.startTime} ~ {schedule.endTime}
      </p>
      <PlaceInfoContent place={place} />
    </Modal>
  );
}
