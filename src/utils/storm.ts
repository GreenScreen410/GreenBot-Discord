import { createCanvas, loadImage, type SKRSContext2D } from '@napi-rs/canvas';

const STORM_API = 'https://zoom.earth/data/storms/';
const TIME_API = 'https://tiles.zoom.earth/times/geocolor.json';
const TILE_API = 'https://tiles.zoom.earth/geocolor';

const TILE_SIZE = 256;
const ZOOM = 5;
const IMAGE_SIZE = 800;
const IMAGE_TTL = 10 * 60 * 1000;
const TIME_TTL = 60 * 1000;

// Sub-satellite longitudes. Zoom Earth mosaics these into non-overlapping sectors, so exactly one
// of them serves imagery for any given point; the rest redirect to a blank placeholder tile.
const SATELLITES = [
  { id: 'goes-west', longitude: -137 },
  { id: 'goes-east', longitude: -75 },
  { id: 'mtg-zero', longitude: 0 },
  { id: 'msg-zero', longitude: 0 },
  { id: 'msg-iodc', longitude: 45.5 },
  { id: 'himawari', longitude: 140.7 }
];

export interface TrackPoint {
  date: string;
  coordinates: [number, number];
  wind: number;
  pressure: number | null;
  basin: string;
  forecast: boolean;
  rank: number;
  code: string;
  description: string;
}

export interface Storm {
  id: string;
  name: string;
  title: string;
  type: string;
  max: number;
  forecast: number;
  active: boolean;
  invest?: boolean;
  disturbance?: boolean;
  chance2day?: number;
  chance7day?: number;
  agencies: string;
  track: TrackPoint[];
  cone?: [number, number][];
  place?: string;
}

export interface StormImage {
  buffer: Buffer;
  satellite: string;
  date: Date;
}

type Times = Record<string, number[]>;

const imageCache = new Map<string, { value: StormImage | null; expires: number }>();
let timeCache: { value: Times; expires: number } | null = null;

const worldSize = () => 2 ** ZOOM * TILE_SIZE;

const project = (longitude: number, latitude: number) => ({
  x: ((longitude + 180) / 360) * worldSize(),
  y: ((1 - Math.asinh(Math.tan((latitude * Math.PI) / 180)) / Math.PI) / 2) * worldSize()
});

/** Shifts a longitude into the same 360° window as `center` so tracks crossing the dateline stay continuous. */
const unwrap = (longitude: number, center: number) => longitude - Math.round((longitude - center) / 360) * 360;

const longitudeDelta = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

/** Zoom Earth addresses tiles by `YYYY-MM-DD/HHmm` in UTC. */
const formatTileTime = (date: Date) => {
  const iso = date.toISOString();
  return `${iso.substring(0, 10)}/${iso.substring(11, 13)}${iso.substring(14, 16)}`;
};

export const currentPoint = (storm: Storm) => storm.track.filter((point) => !point.forecast).at(-1) ?? storm.track[0];

export const peakPoint = (storm: Storm, index: number) => storm.track[index] ?? currentPoint(storm);

async function fetchTimes(): Promise<Times> {
  if (timeCache && timeCache.expires > Date.now()) return timeCache.value;
  const response = await fetch(TIME_API);
  if (!response.ok) throw new Error(`Zoom Earth times returned ${response.status}`);
  const value = (await response.json()) as Times;
  timeCache = { value, expires: Date.now() + TIME_TTL };
  return value;
}

async function fetchStorm(id: string): Promise<Storm | null> {
  const response = await fetch(`${STORM_API}?id=${encodeURIComponent(id)}`);
  if (!response.ok) return null;
  const storm = (await response.json()) as Storm;
  return storm.track?.length ? storm : null;
}

/** Every active tropical cyclone worldwide, strongest first. Includes invests and disturbances. */
export async function fetchActiveStorms(): Promise<Storm[]> {
  const response = await fetch(`${STORM_API}?date=${new Date().toISOString().substring(0, 10)}`);
  if (!response.ok) throw new Error(`Zoom Earth storms returned ${response.status}`);

  const list = (await response.json()) as { storms?: string[]; disturbances?: string[] };
  const ids = [...(list.storms ?? []), ...(list.disturbances ?? [])];
  const storms = await Promise.all(ids.map(fetchStorm));

  return storms.filter((storm): storm is Storm => !!storm?.active).sort((a, b) => currentPoint(b).wind - currentPoint(a).wind || b.max - a.max);
}

/** Returns the tile bytes, or null when Zoom Earth has no imagery there (it redirects those to `blank.png`). */
async function fetchTile(satellite: string, time: string, x: number, y: number): Promise<Buffer | null> {
  const tiles = 2 ** ZOOM;
  if (y < 0 || y >= tiles) return null;
  const wrapped = ((x % tiles) + tiles) % tiles;

  const response = await fetch(`${TILE_API}/${satellite}/${time}/${ZOOM}/${y}/${wrapped}.jpg`);
  if (!response.ok || response.url.includes('blank.png')) return null;
  return Buffer.from(await response.arrayBuffer());
}

/** Picks the one satellite whose sector actually contains the storm by probing its centre tile. */
async function pickSatellite(times: Times, longitude: number, latitude: number) {
  const centre = project(longitude, latitude);
  const x = Math.floor(centre.x / TILE_SIZE);
  const y = Math.floor(centre.y / TILE_SIZE);

  const candidates = SATELLITES.filter((satellite) => times[satellite.id]?.length && longitudeDelta(satellite.longitude, longitude) < 85).sort(
    (a, b) => longitudeDelta(a.longitude, longitude) - longitudeDelta(b.longitude, longitude)
  );

  for (const candidate of candidates) {
    const timestamp = times[candidate.id].at(-1) as number;
    const time = formatTileTime(new Date(timestamp * 1000));
    if (await fetchTile(candidate.id, time, x, y)) return { id: candidate.id, time, date: new Date(timestamp * 1000) };
  }
  return null;
}

async function drawSatellite(ctx: SKRSContext2D, satellite: string, time: string, left: number, top: number) {
  const jobs: Promise<void>[] = [];
  for (let y = Math.floor(top / TILE_SIZE); y <= Math.floor((top + IMAGE_SIZE) / TILE_SIZE); y++) {
    for (let x = Math.floor(left / TILE_SIZE); x <= Math.floor((left + IMAGE_SIZE) / TILE_SIZE); x++) {
      const tileX = x;
      const tileY = y;
      jobs.push(
        fetchTile(satellite, time, tileX, tileY).then(async (tile) => {
          if (!tile) return;
          ctx.drawImage(await loadImage(tile), tileX * TILE_SIZE - left, tileY * TILE_SIZE - top, TILE_SIZE, TILE_SIZE);
        })
      );
    }
  }
  await Promise.all(jobs);
}

function drawPath(ctx: SKRSContext2D, points: { x: number; y: number }[], style: string, dash: number[]) {
  if (points.length < 2) return;
  ctx.save();
  ctx.setLineDash(dash);
  ctx.strokeStyle = style;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.restore();
}

function drawMarker(ctx: SKRSContext2D, point: { x: number; y: number }) {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawCone(ctx: SKRSContext2D, points: { x: number; y: number }[]) {
  if (points.length < 3) return;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawOverlay(ctx: SKRSContext2D, storm: Storm, centre: { longitude: number; latitude: number }, left: number, top: number) {
  const toPixel = ([longitude, latitude]: [number, number]) => {
    const point = project(unwrap(longitude, centre.longitude), latitude);
    return { x: point.x - left, y: point.y - top };
  };

  const observed = storm.track.filter((point) => !point.forecast);
  const forecast = storm.track.filter((point) => point.forecast);

  if (storm.cone) drawCone(ctx, storm.cone.map(toPixel));
  drawPath(
    ctx,
    observed.map((point) => toPixel(point.coordinates)),
    'rgba(255, 255, 255, 0.9)',
    []
  );
  drawPath(
    ctx,
    [currentPoint(storm), ...forecast].map((point) => toPixel(point.coordinates)),
    'rgba(255, 90, 90, 0.95)',
    [8, 6]
  );
  drawMarker(ctx, toPixel(currentPoint(storm).coordinates));
}

/** Renders a storm-centred geocolor satellite image with its track, forecast track and uncertainty cone. */
export async function renderStormImage(storm: Storm): Promise<StormImage | null> {
  const cached = imageCache.get(storm.id);
  if (cached && cached.expires > Date.now()) return cached.value;

  const value = await renderUncached(storm);
  imageCache.set(storm.id, { value, expires: Date.now() + IMAGE_TTL });
  return value;
}

async function renderUncached(storm: Storm): Promise<StormImage | null> {
  const [longitude, latitude] = currentPoint(storm).coordinates;

  const times = await fetchTimes();
  const satellite = await pickSatellite(times, longitude, latitude);
  if (!satellite) return null;

  const centre = project(longitude, latitude);
  const left = centre.x - IMAGE_SIZE / 2;
  const top = centre.y - IMAGE_SIZE / 2;

  const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0b1021';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

  await drawSatellite(ctx, satellite.id, satellite.time, left, top);
  drawOverlay(ctx, storm, { longitude, latitude }, left, top);

  return { buffer: canvas.toBuffer('image/jpeg', 85), satellite: satellite.id, date: satellite.date };
}
