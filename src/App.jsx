import { Component } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import WeatherBackground from './components/WeatherBackground';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import { EmptyState, ErrorState, InlineError, LoadingBar, Skeleton } from './components/States';
import { formatTemp } from './utils/format';
import { weatherLabel } from './utils/weather';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-dvh w-full place-items-center bg-slate-950 px-4 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-white/70">Reload Aero to fetch the forecast again.</p>
            <button
              type="button"
              className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ErrorBoundary>
  );
}

function Shell() {
  const { weather, status, scene, isRefreshing, error, retry, unit } = useApp();

  return (
    <div className="app-root relative min-h-dvh w-full text-slate-900 dark:text-slate-50">
      <WeatherBackground scene={scene} />
      {isRefreshing && <LoadingBar />}
      <div className="relative z-10 flex min-h-dvh w-full flex-col">
        <Header />
        <main className="w-full flex-1 px-3 pb-2 pt-3 sm:px-3.5 lg:px-4" aria-busy={status === 'loading'}>
          <p className="sr-only" aria-live="polite">
            {weather
              ? `${weather.place.name}, ${formatTemp(weather.current.temperature, unit)}, ${weatherLabel(weather.current.code)}`
              : 'Loading weather'}
          </p>
          {error && weather ? (
            <div className="mb-3">
              <InlineError message={error} onRetry={retry} />
            </div>
          ) : null}
          {status === 'loading' && !weather ? <Skeleton /> : null}
          {status === 'empty' && !weather ? <EmptyState /> : null}
          {status === 'error' && !weather ? <ErrorState /> : null}
          {weather ? (
            <div key={weather.place.id} className="grid w-full grid-cols-1 items-start gap-3 lg:grid-cols-12 lg:gap-4">
              <div className="rise min-w-0 lg:col-span-5" style={{ animationDelay: '40ms' }}>
                <CurrentWeather />
              </div>
              <div className="flex min-w-0 flex-col gap-3 lg:col-span-7 lg:gap-4">
                <div className="rise" style={{ animationDelay: '110ms' }}>
                  <HourlyForecast />
                </div>
                <div className="rise" style={{ animationDelay: '170ms' }}>
                  <DailyForecast />
                </div>
              </div>
            </div>
          ) : null}
        </main>
        <footer className="px-3 pb-3 text-center text-[11px] font-medium tracking-wide opacity-60 sm:text-xs">
          Live forecast data from Open-Meteo
        </footer>
      </div>
    </div>
  );
}
