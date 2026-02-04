export function formatDate(dateInput: string) {
  const date = new Date(dateInput);
  const options = {
    month: "long" as any,
    day: "numeric" as any,
    year: "numeric" as any,
  };

  return date.toLocaleDateString("en-US", options);
}

/** Return ISO 8601 string for a date; fallback to now if invalid. */
export function toISO8601(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}
