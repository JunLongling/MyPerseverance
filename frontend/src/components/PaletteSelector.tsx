import { palettes } from "@/utils/colorUtils";
import type { PaletteName } from "@/utils/colorUtils";

const depthLabels = ["Zero", "One", "Low", "Medium", "High"];

interface PaletteSelectorProps {
  selectedPalette: PaletteName;
  onChange: (paletteName: PaletteName) => void;
}

export function PaletteSelector({ selectedPalette, onChange }: PaletteSelectorProps) {
  return (
    <div className="overflow-x-auto py-2 -mx-4 px-4 sm:overflow-visible sm:py-0 sm:px-0">
      <div className="flex gap-6 min-w-max">
        {Object.entries(palettes).map(([name, colors]) => (
          <div
            key={name}
            className="text-center cursor-pointer select-none flex-shrink-0"
          >
            <div
              className={`mb-2 text-sm capitalize ${
                selectedPalette === name ? "font-bold text-gray-900" : "text-gray-500"
              }`}
              onClick={() => onChange(name as PaletteName)}
            >
              {name}
            </div>
            <div className="flex gap-1 justify-center">
              {Object.values(colors).map((tailwindClass, i) => (
                <div
                  key={i}
                  title={depthLabels[i]}
                  className={`w-6 h-6 rounded ${tailwindClass}`}
                  onClick={() => onChange(name as PaletteName)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
