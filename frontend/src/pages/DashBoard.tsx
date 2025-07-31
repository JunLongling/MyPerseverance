import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUserProfile from "@/hooks/useFetchUserProfile";
import { Spinner } from "@/components/ui/Spinner";
import { Heatmap } from "@/components/Heatmap";
import { YearSelector } from "@/components/YearSelector";
import { getDatesForYear } from "@/utils/dateUtils";
import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";

export default function Dashboard() {
  const { user, loading, error } = useFetchUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Not loading and no user means not authenticated → redirect to signin
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const [selectedYear, setSelectedYear] = React.useState<"current" | number>("current");
  const year = selectedYear === "current" ? new Date().getFullYear() : selectedYear;

  const progressMap = React.useMemo(() => {
    const map = new Map<string, number>();
    return map;
  }, [year]);

  const weeks = React.useMemo(() => getDatesForYear(year), [year]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-lg text-red-600">Error: {error}</p>;

  // user guaranteed to be non-null here (otherwise redirected)

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center transition-colors duration-200">
        <header className="mb-8 w-full max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {user!.username}&apos;s Perseverance
          </h1>
        </header>

        <section className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <YearSelector
              value={selectedYear}
              onChange={setSelectedYear}
              profile={{ registeredAt: user!.registeredAt }}
            />
          </div>

          <div className="border border-purple-300 rounded-md p-4 shadow-sm bg-white">
            <Heatmap data={progressMap} weeks={weeks} />
          </div>
        </section>
      </div>
    </>
  );
}
