"use client";

import { useEffect } from "react";

import { DOCUMENT_CATEGORY_EMOJI } from "@/lib/constants";
import type { TravelDocument } from "@/lib/types";

interface DocumentViewerProps {
  doc: TravelDocument;
  onClose: () => void;
  onEdit: () => void;
}

/**
 * 입국심사·매장 등에서 바로 꺼내서 보여줄 수 있도록 사진을 화면 전체에 크게 띄운다.
 */
export function DocumentViewer({ doc, onClose, onEdit }: DocumentViewerProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onClose identity 변경으로 재실행할 필요 없음
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))]">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-white">
            {DOCUMENT_CATEGORY_EMOJI[doc.category]} {doc.title}
          </p>
          {doc.memo ? (
            <p className="mt-0.5 truncate text-[12px] text-white/60">
              {doc.memo}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="서류 수정"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      </header>

      <div
        className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-3"
        onClick={onClose}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 클라이언트에 저장된 base64 이미지라 next/image 최적화 대상이 아님 */}
        <img
          src={doc.imageDataUrl}
          alt={doc.title}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-[8px] object-contain"
        />
      </div>
    </div>
  );
}
