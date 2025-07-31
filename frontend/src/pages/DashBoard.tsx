import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUserProfile from "@/hooks/useFetchUserProfile";
import { Spinner } from "@/components/ui/Spinner";
import { Heatmap } from "@/components/Heatmap";
import { getDatesForYear } from "@/utils/dateUtils";
import DashboardNavbar from "@/components/DashboardNavbar";
import TodayTaskList from "@/components/TodayTaskList";
import { YearSelector } from "@/components/YearSelector";
import axiosClient from "@/api/axiosClient";

export default function Dashboard() {
  const { user, loading, error } = useFetchUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const [selectedYear, setSelectedYear] = useState<"current" | number>("current");
  const year = selectedYear === "current" ? new Date().getFullYear() : selectedYear;

  // Map date -> completed tasks count
  const [progressMap, setProgressMap] = useState<Map<string, number>>(new Map());
  // Map date -> array of completed task titles for tooltip
  const [taskDetails, setTaskDetails] = useState<Map<string, string[]>>(new Map());

  const [loadingProgress, setLoadingProgress] = useState(false);

  const weeks = useMemo(() => getDatesForYear(year), [year]);

  const refreshProgressMap = useCallback(async () => {
    setLoadingProgress(true);
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      const res = await axiosClient.get(`/progress/summary?startDate=${startDate}&endDate=${endDate}`);

      const map = new Map<string, number>();
      const detailsMap = new Map<string, string[]>();

      for (const item of res.data) {
        map.set(item.date, item.completedTasks);
        detailsMap.set(item.date, item.taskTitles || []);
      }

      setProgressMap(map);
      setTaskDetails(detailsMap);
    } catch (err) {
      console.error("Failed to refresh progress data", err);
    } finally {
      setLoadingProgress(false);
    }
  }, [year]);

  useEffect(() => {
    if (user) {
      refreshProgressMap();
    }
  }, [user, refreshProgressMap]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-lg text-red-600">Error: {error}</p>;

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center transition-colors duration-200">
        <header className="mb-8 w-full max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {user!.username}&apos;s Perseverance
          </h1>
        </header>

        <section className="w-full max-w-6xl space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <YearSelector
              value={selectedYear}
              onChange={setSelectedYear}
              profile={{ registeredAt: user!.registeredAt }}
            />

            <div className="mt-4 border border-purple-300 rounded-md p-4 shadow-sm bg-white min-h-[120px]">
              {loadingProgress ? (
                <p className="text-center text-gray-500">Loading heatmap...</p>
              ) : (
                <Heatmap
                  data={progressMap}
                  taskDetails={taskDetails}
                  weeks={weeks}
                />
              )}
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
            <TodayTaskList onTaskStatusChange={refreshProgressMap} />
          </div>
        </section>
      </div>
    </>
  );
}
