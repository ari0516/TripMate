import { OPEN_STATUS_STYLE } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { OpenStatusResult } from "@/lib/types";

interface StatusBadgeProps {
  status: OpenStatusResult;
  /** 영업시간 텍스트를 함께 표시할지 여부 */
  showHours?: boolean;
  className?: string;
}

/**
 * 영업중 / 영업시간 외 / 휴무 / 정보 없음 을 색상 + 텍스트로 함께 표시한다.
 * (색상만으로 상태를 구분하지 않는다 — 02-wireframe.md §19)
 */
export function StatusBadge({
  status,
  showHours = false,
  className,
}: StatusBadgeProps) {
  const style = OPEN_STATUS_STYLE[status.status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium",
        style.chip,
        style.text,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      {status.label}
      {showHours && status.hoursText ? (
        <span className="text-[#625d6d]/70">· {status.hoursText}</span>
      ) : null}
    </span>
  );
}

/** 일정 추가/수정 시 표시하는 운영시간 경고 문구 */
export function StatusWarning({ status }: { status: OpenStatusResult }) {
  if (!status.warning) return null;

  const tone =
    status.status === "dayoff"
      ? "bg-[#e8798f]/10 border-[#e8798f]/28 text-[#c2506a]"
      : status.status === "closed"
        ? "bg-[#f4b860]/12 border-[#f4b860]/32 text-[#a06f1c]"
        : "bg-[#8e8999]/10 border-[#8e8999]/26 text-[#625d6d]";

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-[14px] border px-3.5 py-3 text-[13px] leading-relaxed",
        tone,
      )}
    >
      <span aria-hidden>⚠️</span>
      <div>
        <p className="font-medium">{status.warning}</p>
        <p className="mt-0.5 text-[12px] opacity-75">
          경고가 있어도 일정은 저장할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
