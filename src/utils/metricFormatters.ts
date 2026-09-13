export function formatThresholdCount(count: number): string {
  if (count < 10) return String(count);
  return `${Math.floor(count / 10) * 10}+`;
}

export function formatYearsExperience(startDate: string, now = new Date()): string {
  const start = new Date(startDate);
  let totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();

  if (now.getDate() < start.getDate()) {
    totalMonths -= 1;
  }

  const years = Math.floor(totalMonths / 12);
  return `${years}${totalMonths % 12 > 0 ? '+' : ''}`;
}
