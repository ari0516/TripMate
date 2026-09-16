import type { BudgetSummary, Expense } from "./types";

/**
 * 일별 예산 사용 현황을 계산한다.
 * 02-wireframe.md §15 예산 계산식 기준.
 */
export function getBudgetSummary(
  budget: number,
  expenses: Expense[],
): BudgetSummary {
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - spent;
  const ratio = budget > 0 ? (spent / budget) * 100 : spent > 0 ? 100 : 0;
  const status = ratio >= 90 ? "danger" : ratio >= 80 ? "warning" : "normal";

  return { budget, spent, remaining, ratio, status };
}
