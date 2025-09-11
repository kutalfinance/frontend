export function formatMoney(
  value: string | number,
  options?: { locales: Intl.LocalesArgument; currency: string }
) {
  if (isNaN(Number(value))) return "-";

  let currency = "NGN";
  let locales: Intl.LocalesArgument = "en-NG";

  if (options) {
    locales = options.locales;
    currency = options.currency;
  }

  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
  }).format(Number(value));
}
