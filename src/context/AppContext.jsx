import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchForecast, reverseGeocode, searchCities } from '../services/weatherApi';
import { getScene, weatherLabel } from '../utils/weather';
import { toUnit } from '../utils/format';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

function cleanRecent(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((city) => city && city.name && Number.isFinite(Number(city.latitude)) && Number.isFinite(Number(city.longitude)))
    .slice(0, 6);
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(
    'aero-theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const [unit, setUnit] = useLocalStorage('aero-unit', 'c');
  const [recent, setRecent] = useLocalStorage('aero-recent', []);
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [busyCity, setBusyCity] = useState('');
  const weatherRef = useRef(null);
  const requestId = useRef(0);
  const lastPlace = useRef(null);

  weatherRef.current = weather;

  const safeTheme = theme === 'dark' ? 'dark' : 'light';
  const safeUnit = unit === 'f' ? 'f' : 'c';
  const safeRecent = cleanRecent(recent);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', safeTheme === 'dark');
    document.documentElement.style.colorScheme = safeTheme;
  }, [safeTheme]);

  const remember = useCallback((place) => {
    const entry = {
      id: String(place.id),
      name: place.name,
      admin1: place.admin1 || '',
      country: place.country || '',
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
    };
    setRecent((prev) => [entry, ...cleanRecent(prev).filter((city) => city.id !== entry.id)].slice(0, 6));
  }, [setRecent]);

  const loadPlace = useCallback(async (place) => {
    const latitude = Number(place?.latitude);
    const longitude = Number(place?.longitude);
    if (!place || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setSearchError('That city could not be loaded. Try another search.');
      if (!weatherRef.current) setStatus('empty');
      return;
    }

    const id = ++requestId.current;
    lastPlace.current = place;
    setError('');
    setSearchError('');
    if (weatherRef.current) setIsRefreshing(true);
    else setStatus('loading');

    try {
      const data = await fetchForecast({ ...place, latitude, longitude });
      if (id !== requestId.current) return;
      weatherRef.current = data;
      setWeather(data);
      setStatus('ready');
      remember({ ...place, latitude, longitude, name: data.place.name });
    } catch (err) {
      if (err?.name === 'AbortError') return;
      if (id !== requestId.current) return;
      setError('Weather data is unavailable right now. Please try again.');
      if (!weatherRef.current) setStatus('error');
    } finally {
      if (id === requestId.current) {
        setIsRefreshing(false);
        setLocating(false);
      }
    }
  }, [remember]);

  const detectLocation = useCallback(({ initial = false, isActive = () => true } = {}) => {
    if (!navigator.geolocation) {
      if (isActive()) {
        setLocating(false);
        if (!weatherRef.current) setStatus('empty');
        if (!initial) setSearchError('This browser cannot detect your location. Search for a city instead.');
      }
      return;
    }

    setLocating(true);
    if (!initial) setSearchError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!isActive()) return;
        const { latitude, longitude } = position.coords;
        try {
          const place = await reverseGeocode(latitude, longitude);
          if (!isActive()) return;
          await loadPlace(place);
        } catch (err) {
          if (err?.name === 'AbortError' || !isActive()) return;
          await loadPlace({
            id: `geo:${latitude.toFixed(3)},${longitude.toFixed(3)}`,
            name: 'Current location',
            admin1: '',
            country: '',
            latitude,
            longitude,
            isCurrent: true,
          });
        }
      },
      (err) => {
        if (!isActive()) return;
        setLocating(false);
        if (!weatherRef.current) setStatus('empty');
        if (!initial) {
          const denied = err?.code === 1;
          setSearchError(
            denied
              ? 'Location permission was blocked. Search for a city instead.'
              : 'We could not detect your location. Search for a city instead.',
          );
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [loadPlace]);

  const openCity = useCallback(async (name) => {
    setBusyCity(name);
    setSearchError('');
    try {
      const results = await searchCities(name);
      const place = results.find((item) => item.name.toLowerCase() === name.toLowerCase()) || results[0];
      if (!place) {
        setSearchError(`No cities found for “${name}”.`);
        return;
      }
      await loadPlace(place);
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setSearchError('Search is unavailable right now. Please try again.');
    } finally {
      setBusyCity('');
    }
  }, [loadPlace]);

  const retry = useCallback(() => {
    if (lastPlace.current) loadPlace(lastPlace.current);
    else detectLocation({ initial: false });
  }, [detectLocation, loadPlace]);

  const removeRecent = useCallback((id) => {
    setRecent((prev) => cleanRecent(prev).filter((city) => city.id !== id));
  }, [setRecent]);

  const toggleTheme = useCallback(() => {
    setTheme(safeTheme === 'dark' ? 'light' : 'dark');
  }, [safeTheme, setTheme]);

  useEffect(() => {
    let active = true;
    detectLocation({ initial: true, isActive: () => active });
    return () => {
      active = false;
    };
  }, [detectLocation]);

  useEffect(() => {
    if (status !== 'loading') return undefined;
    const timer = setTimeout(() => {
      if (!weatherRef.current) setStatus('empty');
    }, 12000);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!weather) {
      document.title = 'Aero — Weather';
      return;
    }
    const temp = toUnit(weather.current.temperature, safeUnit);
    document.title = `${temp}° ${weatherLabel(weather.current.code)} · ${weather.place.name} — Aero`;
  }, [safeUnit, weather]);

  const scene = weather ? getScene(weather.current.code, weather.current.isDay) : 'partly-day';

  const value = useMemo(() => ({
    theme: safeTheme,
    unit: safeUnit,
    toggleTheme,
    setUnit,
    recent: safeRecent,
    removeRecent,
    weather,
    scene,
    status,
    error,
    searchError,
    setSearchError,
    isRefreshing,
    locating,
    busyCity,
    loadPlace,
    openCity,
    detectLocation,
    retry,
  }), [
    busyCity,
    detectLocation,
    error,
    isRefreshing,
    loadPlace,
    locating,
    openCity,
    removeRecent,
    retry,
    safeRecent,
    safeTheme,
    safeUnit,
    scene,
    searchError,
    setUnit,
    status,
    toggleTheme,
    weather,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
