import { type NextRequest, NextResponse } from "next/server";

/**
 * Google Places 사진을 서버에서 대신 받아온다.
 * 브라우저에 API 키를 노출하지 않기 위한 프록시.
 */
export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");
  const maxWidth = request.nextUrl.searchParams.get("maxWidth") ?? "400";

  if (!name) {
    return NextResponse.json({ error: "사진을 찾을 수 없습니다." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places API 키가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const mediaUrl = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${encodeURIComponent(maxWidth)}&key=${apiKey}`;
  const response = await fetch(mediaUrl);

  if (!response.ok || !response.body) {
    return NextResponse.json({ error: "사진을 불러오지 못했습니다." }, { status: 502 });
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
