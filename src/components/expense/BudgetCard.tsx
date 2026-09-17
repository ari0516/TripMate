import { BUDGET_STATUS_STYLE } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/currency";
import type { BudgetSummary, CurrencyCode } from "@/lib/types";

/**
 * 일별 예산 사용 현황 카드.
 * 01-feature-spec.md §5-2 / 02-wireframe.md §15 기준.
 */
export function BudgetCard({
  summary,
  currency,
}: {
  summary: BudgetSummary;
  currency: CurrencyCode;
}) {
  const style = BUDGET_STATUS_STYLE[summary.status];

  return (
    <div className="glass-base space-y-3 rounded-[20px] p-4">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-[#918b9c]">
          일일 예산{" "}
          <span className="font-semibold text-[#292533]">
            {formatMoney(summary.budget, currency)}
          </span>
        </span>
        <span className="text-[#918b9c]">
          사용 금액{" "}
          <span className="font-semibold text-[#292533]">
            {formatMoney(summary.spent, currency)}
          </span>
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className={cn("h-full rounded-full transition-[width]", style.bar)}
          style={{ width: `${Math.min(summary.ratio, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[12px]">
        <span className={cn("inline-flex items-center gap-1 font-semibold", style.text)}>
          {Math.round(summary.ratio)}%
          {style.label ? (
            <span
              className={cn(
                "ml-1 rounded-full border px-1.5 py-0.5 text-[11px]",
                style.chip,
              )}
            >
              ⚠️ {style.label}
            </span>
          ) : null}
        </span>
        <span className="text-[#918b9c]">
          남은 예산{" "}
          <span className="font-semibold text-[#292533]">
            {formatMoney(summary.remaining, currency)}
          </span>
        </span>
      </div>
    </div>
  );
}
