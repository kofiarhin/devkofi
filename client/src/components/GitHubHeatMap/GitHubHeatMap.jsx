// GitHubHeatMap.jsx
import React, { useMemo } from "react";
import "./gitHubHeatMap.styles.scss";

/**
 * Props:
 * - data: Array<{ date: string(YYYY-MM-DD), count: number }>
 * - startDate?: string(YYYY-MM-DD)
 * - endDate?: string(YYYY-MM-DD)
 * - weekStart?: 0|1  // 0=Sunday, 1=Monday
 * - maxLevels?: number
 * - onCellClick?: (cell: {date: string, count: number}) => void
 */
const GitHubHeatMap = ({
  data,
  startDate,
  endDate,
  weekStart = 0,
  maxLevels = 4,
  onCellClick,
}) => {
  const dataMap = useMemo(() => {
    const m = new Map();
    for (const d of data || []) {
      if (!d?.date) continue;
      m.set(toISO(d.date), Number(d.count || 0));
    }
    return m;
  }, [data]);

  const [rangeStart, rangeEnd] = useMemo(() => {
    const dates = [...dataMap.keys()].sort();
    const s = toISO(startDate || dates[0] || todayISO());
    const e = toISO(endDate || dates[dates.length - 1] || todayISO());
    return [s, e];
  }, [dataMap, startDate, endDate]);

  const firstDate = useMemo(() => {
    const d = new Date(rangeStart + "T00:00:00");
    const shift = (d.getDay() - weekStart + 7) % 7;
    d.setDate(d.getDate() - shift);
    return toISO(d);
  }, [rangeStart, weekStart]);

  const { weeks, maxCount } = useMemo(() => {
    const weeksArr = [];
    let cursor = new Date(firstDate + "T00:00:00");
    const last = new Date(rangeEnd + "T00:00:00");
    const tailShift = 6 - ((last.getDay() - weekStart + 7) % 7);
    last.setDate(last.getDate() + tailShift);

    let col = [];
    while (cursor <= last) {
      const iso = toISO(cursor);
      const count = dataMap.get(iso) || 0;
      col.push({
        date: iso,
        count,
        weekday: (cursor.getDay() - weekStart + 7) % 7,
      });

      const next = new Date(cursor);
      next.setDate(cursor.getDate() + 1);

      if (col.length === 7) {
        weeksArr.push(col);
        col = [];
      }
      cursor = next;
    }
    const max = Math.max(0, ...[...dataMap.values()]);
    return { weeks: weeksArr, maxCount: max };
  }, [dataMap, firstDate, rangeEnd, weekStart]);

  const levelFor = (count) => {
    if (!count) return 0;
    if (maxCount === 0) return 0;
    const ratio = count / maxCount;
    return Math.min(maxLevels, Math.max(1, Math.ceil(ratio * maxLevels)));
  };

  return (
    <div className="heatmap" role="grid" aria-label="Activity heatmap">
      <div className="monthRow" aria-hidden>
        {monthLabels(weeks, weekStart).map((m, i) => (
          <div className="monthCell" key={i}>
            {m.show ? m.label : ""}
          </div>
        ))}
      </div>

      <div className="grid">
        <div className="weekdayCol" aria-hidden>
          {weekdayOrder(weekStart).map((w) => (
            <div key={w} className="weekdayLabel">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][w]}
            </div>
          ))}
        </div>

        <div className="columns" role="rowgroup">
          {weeks.map((week, wi) => (
            <div className="col" role="row" key={wi}>
              {week.map((cell, ci) => {
                const level = levelFor(cell.count);
                const inRange =
                  cell.date >= rangeStart && cell.date <= rangeEnd;
                const title = `${cell.count} on ${formatReadable(cell.date)}`;
                return (
                  <button
                    key={ci}
                    type="button"
                    className={`cell lvl${level} ${
                      inRange ? "" : "outOfRange"
                    }`}
                    title={title}
                    aria-label={title}
                    onClick={() =>
                      onCellClick &&
                      onCellClick({ date: cell.date, count: cell.count })
                    }
                    data-date={cell.date}
                    data-count={cell.count}
                    disabled={!inRange}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="legend" aria-hidden>
        <span>Less</span>
        <span className="swatch lvl0" />
        {Array.from({ length: maxLevels }, (_, i) => (
          <span key={i} className={`swatch lvl${i + 1}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

/* Helpers */
const toISO = (input) => {
  if (!input) return todayISO();
  if (input instanceof Date) return input.toISOString().slice(0, 10);
  const parts = String(input).split("T")[0];
  const d = new Date(parts + "T00:00:00");
  if (isNaN(d)) return todayISO();
  return d.toISOString().slice(0, 10);
};

const todayISO = () => {
  const d = new Date();
  const off = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return off.toISOString().slice(0, 10);
};

const formatReadable = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const weekdayOrder = (weekStart) =>
  Array.from({ length: 7 }, (_, i) => (i + weekStart) % 7);

const monthLabels = (weeks) => {
  const labels = weeks.map((week) => {
    const firstInCol = week[0];
    const d = new Date(firstInCol.date + "T00:00:00");
    return {
      month: d.getMonth(),
      label: d.toLocaleString(undefined, { month: "short" }),
    };
  });
  const result = labels.map((_, i) => ({
    show: false,
    label: labels[i].label,
  }));
  for (let i = 1; i < labels.length; i++) {
    if (labels[i].month !== labels[i - 1].month) result[i].show = true;
  }
  if (result.length) result[0].show = true;
  return result;
};

export default GitHubHeatMap;
