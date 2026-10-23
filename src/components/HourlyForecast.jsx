import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTemp, hourLabel } from '../utils/format';
import { ChevronIcon } from './Icons';
import WeatherIcon from './WeatherIcon';

export default function HourlyForecast() {
  const { weather, unit } = useApp();
  const scroller = useRef(null);
  const [edges, setEdges] = useState({ left: true, right: false });
  const hourly = weather?.hourly ?? [];

  useEffect(() => {
    const element = scroller.current;
    if (!element) return undefined;
    const update = () => {
      setEdges({
        left: element.scrollLeft <= 4,
        right: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
      });
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      element.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [hourly]);

  if (!weather) return null;

  const scrollBy = (direction) => {
    scroller.current?.scrollBy({ left: direction * 280, behavior: 'smooth' });
  };

  return (
    <section className="glass glass-hover rounded-[28px] p-4 sm:p-5" aria-label="Hourly forecast">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] opacity-70">Hourly forecast</h2>
        <div className="hidden gap-1.5 sm:flex">
          <button type="button" className="icon-btn h-8 w-8" onClick={() => scrollBy(-1)} disabled={edges.left} aria-label="Earlier hours">
            <ChevronIcon direction="left" />
          </button>
          <button type="button" className="icon-btn h-8 w-8" onClick={() => scrollBy(1)} disabled={edges.right} aria-label="Later hours">
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
      <div ref={scroller} className="hour-scroller no-scrollbar">
        {hourly.map((hour, index) => (
          <article key={hour.time} className="hour-card lift">
            <p className="text-[11px] font-semibold uppercase tracking-wide opacity-65">{hourLabel(hour.time, index)}</p>
            <WeatherIcon code={hour.code} isDay={hour.isDay} className="mx-auto my-1.5 h-8 w-8" />
            <p className="text-sm font-semibold">{formatTemp(hour.temperature, unit)}</p>
            <p className="mt-1 h-4 text-[11px] font-semibold text-sky-800 dark:text-sky-200">
              {hour.precipProbability > 0 ? `${Math.round(hour.precipProbability)}%` : ''}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
