export function formatMoney(
  value: string | number,
  options: Intl.NumberFormatOptions & { locales?: Intl.LocalesArgument } = { locales: "en-GH" }
) {
  if (isNaN(Number(value))) return "-";

  const { locales, ...rest } = options;

  return new Intl.NumberFormat(locales, {
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
    currency: "GHS",
    style: "currency",
    ...rest,
  }).format(Number(value));
}
