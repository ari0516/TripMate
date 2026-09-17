"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Field, TextInput } from "@/components/common/Field";
import { GlassCard } from "@/components/common/GlassCard";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (message.includes("already registered")) {
    return "이미 가입된 이메일입니다. 로그인해주세요.";
  }
  if (message.includes("Password should be at least")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  if (message.includes("Unable to validate email address")) {
    return "올바른 이메일 형식이 아닙니다.";
  }
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } =
      mode === "signup"
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

    if (authError) {
      setError(translateAuthError(authError.message));
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-5 py-10">
      <header className="mb-8 flex items-center justify-center gap-2 text-[19px] font-bold text-[#292533]">
        <span aria-hidden>✈️</span> TripMate
      </header>

      <GlassCard level="base" className="p-6">
        <div className="space-y-5">
          <div className="text-center">
            <p className="text-[17px] font-bold text-[#292533]">
              {mode === "signup" ? "회원가입" : "로그인"}
            </p>
            <p className="mt-1 text-[13px] text-[#625d6d]">
              이메일과 비밀번호를 입력해주세요.
            </p>
          </div>

          <Field label="이메일" required htmlFor="auth-email">
            <TextInput
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="you@example.com"
            />
          </Field>

          <Field
            label="비밀번호"
            required
            htmlFor="auth-password"
            error={error}
            hint={mode === "signup" ? "6자 이상 입력해주세요." : undefined}
          >
            <TextInput
              id="auth-password"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </Field>

          <Button
            size="lg"
            fullWidth
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting
              ? "처리 중..."
              : mode === "signup"
                ? "회원가입"
                : "로그인"}
          </Button>

          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === "signup" ? "login" : "signup"));
              setError(null);
            }}
            className="w-full cursor-pointer text-center text-[13px] font-medium text-[#6d3fd4]"
          >
            {mode === "signup"
              ? "이미 계정이 있으신가요? 로그인"
              : "계정이 없으신가요? 회원가입"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
