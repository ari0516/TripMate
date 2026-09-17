"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/common/Button";
import { Field, TextInput } from "@/components/common/Field";
import { GlassCard } from "@/components/common/GlassCard";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "invalid-link"
      ? "링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요."
      : null,
  );

  async function handleSubmit() {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setStatus("idle");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-5 py-10">
      <header className="mb-8 flex items-center justify-center gap-2 text-[19px] font-bold text-[#292533]">
        <span aria-hidden>✈️</span> TripMate
      </header>

      <GlassCard level="base" className="p-6">
        {status === "sent" ? (
          <div className="space-y-2 text-center">
            <p className="text-[32px]" aria-hidden>
              📩
            </p>
            <p className="text-[15px] font-semibold text-[#292533]">
              메일함을 확인해주세요
            </p>
            <p className="text-[13px] leading-relaxed text-[#625d6d]">
              {email} 로 로그인 링크를 보냈습니다.
              <br />
              메일의 링크를 눌러 로그인을 완료해주세요.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-[17px] font-bold text-[#292533]">로그인</p>
              <p className="mt-1 text-[13px] text-[#625d6d]">
                이메일로 받은 매직링크로 로그인하세요.
              </p>
            </div>

            <Field label="이메일" required htmlFor="login-email" error={error}>
              <TextInput
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="you@example.com"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </Field>

            <Button
              size="lg"
              fullWidth
              disabled={status === "sending"}
              onClick={handleSubmit}
            >
              {status === "sending" ? "전송 중..." : "매직링크 보내기"}
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
