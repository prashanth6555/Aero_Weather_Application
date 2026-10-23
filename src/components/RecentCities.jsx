import { useApp } from '../context/AppContext';
import { CloseIcon } from './Icons';

export default function RecentCities() {
  const { recent, loadPlace, removeRecent } = useApp();
  if (!recent.length) return null;

  return (
    <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0" aria-label="Recent cities">
      {recent.map((city) => (
        <div key={city.id} className="chip">
          <button
            type="button"
            className="max-w-40 truncate bg-transparent py-1 text-sm font-semibold"
            onClick={() => loadPlace(city)}
          >
            {city.name}
            {city.country ? <span className="ml-1 font-medium opacity-60">{city.country}</span> : null}
          </button>
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-full opacity-70 hover:opacity-100"
            aria-label={`Remove ${city.name}`}
            onClick={() => removeRecent(city.id)}
          >
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
