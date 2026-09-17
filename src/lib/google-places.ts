import type { DayKey, OpeningHours } from "./types";

/** Google Places API 요일 인덱스(0=일 ~ 6=토) → 우리 DayKey */
const GOOGLE_DAY_TO_KEY: DayKey[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export interface PlaceSearchResult {
  placeId: string;
  name: string;
  address: string;
  openingHours: OpeningHours;
  closedDays: DayKey[];
  mapUrl?: string;
  /** Google Places 사진 리소스 이름 목록 (최대 6장) */
  photos: string[];
}

interface GoogleTimePoint {
  day: number;
  hour: number;
  minute: number;
}

interface GooglePeriod {
  open?: GoogleTimePoint;
  close?: GoogleTimePoint;
}

interface GooglePhotoRaw {
  name: string;
}

interface GooglePlaceRaw {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  regularOpeningHours?: { periods?: GooglePeriod[] };
  googleMapsUri?: string;
  photos?: GooglePhotoRaw[];
}

const MAX_PHOTOS = 6;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseOpeningHours(periods: GooglePeriod[] | undefined): {
  openingHours: OpeningHours;
  closedDays: DayKey[];
} {
  const openingHours: OpeningHours = {};

  if (!periods || periods.length === 0) {
    return { openingHours, closedDays: [] };
  }

  for (const period of periods) {
    if (!period.open) continue;
    const dayKey = GOOGLE_DAY_TO_KEY[period.open.day];
    if (!dayKey) continue;

    const openTime = `${pad(period.open.hour)}:${pad(period.open.minute)}`;
    const closeTime = period.close
      ? `${pad(period.close.hour)}:${pad(period.close.minute)}`
      : "23:59";

    openingHours[dayKey] = [openTime, closeTime];
  }

  const closedDays = GOOGLE_DAY_TO_KEY.filter((key) => !openingHours[key]);

  return { openingHours, closedDays };
}

export function parseGooglePlace(raw: GooglePlaceRaw): PlaceSearchResult {
  const { openingHours, closedDays } = parseOpeningHours(
    raw.regularOpeningHours?.periods,
  );

  return {
    placeId: raw.id,
    name: raw.displayName?.text ?? "",
    address: raw.formattedAddress ?? "",
    openingHours,
    closedDays,
    mapUrl: raw.googleMapsUri,
    photos: (raw.photos ?? []).slice(0, MAX_PHOTOS).map((p) => p.name),
  };
}

export async function searchGooglePlaces(
  query: string,
  apiKey: string,
): Promise<PlaceSearchResult[]> {
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.regularOpeningHours,places.googleMapsUri,places.photos",
    },
    body: JSON.stringify({ textQuery: query, languageCode: "ko" }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Places 요청 실패 (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as { places?: GooglePlaceRaw[] };
  return (data.places ?? []).map(parseGooglePlace);
}
