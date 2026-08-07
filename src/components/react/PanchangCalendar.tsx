import { useMemo, useState } from "react";

interface CalendarEntry {
  date: string;
  festival: string;
  tithi: string;
  nakshatra: string;
  type: string;
  note: string;
}

interface CalendarData {
  yearLabel: string;
  startNote: string;
  entries: CalendarEntry[];
}

interface Props {
  data: CalendarData;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TYPE_COLORS: Record<string, string> = {
  festival: "bg-maroon/15 text-maroon border-maroon/25",
  national: "bg-teal-deep/10 text-teal-deep border-teal-deep/20",
  session: "bg-gold/15 text-gold border-gold/30",
};

export default function PanchangCalendar({ data }: Props) {
  const [viewDate, setViewDate] = useState(() => new Date(2026, 2, 1));

  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry>();
    data.entries.forEach((e) => map.set(e.date, e));
    return map;
  }, [data.entries]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const upcoming = data.entries
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 5);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="manuscript-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={prevMonth}
            className="btn-ghost !px-3 !py-1 text-lg"
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="text-center">
            <p className="section-label">Pañcāṅga</p>
            <h3 className="font-display text-2xl text-maroon-deep">
              {MONTHS[month]} {year}
            </h3>
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="btn-ghost !px-3 !py-1 text-lg"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center font-ui text-xs text-stone-light mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const entry = entriesByDate.get(dateStr);
            const isToday =
              new Date().toDateString() === new Date(dateStr).toDateString();

            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-sm text-sm transition-colors ${
                  entry
                    ? "bg-gold/20 text-maroon-deep font-medium"
                    : "hover:bg-parchment-dark/50 text-stone"
                } ${isToday ? "ring-1 ring-maroon/40" : ""}`}
                title={entry?.festival || undefined}
              >
                <span>{day}</span>
                {entry && (
                  <span className="mt-0.5 h-1 w-1 rounded-full bg-maroon" />
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-stone-light font-ui text-center">
          {data.startNote}
        </p>
      </div>

      <aside className="space-y-6">
        <div className="manuscript-card p-6">
          <p className="section-label mb-2">Cycle</p>
          <h3 className="font-display text-xl text-maroon-deep">
            {data.yearLabel}
          </h3>
        </div>

        <div className="manuscript-card p-6">
          <p className="section-label mb-4">Upcoming</p>
          <ul className="space-y-4">
            {upcoming.map((e) => (
              <li key={e.date} className="border-b border-stone/10 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-maroon">{e.festival}</span>
                  <span
                    className={`shrink-0 rounded-sm border px-2 py-0.5 text-[10px] font-ui uppercase tracking-wider ${
                      TYPE_COLORS[e.type] || TYPE_COLORS.festival
                    }`}
                  >
                    {e.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-light">
                  {new Date(e.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {e.tithi && ` · ${e.tithi}`}
                </p>
                {e.note && (
                  <p className="mt-1 text-xs text-stone italic">{e.note}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
