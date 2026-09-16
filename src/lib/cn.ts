/** 조건부 className 병합용 초경량 헬퍼 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
