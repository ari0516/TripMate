import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(135deg,#8b5cf6,#a78bfa)] shadow-[0_6px_18px_rgba(139,92,246,0.28)] hover:brightness-105 active:brightness-95",
  secondary:
    "text-[#0f5e5c] bg-[linear-gradient(135deg,#67d9d5,#91cff5)] shadow-[0_6px_18px_rgba(103,217,213,0.26)] hover:brightness-105 active:brightness-95",
  ghost:
    "text-[#625d6d] bg-white/55 border border-white/70 hover:bg-white/80 active:bg-white/90",
  danger:
    "text-[#c2506a] bg-[#e8798f]/12 border border-[#e8798f]/32 hover:bg-[#e8798f]/20",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] rounded-[12px]",
  md: "h-11 px-4 text-sm rounded-[14px]",
  lg: "h-13 px-5 text-[15px] rounded-[16px]",
};

const BASE =
  "inline-flex items-center justify-center gap-1.5 font-semibold transition disabled:opacity-45 disabled:pointer-events-none whitespace-nowrap cursor-pointer";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        BASE,
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends CommonProps {
  href: string;
  target?: string;
  rel?: string;
}

/** Button 과 동일한 스타일을 갖는 링크 (내부 이동 / 외부 링크 공용) */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  target,
  rel,
}: ButtonLinkProps) {
  const classes = cn(
    BASE,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth && "w-full",
    className,
  );

  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
