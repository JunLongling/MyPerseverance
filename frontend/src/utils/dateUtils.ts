export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getMonthLabel(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { month: "short" });
}

/**
 * Generates dates for the entire year, grouped into weeks (7 days).
 * Weeks are padded with empty strings at start/end so each week has exactly 7 days.
 */
export function getDatesForYear(year: number): string[][] {
  const startDate = new Date(year, 0, 1); // Jan 1
  const endDate = new Date(year, 11, 31); // Dec 31

  const dates: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(formatDate(new Date(d)));
  }

  const weeks: string[][] = [];
  let week: string[] = [];

  // Pad first week with empty strings if Jan 1 is not Sunday
  const firstDayOfWeek = startDate.getDay(); // 0=Sun .. 6=Sat
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push("");
  }

  for (const date of dates) {
    week.push(date);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // Pad last week with empty strings if less than 7 days
  if (week.length > 0) {
    while (week.length < 7) {
      week.push("");
    }
    weeks.push(week);
  }

  return weeks;
}
