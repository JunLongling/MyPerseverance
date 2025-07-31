import { useState, useMemo } from "react";
import useFetchUserProfile from "@/hooks/useFetchUserProfile";
import { Spinner } from "@/components/ui/Spinner";
import { Heatmap } from "@/components/Heatmap";
import { YearSelector } from "@/components/YearSelector";
import { getDatesForYear } from "@/utils/dateUtils";

export default function Dashboard() {
  const { user, loading, error } = useFetchUserProfile();

  const [selectedYear, setSelectedYear] = useState<"current" | number>("current");
  const year = selectedYear === "current" ? new Date().getFullYear() : selectedYear;

  // Example: Replace with your real progress data fetching logic
  const progressMap = useMemo(() => {
    // dummy data for demo - ideally fetch or compute this based on user and year
    const map = new Map<string, number>();
    // e.g. map.set("2025-07-31", 3);
    return map;
  }, [year]);

  // Generate weeks grouped dates for selected year
  const weeks = useMemo(() => getDatesForYear(year), [year]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-lg text-red-600">Error: {error}</p>;
  if (!user) return <p className="text-center text-lg">No user data found.</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center transition-colors duration-200">
      <header className="mb-8 w-full max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {user.username}&apos;s Dashboard
        </h1>
        <p className="text-gray-600">Email: {user.email}</p>
      </header>

      <section className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <YearSelector value={selectedYear} onChange={setSelectedYear} profile={{ registeredAt: user.registeredAt }} />
        </div>

        <div className="border border-purple-300 rounded-md p-4 shadow-sm bg-white">
          <Heatmap data={progressMap} weeks={weeks} />
        </div>
      </section>
    </div>
  );
}
