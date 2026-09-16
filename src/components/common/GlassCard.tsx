import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type GlassLevel = "soft" | "base" | "strong";

const LEVEL_CLASS: Record<GlassLevel, string> = {
  soft: "glass-soft",
  base: "glass-base",
  strong: "glass-strong",
};

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  /**
   * Glass 강도. 03-design-system.md 기준으로 레이어별로 다르게 사용한다.
   * soft: 일반 콘텐츠 카드 / base: 주요 Floating Card / strong: Navigation·Modal
   */
  level?: GlassLevel;
  as?: ElementType;
  children?: ReactNode;
}

export function GlassCard({
  level = "soft",
  as,
  className,
  children,
  ...rest
}: GlassCardProps) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn("rounded-[20px]", LEVEL_CLASS[level], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
