import type { Holiday } from '../interfaces';

type NagerPublicHoliday = {
  date: string; // YYYY-MM-DD
  localName: string;
  name: string;
  countryCode: string;
  fixed?: boolean;
  global?: boolean;
  counties?: string[] | null;
  launchYear?: number | null;
  types?: string[];
};

const cacheKey = (countryCode: string, year: number) => `holidays:${countryCode}:${year}`;

const safeParseJson = <T,>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const fetchPublicHolidays = async (year: number, countryCode: string): Promise<Holiday[]> => {
  const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
  if (!res.ok) {
    throw new Error(`Holiday API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as NagerPublicHoliday[];
  if (!Array.isArray(data)) return [];

  return data
    .filter(item => typeof item?.date === 'string' && item.date.length === 10)
    .map((item) => ({
      date: item.date,
      name: item.localName || item.name,
      type: 'Holiday',
    }));
};

export const loadCachedPublicHolidays = (year: number, countryCode: string): Holiday[] | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(cacheKey(countryCode, year));
  if (!raw) return null;

  const parsed = safeParseJson<Holiday[]>(raw);
  if (!parsed || !Array.isArray(parsed)) return null;

  return parsed.filter(h => typeof h?.date === 'string' && typeof h?.name === 'string');
};

export const cachePublicHolidays = (year: number, countryCode: string, holidays: Holiday[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(cacheKey(countryCode, year), JSON.stringify(holidays));
};

export const getPublicHolidaysCached = async (year: number, countryCode: string): Promise<Holiday[]> => {
  const cached = loadCachedPublicHolidays(year, countryCode);
  if (cached) return cached;

  const fresh = await fetchPublicHolidays(year, countryCode);
  cachePublicHolidays(year, countryCode, fresh);
  return fresh;
};

export const getPhilippinesHolidaysFromApi = (year: number) => getPublicHolidaysCached(year, 'PH');
