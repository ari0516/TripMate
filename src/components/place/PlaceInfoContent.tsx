import { ButtonLink } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PlacePhotoStrip } from "@/components/place/PlacePhotoStrip";
import { DAY_KEYS, DAY_LABEL, PLACE_CATEGORY_EMOJI } from "@/lib/constants";
import { getCurrentOpenStatus } from "@/lib/opening-hours";
import type { Place } from "@/lib/types";

/**
 * 장소 정보(영업 상태·주소·사진·요일별 영업시간·휴무일)를 보여주는 읽기 전용 본문.
 * 장소 상세 페이지와 일정 카드의 장소 정보 바텀시트에서 공용으로 사용한다.
 */
export function PlaceInfoContent({ place }: { place: Place }) {
  const status = getCurrentOpenStatus(place);

  return (
    <div className="space-y-5">
      <section className="glass-base rounded-[22px] p-5">
        <div className="flex items-start gap-3">
          <span
            className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(103,217,213,0.16))] text-[22px]"
            aria-hidden
          >
            {PLACE_CATEGORY_EMOJI[place.category]}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold tracking-tight text-[#292533]">
              {place.name}
            </h2>
            <p className="mt-0.5 text-[13px] text-[#625d6d]">
              {place.category}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <StatusBadge status={status} showHours />
        </div>

        <p className="mt-3 text-[13px] text-[#625d6d]">📍 {place.address}</p>

        {place.mapUrl || place.blogUrl ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {place.mapUrl ? (
              <ButtonLink href={place.mapUrl} variant="ghost" size="sm">
                🗺 지도에서 보기
              </ButtonLink>
            ) : null}
            {place.blogUrl ? (
              <ButtonLink href={place.blogUrl} variant="ghost" size="sm">
                📝 블로그 보기
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </section>

      {place.photos && place.photos.length > 0 ? (
        <section className="glass-soft rounded-[20px] p-5">
          <h3 className="text-[15px] font-bold text-[#292533]">📷 사진</h3>
          <div className="mt-3">
            <PlacePhotoStrip photos={place.photos} size={100} />
          </div>
        </section>
      ) : null}

      <section className="glass-soft rounded-[20px] p-5">
        <h3 className="text-[15px] font-bold text-[#292533]">영업시간</h3>
        <ul className="mt-3 space-y-1.5">
          {DAY_KEYS.map((key) => {
            const range = place.openingHours[key];
            const isClosed = place.closedDays.includes(key);
            return (
              <li
                key={key}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-[#625d6d]">{DAY_LABEL[key]}</span>
                <span
                  className={
                    isClosed
                      ? "font-medium text-[#c2506a]"
                      : range
                        ? "text-[#292533]"
                        : "text-[#b8b3c0]"
                  }
                >
                  {isClosed
                    ? "휴무"
                    : range
                      ? `${range[0]} ~ ${range[1]}`
                      : "정보 없음"}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 border-t border-white/60 pt-3.5">
          <h4 className="text-[13px] font-semibold text-[#625d6d]">휴무일</h4>
          <p className="mt-1 text-[13px] text-[#292533]">
            {place.closedDays.length === 0
              ? "없음"
              : place.closedDays.map((d) => DAY_LABEL[d]).join(", ")}
          </p>
        </div>
      </section>
    </div>
  );
}
