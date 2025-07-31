interface YearSelectorProps {
  value: "current" | number;
  onChange: (value: "current" | number) => void;
  profile: { registeredAt: string };
}

export function YearSelector({ value, onChange, profile }: YearSelectorProps) {
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
            {year === currentYear ? "This Year" : year}
          </button>
        );
      })}
    </nav>
  );
}
