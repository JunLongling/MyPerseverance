import { useEffect, useState, useMemo, useCallback } from "react";
import useFetchUserProfile from "@/hooks/useFetchUserProfile";
import { Spinner } from "@/components/ui/Spinner";
import { Heatmap } from "@/components/Heatmap";
import { palettes } from "@/utils/colorUtils";
import type { PaletteName } from "@/utils/colorUtils";
import { getDatesForYear } from "@/utils/dateUtils";
import DashboardNavbar from "@/components/DashboardNavbar";
import TodayTaskList from "@/components/TodayTaskList";
import { YearSelector } from "@/components/YearSelector";
import axiosClient from "@/api/axiosClient";
import { PaletteSelector } from "@/components/PaletteSelector";

export default function Dashboard() {
  const { user, loading, error } = useFetchUserProfile();

  const [selectedYear, setSelectedYear] = useState<"current" | number>("current");
  const year = useMemo(
    () => (selectedYear === "current" ? new Date().getFullYear() : selectedYear),
    [selectedYear]
  );

  const [progressMap, setProgressMap] = useState<Map<string, number>>(new Map());
  const [taskDetails, setTaskDetails] = useState<Map<string, string[]>>(new Map());
  const [loadingProgress, setLoadingProgress] = useState(false);

  const [selectedPalette, setSelectedPalette] = useState<PaletteName>("lavender");

  const weeks = useMemo(() => getDatesForYear(year), [year]);

  const fetchProgressData = useCallback(async () => {
    if (!user) return;

    setLoadingProgress(true);
    try {
      const res = await axiosClient.get(
        `/progress/summary?startDate=${year}-01-01&endDate=${year}-12-31`
      );

      const map = new Map<string, number>();
      const details = new Map<string, string[]>();

      for (const item of res.data) {
        map.set(item.date, item.completedTasks);
        details.set(item.date, item.taskTitles || []);
      }

      setProgressMap(map);
      setTaskDetails(details);
    } catch (e) {
      console.error("Error fetching progress summary", e);
    } finally {
      setLoadingProgress(false);
    }
  }, [user, year]);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [fetchProgressData, user]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!user) return <p className="text-center">No user loaded</p>;

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen px-4 py-8 bg-gray-50 flex flex-col items-center">
        <header className="mb-8 w-full max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {user.username}&apos;s Perseverance
          </h1>
        </header>

        <section className="w-full max-w-6xl space-y-6">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md space-y-6">
            <PaletteSelector
              selectedPalette={selectedPalette}
              onChange={setSelectedPalette}
            />
            <YearSelector
              value={selectedYear}
              onChange={setSelectedYear}
              profile={{ registeredAt: user.registeredAt }}
            />

            <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              {loadingProgress ? (
                <p className="text-center text-gray-500">Loading heatmap...</p>
              ) : (
                <Heatmap
                  data={progressMap}
                  taskDetails={taskDetails}
                  weeks={weeks}
                  palette={palettes[selectedPalette]}
                />
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Today's Tasks</h2>
            <TodayTaskList onTaskStatusChange={fetchProgressData} />
          </div>
        </section>
      </div>
    </>
  );
}
