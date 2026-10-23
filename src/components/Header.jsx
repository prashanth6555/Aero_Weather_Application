import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LocateIcon, MoonMiniIcon, Spinner, SunMiniIcon } from './Icons';
import WeatherIcon from './WeatherIcon';
import SearchBar from './SearchBar';
import RecentCities from './RecentCities';

function useSlashFocus() {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      event.preventDefault();
      document.getElementById('city-search')?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

function UnitToggle() {
  const { unit, setUnit } = useApp();
  return (
    <div className="seg shrink-0" role="group" aria-label="Temperature unit">
      <span className={`seg-thumb ${unit === 'f' ? 'is-f' : ''}`} />
      <button type="button" className="seg-btn" aria-pressed={unit === 'c'} onClick={() => setUnit('c')}>°C</button>
      <button type="button" className="seg-btn" aria-pressed={unit === 'f'} onClick={() => setUnit('f')}>°F</button>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn h-10 w-10 shrink-0"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <SunMiniIcon key="sun" className="theme-pop h-5 w-5" /> : <MoonMiniIcon key="moon" className="theme-pop h-5 w-5" />}
    </button>
  );
}

function LocateButton() {
  const { detectLocation, locating } = useApp();
  return (
    <button
      type="button"
      className="icon-btn h-10 w-10 shrink-0"
      onClick={() => detectLocation({ initial: false })}
      disabled={locating}
      aria-label="Use current location"
    >
      {locating ? <Spinner className="h-4 w-4" /> : <LocateIcon className="h-5 w-5" />}
    </button>
  );
}

export default function Header() {
  useSlashFocus();

  return (
    <header className="topbar">
      <div className="flex w-full flex-col gap-3 px-3 py-3 sm:px-3.5 lg:px-4">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 shadow-sm dark:bg-white/10">
              <WeatherIcon code={0} isDay className="h-7 w-7" />
            </span>
            <span className="whitespace-nowrap text-lg font-semibold tracking-tight">Aero</span>
          </div>
          <div className="order-3 w-full min-w-0 md:order-none md:w-auto md:flex-1">
            <SearchBar />
          </div>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <UnitToggle />
            <ThemeToggle />
            <LocateButton />
          </div>
        </div>
        <RecentCities />
      </div>
    </header>
  );
}
