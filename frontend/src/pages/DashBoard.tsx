import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUserProfile from "@/hooks/useFetchUserProfile";
import { Spinner } from "@/components/ui/Spinner";
import { Heatmap } from "@/components/Heatmap";
import { getDatesForYear } from "@/utils/dateUtils";
import DashboardNavbar from "@/components/DashboardNavbar";
import React from "react";

interface YearSelectorProps {
  value: "current" | number;
  onChange: (value: "current" | number) => void;
  profile: { registeredAt: string };
}

function YearSelector({ value, onChange, profile }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();

  let registeredYear = currentYear;
  if (profile.registeredAt) {
    const parsedYear = new Date(profile.registeredAt).getFullYear();
    if (!isNaN(parsedYear)) {
      registeredYear = parsedYear;
    }
  }

  const years = [];
  for (let y = currentYear; y >= registeredYear; y--) {
    years.push(y);
  }

  return (
    <nav
      aria-label="Select year"
      className="flex flex-wrap gap-2 justify-center sm:justify-start"
    >
      {years.map((year) => {
        const isSelected = value === year || (value === "current" && year === currentYear);
        return (
          <button
            key={year}
            type="button"
            onClick={() => onChange(year === currentYear ? "current" : year)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition 
              ${
                isSelected
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
            aria-current={isSelected ? "true" : undefined}
          >
            {year}
          </button>
        );
      })}
    </nav>
  );
}

export default function Dashboard() {
  const { user, loading, error } = useFetchUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Not loading and no user means not authenticated → redirect to signin or landing
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
          <div className="mb-4">
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
