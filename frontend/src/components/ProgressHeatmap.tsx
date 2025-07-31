import { useEffect, useState } from "react";
import { Heatmap } from "./Heatmap"; // adjust the import path to your project

// Adjust this interface to match your backend DTO shape
interface ProgressSummaryDTO {
  date: string;             // ISO date string like "2025-07-31"
  totalTasks: number;
  completedTasks: number;
  taskTitles: string[];
}

// Helper: generate weeks array for a year (returns array of weeks; each week is array of 7 date strings or empty string for padding)
function generateWeeksForYear(year: number): string[][] {
  const weeks: string[][] = [];
  const start = new Date(year, 0, 1); // Jan 1
  const end = new Date(year, 11, 31); // Dec 31

  let current = new Date(start);
  // Move back to Sunday for week start (if not already Sunday)
  current.setDate(current.getDate() - current.getDay());

  while (current <= end) {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      if (current < start || current > end) {
        week.push(""); // empty cell for padding outside year
      } else {
        week.push(current.toISOString().slice(0, 10)); // yyyy-mm-dd
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function ProgressHeatmap() {
  const [data, setData] = useState<Map<string, number>>(new Map());
  const [taskDetails, setTaskDetails] = useState<Map<string, string[]>>(new Map());
  const [weeks, setWeeks] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Current year
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setWeeks(generateWeeksForYear(currentYear));
  }, [currentYear]);

  useEffect(() => {
    async function fetchSummary() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/progress/summary");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const summaries: ProgressSummaryDTO[] = await res.json();

        const dataMap = new Map<string, number>();
        const taskDetailsMap = new Map<string, string[]>();

        summaries.forEach(({ date, completedTasks, taskTitles }) => {
          dataMap.set(date, completedTasks);
          taskDetailsMap.set(date, taskTitles);
        });

        setData(dataMap);
        setTaskDetails(taskDetailsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return (
    <div>
      <h2 className="mb-4 font-semibold text-lg">My Progress Heatmap</h2>
      <Heatmap
        data={data}
        taskDetails={taskDetails}
        weeks={weeks}
        isLoading={isLoading}
        error={error || undefined}
      />
    </div>
  );
}
