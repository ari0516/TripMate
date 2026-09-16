import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

const CONTROL_BASE =
  "w-full rounded-[14px] border border-white/70 bg-white/70 px-3.5 text-sm text-[#292533] placeholder:text-[#b8b3c0] transition focus:border-[#a78bfa]/60 focus:bg-white";

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  required,
  hint,
  error,
  htmlFor,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-semibold text-[#625d6d]"
      >
        {label}
        {required ? <span className="ml-1 text-[#e8798f]">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-[12px] font-medium text-[#c2506a]">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-[#918b9c]">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL_BASE, "h-12", className)} {...rest} />;
}

export function SelectInput({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL_BASE, "h-12 pr-8", className)} {...rest}>
      {children}
    </select>
  );
}

export function TextArea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(CONTROL_BASE, "py-3 leading-relaxed", className)} {...rest} />
  );
}

/** 카테고리 선택 등에 사용하는 토글 칩 */
export function Chip({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 cursor-pointer rounded-full border px-3.5 text-[13px] font-medium transition",
        active
          ? "border-transparent bg-[linear-gradient(135deg,#8b5cf6,#a78bfa)] text-white shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
          : "border-white/70 bg-white/55 text-[#625d6d] hover:bg-white/80",
        className,
      )}
    >
      {children}
    </button>
  );
}
