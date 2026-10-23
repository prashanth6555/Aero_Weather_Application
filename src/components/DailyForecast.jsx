import { useApp } from '../context/AppContext';
import { dayLabel, formatTemp, toUnit } from '../utils/format';
import { weatherLabel } from '../utils/weather';
import WeatherIcon from './WeatherIcon';

export default function DailyForecast() {
  const { weather, unit } = useApp();
  if (!weather) return null;

  const days = weather.daily;
  const values = days.flatMap((day) => [toUnit(day.min, unit), toUnit(day.max, unit)]).filter((value) => value != null);
  const weekMin = values.length ? Math.min(...values) : 0;
  const weekMax = values.length ? Math.max(...values) : 1;
  const span = weekMax - weekMin || 1;

  return (
    <section className="glass glass-hover h-full rounded-[28px] p-4 sm:p-5" aria-label="7 day forecast">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] opacity-70">7-day forecast</h2>
      <div className="flex flex-col">
        {days.map((day, index) => {
          const min = toUnit(day.min, unit);
          const max = toUnit(day.max, unit);
          const left = ((min - weekMin) / span) * 100;
          const width = Math.max(((max - min) / span) * 100, 6);
          return (
            <article key={day.date} className="day-row flex items-center gap-2.5 px-1.5 py-2 sm:gap-3 sm:px-2">
              <div className="w-[5.4rem] shrink-0 sm:w-24">
                <p className="text-sm font-semibold">{dayLabel(day.date, index)}</p>
                <p className="truncate text-[11px] font-medium opacity-65 sm:hidden">{weatherLabel(day.code)}</p>
              </div>
              <WeatherIcon code={day.code} isDay className="h-9 w-9 shrink-0" />
              <p className="hidden min-w-0 flex-1 items-center gap-2 truncate text-sm font-medium opacity-75 sm:flex">
                <span className="truncate">{weatherLabel(day.code)}</span>
                {day.precipProbability >= 20 && (
                  <span className="shrink-0 text-xs font-semibold text-sky-800 dark:text-sky-200">{Math.round(day.precipProbability)}%</span>
                )}
              </p>
              <div className="ml-auto flex min-w-[5.5rem] flex-1 items-center gap-2 sm:w-52 sm:flex-none">
                <span className="w-8 text-right text-sm opacity-70">{min}°</span>
                <div className="temp-track hidden sm:block" aria-hidden="true">
                  <span className="temp-range" style={{ left: `${left}%`, width: `${width}%` }} />
                </div>
                <span className="w-8 text-right text-sm font-semibold">{max}°</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
