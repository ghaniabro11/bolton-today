export function formatDate(dateInput: string) {
  const date = new Date(dateInput);
  const options = {
    month: "long" as any,
    day: "numeric" as any,
    year: "numeric" as any,
  };

  return date.toLocaleDateString("en-US", options);
}
