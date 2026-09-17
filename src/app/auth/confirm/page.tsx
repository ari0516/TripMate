import { Button } from "@/components/common/Button";
import { GlassCard } from "@/components/common/GlassCard";

/**
 * 매직링크 이메일의 확인 링크가 도착하는 곳.
 * 링크를 열자마자 바로 로그인시키지 않고 버튼을 한 번 더 누르게 한다 —
 * 이메일 보안 스캐너(Gmail 등)가 링크를 미리 열어보며 1회용 토큰을 소모해버리는 문제를 피하기 위함.
 */
export default async function ConfirmPage({
  searchParams,
}: PageProps<"/auth/confirm">) {
  const params = await searchParams;
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : "";
  };

  const tokenHash = get("token_hash");
  const type = get("type");
  const next = get("next") || "/";

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-5 py-10">
      <header className="mb-8 flex items-center justify-center gap-2 text-[19px] font-bold text-[#292533]">
        <span aria-hidden>✈️</span> TripMate
      </header>

      <GlassCard level="base" className="space-y-4 p-6 text-center">
        {tokenHash && type ? (
          <>
            <p className="text-[32px]" aria-hidden>
              🔐
            </p>
            <p className="text-[15px] font-semibold text-[#292533]">
              로그인을 완료해주세요
            </p>
            <p className="text-[13px] leading-relaxed text-[#625d6d]">
              아래 버튼을 눌러야 로그인이 완료됩니다.
            </p>
            <form action="/auth/confirm/verify" method="POST">
              <input type="hidden" name="token_hash" value={tokenHash} />
              <input type="hidden" name="type" value={type} />
              <input type="hidden" name="next" value={next} />
              <Button type="submit" size="lg" fullWidth>
                로그인 완료하기
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-[32px]" aria-hidden>
              ⚠️
            </p>
            <p className="text-[15px] font-semibold text-[#292533]">
              유효하지 않은 링크입니다
            </p>
            <p className="text-[13px] text-[#625d6d]">
              로그인 화면에서 다시 시도해주세요.
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}
