import { ButtonLink } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";

export function TripNotFound() {
  return (
    <EmptyState
      icon="🧭"
      title="여행을 찾을 수 없어요"
      description="삭제되었거나 존재하지 않는 여행입니다."
      action={<ButtonLink href="/">내 여행으로 돌아가기</ButtonLink>}
    />
  );
}
