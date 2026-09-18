"use client";

import { DOCUMENT_CATEGORY_EMOJI } from "@/lib/constants";
import type { TravelDocument } from "@/lib/types";

interface DocumentCardProps {
  document: TravelDocument;
  onClick: () => void;
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-soft group block cursor-pointer overflow-hidden rounded-[18px] text-left transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(80,60,120,0.14)]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-white/50">
        {/* eslint-disable-next-line @next/next/no-img-element -- 클라이언트에 저장된 base64 이미지라 next/image 최적화 대상이 아님 */}
        <img
          src={document.imageDataUrl}
          alt=""
          className="size-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-[13px] font-semibold text-[#292533]">
          {DOCUMENT_CATEGORY_EMOJI[document.category]} {document.title}
        </p>
        <p className="mt-0.5 text-[11px] text-[#918b9c]">
          {document.category}
        </p>
      </div>
    </button>
  );
}
