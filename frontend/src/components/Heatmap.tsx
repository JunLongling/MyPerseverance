import React, { useState, useMemo } from "react";
import { weekdays, getMonthLabel } from "@/utils/dateUtils";
import { getColorForCount, type ColorPalette } from "@/utils/colorUtils";

interface HeatmapProps {
  data: Map<string, number>;
  taskDetails?: Map<string, string[]>;
  weeks: string[][];
  palette?: ColorPalette;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

const defaultPalette: ColorPalette = {
  zero: "bg-gray-300",
  one: "bg-purple-400",
  low: "bg-purple-600",
  medium: "bg-purple-800",
  high: "bg-pink-700",
};

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  taskDetails = new Map(),
  weeks,
  palette = defaultPalette,
  isLoading,
  error,
  className = "",
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseEnter = (
    date: string,
    _count: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    setHoveredDate(date);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
    setTooltipPos(null);
  };

  const monthPositions = useMemo(() => {
    const labels: string[] = [];
    let lastMonth = "";

    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i];
      const firstValidDate = week.find((d) => d !== "");
      if (firstValidDate) {
        const month = getMonthLabel(firstValidDate);
        if (month !== lastMonth) {
          labels.push(month);
          lastMonth = month;
        } else {
          labels.push("");
        }
      } else {
        labels.push("");
      }
    }

    const positions: { label: string; start: number; end: number }[] = [];
    let currentMonth = "";
    let startIndex = 0;

    for (let i = 0; i < labels.length; i++) {
      if (labels[i] && labels[i] !== currentMonth) {
        if (currentMonth) {
          positions.push({ label: currentMonth, start: startIndex, end: i - 1 });
        }
        currentMonth = labels[i];
        startIndex = i;
      }
    }
    if (currentMonth) {
      positions.push({ label: currentMonth, start: startIndex, end: labels.length - 1 });
    }

    return positions;
  }, [weeks]);

  if (isLoading) return <p className="text-gray-700">Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className={`relative font-sans text-xs text-gray-700 ${className}`}>
      <div className="overflow-x-auto pb-2">
        {/* Month Labels */}
        <div className="flex pl-[36px] mb-1 relative h-4 min-w-fit">
          {monthPositions.map((month, index) => {
            const width = (month.end - month.start + 1) * 19;
            const left = month.start * 19;
            return (
              <div
                key={index}
                className="absolute text-center text-[10px] text-gray-500 truncate"
                style={{ left: `${left}px`, width: `${width}px`, lineHeight: "1.2" }}
                aria-hidden="true"
              >
                {month.label}
              </div>
            );
          })}
        </div>

        <div className="flex gap-[4px] min-w-fit">
          {/* Weekday Labels */}
          <div className="grid grid-rows-7 gap-[4px] text-gray-500" style={{ width: 30 }}>
            {weekdays.map((wd, i) => (
              <div
                key={i}
                className="h-[14px] leading-none text-right pr-1"
                aria-label={wd}
                role="presentation"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex gap-[4px]">
            {weeks.map((week, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-[4px]">
                {week.map((date, rowIdx) => {
                  if (!date) {
                    return <div key={`${colIdx}-${rowIdx}`} className="w-[15px] h-[15px]" />;
                  }

                  const count = data.get(date) || 0;
                  const colorClass = getColorForCount(count, palette);

                  return (
                    <div
                      key={date}
                      className={`heatmap-cell w-[15px] h-[15px] rounded-sm transition-colors duration-200 ease-in-out cursor-pointer ${colorClass}`}
                      aria-label={`${date}: ${count} tasks completed`}
                      role="img"
                      onMouseEnter={(e) => handleMouseEnter(date, count, e)}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={(e) => handleMouseEnter(date, count, e as any)}
                      onTouchEnd={handleMouseLeave}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDate && tooltipPos && (
        <div
          style={{
            position: "fixed",
            top: Math.max(tooltipPos.y - 30, 8),
            left: tooltipPos.x,
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "white",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 10,
            whiteSpace: "pre-line",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1000,
            maxWidth: "80vw",
          }}
        >
          {formatTooltip(hoveredDate, data.get(hoveredDate) ?? 0, taskDetails.get(hoveredDate) ?? [])}
        </div>
      )}

      <style>{`
        .heatmap-cell:hover {
          outline: 2px solid #db2777;
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
};

function formatTooltip(dateStr: string, count: number, titles: string[]) {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formatted = formatter.format(date);

  const taskLines = titles.map((t) => `• ${t}`).join("\n");
  return `${count} task${count !== 1 ? "s" : ""} completed on ${formatted}${
    titles.length ? "\n" + taskLines : ""
  }`;
}
