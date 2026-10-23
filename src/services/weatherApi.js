const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

const CURRENT = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'cloud_cover',
  'pressure_msl',
  'wind_speed_10m',
  'wind_direction_10m',
  'visibility',
].join(',');

const HOURLY = ['temperature_2m', 'weather_code', 'precipitation_probability', 'is_day'].join(',');

const DAILY = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'precipitation_probability_max',
].join(',');

function withTimeout(signal, ms = 15000) {
  if (typeof AbortSignal === 'undefined' || typeof AbortSignal.timeout !== 'function') return signal;
  const timeout = AbortSignal.timeout(ms);
  if (!signal) return timeout;
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([signal, timeout]);
  return signal;
}

async function getJson(url, signal) {
  const response = await fetch(url, { signal: withTimeout(signal) });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function mapPlace(result) {
  return {
    id: String(result.id),
    name: result.name,
    admin1: result.admin1 || '',
    country: result.country || result.country_code || '',
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

export async function searchCities(name, signal) {
  const params = new URLSearchParams({
    name,
    count: '5',
    language: 'en',
    format: 'json',
  });
  const data = await getJson(`${GEO_URL}?${params}`, signal);
  return (data.results ?? []).map(mapPlace);
}

export async function reverseGeocode(latitude, longitude, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'en',
  });
  const data = await getJson(`${REVERSE_URL}?${params}`, signal);
  return {
    id: `geo:${Number(latitude).toFixed(3)},${Number(longitude).toFixed(3)}`,
    name: data.city || data.locality || data.principalSubdivision || 'Current location',
    admin1: data.principalSubdivision || '',
    country: data.countryName || '',
    latitude,
    longitude,
    isCurrent: true,
  };
}

function hourIndex(times, currentTime) {
  const hour = currentTime?.slice(0, 13);
  const index = (times ?? []).findIndex((time) => time.slice(0, 13) === hour);
  return index >= 0 ? index : 0;
}

export function shapeForecast(place, data) {
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;
  if (!current || !hourly?.time || !daily?.time) throw new Error('Incomplete forecast');

  const start = hourIndex(hourly.time, current.time);
  const hours = [];
  const end = Math.min(hourly.time.length, start + 24);
  for (let index = start; index < end; index += 1) {
    hours.push({
      time: hourly.time[index],
      temperature: hourly.temperature_2m[index],
      code: hourly.weather_code[index],
      precipProbability: hourly.precipitation_probability?.[index] ?? 0,
      isDay: hourly.is_day?.[index] == null ? true : Boolean(hourly.is_day[index]),
    });
  }

  const days = daily.time.slice(0, 7).map((date, index) => ({
    date,
    code: daily.weather_code[index],
    max: daily.temperature_2m_max[index],
    min: daily.temperature_2m_min[index],
    sunrise: daily.sunrise?.[index],
    sunset: daily.sunset?.[index],
    precipProbability: daily.precipitation_probability_max?.[index] ?? 0,
  }));

  return {
    place: {
      id: String(place.id),
      name: place.name,
      admin1: place.admin1 || '',
      country: place.country || '',
      latitude: place.latitude,
      longitude: place.longitude,
      isCurrent: Boolean(place.isCurrent),
    },
    timezone: data.timezone || 'UTC',
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparent: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation ?? 0,
      code: current.weather_code,
      cloudCover: current.cloud_cover,
      pressure: current.pressure_msl,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      visibility: current.visibility,
      isDay: current.is_day == null ? true : Boolean(current.is_day),
    },
    hourly: hours,
    daily: days,
  };
}

export async function fetchForecast(place, signal) {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: CURRENT,
    hourly: HOURLY,
    daily: DAILY,
    timezone: 'auto',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });
  const data = await getJson(`${FORECAST_URL}?${params}`, signal);
  return shapeForecast(place, data);
}
