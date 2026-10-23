import { useApp } from '../context/AppContext';
import { POPULAR_CITIES } from '../utils/weather';
import { ChevronIcon, Spinner } from './Icons';

export function LoadingBar() {
  return <div className="loader-bar" role="progressbar" aria-label="Updating weather" />;
}

export function Skeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-12" role="status" aria-label="Loading weather">
      <div className="glass skeleton flex min-h-[420px] items-end rounded-[28px] p-6 lg:col-span-5">
        <p className="relative z-10 text-sm font-semibold opacity-75">Finding your local weather…</p>
      </div>
      <div className="flex flex-col gap-3 lg:col-span-7">
        <div className="glass skeleton h-40 rounded-[28px]" />
        <div className="glass skeleton h-72 rounded-[28px]" />
      </div>
    </div>
  );
}

function CityGrid() {
  const { openCity, busyCity } = useApp();
  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {POPULAR_CITIES.map((city) => (
        <button
          key={city}
          type="button"
          className="city-tile flex items-center justify-between rounded-2xl border border-white/50 bg-white/35 px-3 py-3 text-left dark:border-white/10 dark:bg-white/5"
          onClick={() => openCity(city)}
          disabled={busyCity === city}
        >
          <span>
            <span className="block text-sm font-semibold">{city}</span>
            <span className="block text-xs opacity-60">View forecast</span>
          </span>
          {busyCity === city ? <Spinner className="h-4 w-4" /> : <ChevronIcon className="h-4 w-4 opacity-70" />}
        </button>
      ))}
    </div>
  );
}

export function EmptyState() {
  const { detectLocation, locating } = useApp();
  return (
    <div className="grid w-full grid-cols-1 items-start gap-3 lg:grid-cols-12 lg:gap-4">
      <section className="rise sky-text flex min-h-[320px] flex-col justify-end px-1 pb-2 lg:col-span-5 lg:min-h-[560px]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">Live sky</p>
        <h1 className="mt-2 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Weather, wherever you are.</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
          Search for a city above, or use your current location to see temperature, wind, humidity, and the next seven days.
        </p>
        <button
          type="button"
          className="btn mt-5 w-fit rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
          onClick={() => detectLocation({ initial: false })}
          disabled={locating}
        >
          {locating ? 'Locating…' : 'Use current location'}
        </button>
      </section>
      <section className="rise glass rounded-[28px] p-4 sm:p-5 lg:col-span-7" style={{ animationDelay: '90ms' }}>
        <h2 className="text-lg font-semibold">Popular cities</h2>
        <p className="mt-1 text-sm opacity-70">Choose a city to load a live forecast.</p>
        <CityGrid />
      </section>
    </div>
  );
}

export function ErrorState() {
  const { error, retry, locating } = useApp();
  return (
    <div className="grid w-full gap-3">
      <section className="glass rise w-full rounded-[28px] px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-semibold">We couldn&apos;t load the weather</h1>
        <p className="mt-2 max-w-xl text-sm opacity-75">{error || 'Please try again in a moment.'}</p>
        <button
          type="button"
          className="btn mt-5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
          onClick={retry}
          disabled={locating}
        >
          Try again
        </button>
      </section>
      <section className="glass rounded-[28px] p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Or try a city</h2>
        <CityGrid />
      </section>
    </div>
  );
}

export function InlineError({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-rose-600/92 px-4 py-3 text-sm font-medium text-white" role="alert">
      <p>{message}</p>
      <button type="button" className="rounded-full bg-white/15 px-3 py-1.5" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
