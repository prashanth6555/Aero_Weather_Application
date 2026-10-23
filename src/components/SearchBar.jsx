import { useEffect, useState } from 'react';
import { searchCities } from '../services/weatherApi';
import { useApp } from '../context/AppContext';
import { placeSubtitle } from '../utils/format';
import { SearchIcon, Spinner } from './Icons';

export default function SearchBar() {
  const { loadPlace, searchError, setSearchError, isRefreshing } = useApp();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [searching, setSearching] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setSearching(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchCities(trimmed, controller.signal);
        setSuggestions(results);
        setHighlight(0);
        setOpen(results.length > 0);
        setLocalError(results.length ? '' : `No cities found for “${trimmed}”. Check the spelling and try again.`);
      } catch (err) {
        if (err?.name === 'AbortError') return;
        setSuggestions([]);
        setOpen(false);
        setLocalError('Search is unavailable right now. Please try again.');
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 320);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!event.target.closest?.('[data-search-root]')) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  async function choose(place) {
    setOpen(false);
    setQuery('');
    setSuggestions([]);
    setLocalError('');
    await loadPlace(place);
  }

  async function onSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setLocalError('Enter a city name to search.');
      setSearchError('');
      return;
    }
    if (open && suggestions[highlight]) {
      await choose(suggestions[highlight]);
      return;
    }
    setSearching(true);
    try {
      const results = suggestions.length ? suggestions : await searchCities(trimmed);
      if (!results.length) {
        setLocalError(`No cities found for “${trimmed}”. Check the spelling and try again.`);
        setOpen(false);
        return;
      }
      await choose(results[0]);
    } catch (err) {
      if (err?.name !== 'AbortError') setLocalError('Search is unavailable right now. Please try again.');
    } finally {
      setSearching(false);
    }
  }

  function onKeyDown(event) {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setHighlight((current) => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setHighlight((current) => (current - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  const message = localError || searchError;

  return (
    <div data-search-root="true">
      <form className="search-shell" onSubmit={onSubmit} role="search">
        <label htmlFor="city-search" className="sr-only">Search city</label>
        <input
          id="city-search"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-current placeholder:opacity-50"
          value={query}
          placeholder="Search for a city"
          role="combobox"
          aria-expanded={open}
          aria-controls="city-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={open ? `city-opt-${highlight}` : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={80}
          enterKeyHint="search"
          onChange={(event) => {
            setQuery(event.target.value);
            setLocalError('');
            setSearchError('');
          }}
          onFocus={() => suggestions.length && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <kbd className="mr-1 hidden rounded-md bg-black/5 px-1.5 py-0.5 text-[10px] font-semibold opacity-60 sm:block dark:bg-white/10">/</kbd>
        <button type="submit" className="icon-btn h-10 w-10 shrink-0" aria-label="Search">
          {searching || isRefreshing ? <Spinner className="h-4 w-4" /> : <SearchIcon className="h-5 w-5" />}
        </button>
        {open && suggestions.length > 0 && (
          <ul id="city-suggestions" role="listbox" className="menu">
            {suggestions.map((place, index) => (
              <li key={place.id}>
                <button
                  id={`city-opt-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === highlight}
                  className={`flex w-full flex-col px-4 py-2.5 text-left ${index === highlight ? 'bg-sky-500/15' : ''}`}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => choose(place)}
                >
                  <span className="font-semibold">{place.name}</span>
                  <span className="text-xs opacity-65">{placeSubtitle(place)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
      {message && (
        <p role="alert" className="mt-2 rounded-2xl bg-rose-600/92 px-3 py-2 text-sm font-medium text-white shadow-lg">
          {message}
        </p>
      )}
    </div>
  );
}
