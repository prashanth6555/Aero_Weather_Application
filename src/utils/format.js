export function toUnit(celsius, unit) {
  if (celsius == null || Number.isNaN(Number(celsius))) return null;
  const value = unit === 'f' ? (Number(celsius) * 9) / 5 + 32 : Number(celsius);
  return Math.round(value);
}

export function formatTemp(celsius, unit) {
  const value = toUnit(celsius, unit);
  if (value == null) return '—';
  return `${value}°`;
}

export function formatWind(kmh, unit) {
  if (kmh == null || Number.isNaN(Number(kmh))) return '—';
  if (unit === 'f') return `${Math.round(Number(kmh) * 0.621371)} mph`;
  return `${Math.round(Number(kmh))} km/h`;
}

export function formatVisibility(meters, unit) {
  if (meters == null || Number.isNaN(Number(meters))) return '—';
  if (unit === 'f') {
    const miles = Number(meters) / 1609.344;
    return `${miles >= 10 ? Math.round(miles) : miles.toFixed(1)} mi`;
  }
  const km = Number(meters) / 1000;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

export function formatPressure(hPa) {
  if (hPa == null || Number.isNaN(Number(hPa))) return '—';
  return `${Math.round(Number(hPa))} hPa`;
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${Math.round(Number(value))}%`;
}

export function compass(deg) {
  if (deg == null || Number.isNaN(Number(deg))) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(Number(deg) / 45) % 8];
}

function formatWithZone(date, timeZone, options) {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone, ...options }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}

export function formatClock(date, timeZone) {
  return formatWithZone(date, timeZone, { hour: 'numeric', minute: '2-digit' });
}

export function formatFullDate(date, timeZone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  }
}

export function formatTimeLabel(iso) {
  if (!iso || !iso.includes('T')) return '—';
  const [hours, minutes] = iso.split('T')[1].split(':');
  const h = Number(hours);
  const m = Number(minutes);
  if (Number.isNaN(h) || Number.isNaN(m)) return '—';
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function isoToMinutes(iso) {
  if (!iso || !iso.includes('T')) return null;
  const [hours, minutes] = iso.split('T')[1].split(':');
  const h = Number(hours);
  const m = Number(minutes);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function minutesInZone(date, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);
    let h = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
    const m = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
    if (h === 24) h = 0;
    return h * 60 + m;
  } catch {
    return date.getHours() * 60 + date.getMinutes();
  }
}

export function hourLabel(iso, index) {
  if (index === 0) return 'Now';
  if (!iso || !iso.includes('T')) return '';
  const h = Number(iso.split('T')[1].slice(0, 2));
  if (Number.isNaN(h)) return '';
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12} ${suffix}`;
}

export function dayLabel(dateIso, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const [year, month, day] = String(dateIso).split('-').map(Number);
  if (!year || !month || !day) return dateIso;
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function placeSubtitle(place) {
  if (!place) return '';
  const region = place.admin1 && place.admin1 !== place.name ? place.admin1 : '';
  return [region, place.country].filter(Boolean).join(', ');
}
