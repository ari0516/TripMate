import { type NextRequest, NextResponse } from "next/server";

import { searchGooglePlaces } from "@/lib/google-places";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "검색어를 입력해주세요." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places API 키가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  try {
    const results = await searchGooglePlaces(query, apiKey);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "검색에 실패했습니다." },
      { status: 502 },
    );
  }
}
