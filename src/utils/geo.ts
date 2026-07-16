import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface Place {
  n: string; // romanised name
  k?: string; // Korean name, absent when GeoNames has none
  c: string; // ISO 3166-1 alpha-2 country code
  y: number; // latitude
  x: number; // longitude
}

export interface Nearest {
  name: string;
  /** Absent for the ~57% of places GeoNames has no Korean name for; fall back to `name`. */
  koreanName?: string;
  country: string;
  distance: number;
  /** 16-point compass heading from the place towards the queried point. */
  direction: string;
}

const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const EARTH_RADIUS = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// Parsed rather than imported so `tsc` doesn't infer a type for all 6k entries.
//
// cities.json is derived from two GeoNames dumps (CC BY 4.0, download.geonames.org/export/dump):
//   cities15000      -> kept where population >= 100,000 or feature code is PPLC, so that small
//                       island capitals (Hagåtña, Majuro, Palikir) survive as cyclone anchors
//   alternateNamesV2 -> the `k` field: isolanguage=ko, isPreferredName first, isHistoric/isColloquial
//                       dropped. Do not source Korean names from the cities15000 `alternatenames`
//                       column instead — it is untagged and unordered, and yields Seoul as 경성.
// Administrative suffixes are trimmed (서울특별시 -> 서울, 나하 시 -> 나하); a bare trailing 시 is only
// safe to strip for KR, since elsewhere it belongs to the name (아카시).
const __dirname = dirname(fileURLToPath(import.meta.url));
const places: Place[] = JSON.parse(readFileSync(resolve(__dirname, '../data/cities.json'), 'utf-8'));

function distance(fromY: number, fromX: number, toY: number, toX: number) {
  const dy = toRadians(toY - fromY);
  const dx = toRadians(toX - fromX);
  const a = Math.sin(dy / 2) ** 2 + Math.cos(toRadians(fromY)) * Math.cos(toRadians(toY)) * Math.sin(dx / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}

function bearing(fromY: number, fromX: number, toY: number, toX: number) {
  const dx = toRadians(toX - fromX);
  const y = Math.sin(dx) * Math.cos(toRadians(toY));
  const x = Math.cos(toRadians(fromY)) * Math.sin(toRadians(toY)) - Math.sin(toRadians(fromY)) * Math.cos(toRadians(toY)) * Math.cos(dx);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** The best-known settlement to describe a position by — tropical cyclones sit at sea, so this is often far away. */
export function nearestPlace(longitude: number, latitude: number): Nearest | null {
  let best: Place | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const place of places) {
    const km = distance(place.y, place.x, latitude, longitude);
    if (km < bestDistance) {
      bestDistance = km;
      best = place;
    }
  }
  if (!best) return null;

  return {
    name: best.n,
    koreanName: best.k,
    country: best.c,
    distance: bestDistance,
    direction: COMPASS[Math.round(bearing(best.y, best.x, latitude, longitude) / 22.5) % 16]
  };
}
