import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/** 확인 페이지에서 "로그인 완료하기" 버튼을 누르면 여기로 POST 된다 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const tokenHash = formData.get("token_hash");
  const type = formData.get("type") as EmailOtpType | null;
  const next = (formData.get("next") as string) || "/";

  if (typeof tokenHash === "string" && tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      // 303: POST 요청이므로 리다이렉트 후 GET으로 전환되도록 명시한다.
      return NextResponse.redirect(new URL(next, request.url), 303);
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=invalid-link", request.url),
    303,
  );
}
