import { COUNTRY_INFO, CURRENCY_STYLE } from "./constants";
import { formatNumber } from "./date";
import type { Country, CurrencyCode } from "./types";

export function currencyOf(country: Country): CurrencyCode {
  return COUNTRY_INFO[country].currency;
}

/** 금액을 해당 통화 표기(기호 위치 포함)로 포맷한다. 예: formatMoney(18000, "JPY") → "¥18,000" */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  const { symbol, position } = CURRENCY_STYLE[currency];
  const formatted = formatNumber(amount);
  return position === "prefix" ? `${symbol}${formatted}` : `${formatted}${symbol}`;
}
