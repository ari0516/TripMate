"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** 하단 고정 액션 영역 */
  footer?: ReactNode;
  size?: "sm" | "md";
}

/**
 * 모바일에서는 바텀시트, 데스크톱에서는 가운데 정렬 다이얼로그로 표시한다.
 * Navigation / Modal 레이어이므로 강한 Glass 를 사용한다.
 */
export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[#292533]/25 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "glass-strong relative flex max-h-[90dvh] w-full flex-col rounded-t-[24px] sm:rounded-[24px]",
          size === "sm" ? "sm:max-w-[400px]" : "sm:max-w-[520px]",
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 px-5 pt-5 pb-3">
          <h2 className="text-[18px] font-bold text-[#292533]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/70 bg-white/60 text-[#625d6d] transition hover:bg-white/90"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>

        {footer ? (
          <footer className="shrink-0 border-t border-white/50 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "삭제",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} size="sm">
      <p className="text-sm leading-relaxed text-[#625d6d]">{description}</p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 flex-1 cursor-pointer rounded-[14px] border border-white/70 bg-white/60 text-sm font-semibold text-[#625d6d] transition hover:bg-white/90"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="h-11 flex-1 cursor-pointer rounded-[14px] border border-[#e8798f]/35 bg-[#e8798f]/15 text-sm font-semibold text-[#c2506a] transition hover:bg-[#e8798f]/25"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
