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
    <select
      className="border px-4 py-2 rounded-md text-sm"
      value={value === "current" ? currentYear : value}
      onChange={(e) => {
        const selected = parseInt(e.target.value, 10);
        onChange(selected === currentYear ? "current" : selected);
      }}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year === currentYear ? "This Year" : year}
        </option>
      ))}
    </select>
  );
}
