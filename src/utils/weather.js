const LABELS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Violent showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm and hail',
  99: 'Thunderstorm and hail',
};

export const POPULAR_CITIES = [
  'London',
  'New York',
  'Tokyo',
  'Paris',
  'Dubai',
  'Sydney',
  'Mumbai',
  'Singapore',
];

export function weatherLabel(code) {
  return LABELS[code] || 'Unknown conditions';
}

export function getIconType(code, isDay = true) {
  if (code === 0 || code === 1) return isDay ? 'clear-day' : 'clear-night';
  if (code === 2) return isDay ? 'partly-day' : 'partly-night';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'thunder';
  return isDay ? 'partly-day' : 'partly-night';
}

export function getScene(code, isDay = true) {
  const icon = getIconType(code, isDay);
  if (icon === 'clear-day' || icon === 'clear-night') return isDay ? 'clear-day' : 'clear-night';
  if (icon === 'partly-day' || icon === 'partly-night') return isDay ? 'partly-day' : 'partly-night';
  if (icon === 'cloudy') return isDay ? 'cloudy-day' : 'cloudy-night';
  if (icon === 'fog') return isDay ? 'fog-day' : 'fog-night';
  if (icon === 'drizzle' || icon === 'rain') return isDay ? 'rain-day' : 'rain-night';
  if (icon === 'snow') return isDay ? 'snow-day' : 'snow-night';
  if (icon === 'thunder') return 'thunder';
  return isDay ? 'partly-day' : 'partly-night';
}
