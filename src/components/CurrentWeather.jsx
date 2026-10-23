import { useApp } from '../context/AppContext';
import { useNow } from '../hooks/useNow';
import {
  compass,
  formatClock,
  formatFullDate,
  formatPercent,
  formatPressure,
  formatTemp,
  formatTimeLabel,
  formatVisibility,
  formatWind,
  isoToMinutes,
  minutesInZone,
  placeSubtitle,
} from '../utils/format';
import { weatherLabel } from '../utils/weather';
import { ArrowUpIcon, DropletIcon, EyeIcon, GaugeIcon, WindIcon } from './Icons';
import WeatherIcon from './WeatherIcon';

function Stat({ icon, label, value, hint, extra }) {
  return (
    <div className="stat min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-60">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <p className="truncate text-base font-semibold sm:text-lg">{value}</p>
        {extra}
      </div>
      {hint ? <p className="text-xs font-medium opacity-60">{hint}</p> : null}
    </div>
  );
}

function Daylight({ sunrise, sunset, timeZone }) {
  const now = useNow(30000);
  const start = isoToMinutes(sunrise);
  const end = isoToMinutes(sunset);
  if (start == null || end == null || end <= start) {
    return (
      <div className="mt-4 flex justify-between text-sm font-medium">
        <span>Sunrise {formatTimeLabel(sunrise)}</span>
        <span>Sunset {formatTimeLabel(sunset)}</span>
      </div>
    );
  }

  const current = minutesInZone(now, timeZone);
  const progress = Math.min(1, Math.max(0, (current - start) / (end - start)));
  const angle = Math.PI * (1 - progress);
  const x = 100 + 70 * Math.cos(angle);
  const y = 88 - 70 * Math.sin(angle);
  const length = Math.PI * 70;

  return (
    <div className="mt-4">
      <svg viewBox="0 0 200 100" className="h-24 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="day-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
        <line x1="24" y1="88" x2="176" y2="88" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        <path d="M30 88 A70 70 0 0 0 170 88" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M30 88 A70 70 0 0 0 170 88"
          fill="none"
          stroke="url(#day-arc)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${length * progress} ${length}`}
        />
        <circle cx={x} cy={y} r="5.5" fill="#ffb703" stroke="#fff" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-xs font-semibold opacity-75 sm:text-sm">
        <span>Sunrise · {formatTimeLabel(sunrise)}</span>
        <span>Sunset · {formatTimeLabel(sunset)}</span>
      </div>
    </div>
  );
}

export default function CurrentWeather() {
  const { weather, unit } = useApp();
  const now = useNow(1000);
  if (!weather) return null;

  const { place, current, daily, timezone } = weather;
  const today = daily[0];
  const direction = compass(current.windDirection);

  return (
    <section className="flex h-full flex-col" aria-label="Current weather">
      <div className="sky-text">
        <div className="flex flex-wrap items-center gap-2">
          {place.isCurrent && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-2.5 py-1 text-xs font-semibold backdrop-blur dark:bg-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Current location
            </span>
          )}
        </div>
        <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{place.name}</h1>
        {placeSubtitle(place) && <p className="mt-1 text-sm font-medium opacity-75">{placeSubtitle(place)}</p>}
        <p className="mt-2 text-sm font-medium opacity-80 sm:text-base">
          {formatFullDate(now, timezone)} · {formatClock(now, timezone)}
        </p>
      </div>

      <div className="sky-text flex flex-1 flex-col items-center justify-center py-6 text-center sm:py-8">
        <div className="hero-icon">
          <WeatherIcon code={current.code} isDay={current.isDay} className="h-28 w-28 sm:h-36 sm:w-36" />
        </div>
        <p className="mt-2 text-7xl font-light tracking-tighter sm:text-8xl min-[1440px]:text-9xl">
          <span key={`${unit}-${toDisplay(current.temperature, unit)}`} className="pop-num">
            {formatTemp(current.temperature, unit)}
          </span>
          <span className="ml-1 align-top text-2xl font-medium tracking-normal sm:text-3xl">{unit === 'f' ? 'F' : 'C'}</span>
        </p>
        <p className="text-xl font-medium sm:text-2xl">{weatherLabel(current.code)}</p>
        <p className="mt-1 text-sm font-medium opacity-75 sm:text-base">
          Feels like {formatTemp(current.apparent, unit)}
          {today ? ` · H ${formatTemp(today.max, unit)} L ${formatTemp(today.min, unit)}` : ''}
        </p>
        {current.precipitation > 0 && (
          <p className="mt-1 text-sm font-medium opacity-75">{Number(current.precipitation).toFixed(1)} mm precipitation</p>
        )}
      </div>

      <div className="glass glass-hover rounded-[28px] p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat icon={<DropletIcon />} label="Humidity" value={formatPercent(current.humidity)} />
          <Stat
            icon={<WindIcon />}
            label="Wind"
            value={formatWind(current.windSpeed, unit)}
            hint={direction ? `From ${direction}` : ''}
            extra={direction ? (
              <ArrowUpIcon style={{ transform: `rotate(${current.windDirection}deg)` }} />
            ) : null}
          />
          <Stat icon={<EyeIcon />} label="Visibility" value={formatVisibility(current.visibility, unit)} />
          <Stat icon={<GaugeIcon />} label="Pressure" value={formatPressure(current.pressure)} />
        </div>
        {today?.sunrise && today?.sunset ? (
          <Daylight sunrise={today.sunrise} sunset={today.sunset} timeZone={timezone} />
        ) : null}
        <p className="mt-2 text-center text-[11px] font-medium opacity-55">Updated {formatTimeLabel(current.time)}</p>
      </div>
    </section>
  );
}

function toDisplay(celsius, unit) {
  return formatTemp(celsius, unit);
}
