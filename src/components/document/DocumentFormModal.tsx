"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import { Chip, Field, TextArea, TextInput } from "@/components/common/Field";
import { ConfirmDialog, Modal } from "@/components/common/Modal";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { compressImage } from "@/lib/image";
import type { DocumentCategory, TravelDocument } from "@/lib/types";
import { useTripStore } from "@/store/useTripStore";

interface DocumentFormModalProps {
  onClose: () => void;
  tripId: string;
  /** 수정 모드일 때 대상 서류 */
  editing?: TravelDocument | null;
}

/**
 * 열릴 때만 마운트되는 폼 모달.
 * 호출하는 쪽에서 `{open && <DocumentFormModal ... />}` 형태로 렌더링한다.
 */
export function DocumentFormModal({
  onClose,
  tripId,
  editing,
}: DocumentFormModalProps) {
  const addDocument = useTripStore((state) => state.addDocument);
  const updateDocument = useTripStore((state) => state.updateDocument);
  const removeDocument = useTripStore((state) => state.removeDocument);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState<DocumentCategory>(
    editing?.category ?? "티켓",
  );
  const [imageDataUrl, setImageDataUrl] = useState(
    editing?.imageDataUrl ?? "",
  );
  const [memo, setMemo] = useState(editing?.memo ?? "");
  const [processingImage, setProcessingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;
    setProcessingImage(true);
    try {
      const dataUrl = await compressImage(file);
      setImageDataUrl(dataUrl);
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        image: "이미지를 불러오지 못했습니다. 다시 시도해주세요.",
      }));
    } finally {
      setProcessingImage(false);
    }
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "제목을 입력해주세요.";
    if (!imageDataUrl) nextErrors.image = "사진을 추가해주세요.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      tripId,
      title: title.trim(),
      category,
      imageDataUrl,
      memo: memo.trim() || undefined,
    };

    if (editing) updateDocument(editing.id, payload);
    else addDocument(payload);
    onClose();
  }

  function handleDelete() {
    if (editing) removeDocument(editing.id);
    setConfirmDelete(false);
    onClose();
  }

  return (
    <>
      <Modal
        open
        title={editing ? "서류 수정" : "서류 추가"}
        onClose={onClose}
        footer={
          <div className="flex gap-2">
            {editing ? (
              <Button
                variant="danger"
                size="lg"
                onClick={() => setConfirmDelete(true)}
                className="px-5"
              >
                삭제
              </Button>
            ) : null}
            <Button size="lg" fullWidth onClick={handleSubmit}>
              {editing ? "저장" : "서류 추가"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <Field label="사진" required error={errors.image}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            {imageDataUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="block w-full cursor-pointer overflow-hidden rounded-[16px] border border-white/70"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- 클라이언트에서 압축한 base64 이미지라 next/image 최적화 대상이 아님 */}
                <img
                  src={imageDataUrl}
                  alt=""
                  className="max-h-[280px] w-full object-contain bg-white/60"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={processingImage}
                className="flex h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[16px] border border-dashed border-[#c9c4d2] bg-white/40 text-[#918b9c] transition hover:bg-white/60 disabled:opacity-50"
              >
                <span className="text-[24px]" aria-hidden>
                  📷
                </span>
                <span className="text-[13px] font-medium">
                  {processingImage ? "처리 중..." : "사진 선택하기"}
                </span>
              </button>
            )}
            {imageDataUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-[12px] font-semibold text-[#6d3fd4] underline underline-offset-2"
              >
                다른 사진으로 바꾸기
              </button>
            ) : null}
          </Field>

          <Field label="제목" required htmlFor="doc-title" error={errors.title}>
            <TextInput
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 나리타 공항 e티켓"
            />
          </Field>

          <Field label="카테고리" required>
            <div className="flex flex-wrap gap-2">
              {DOCUMENT_CATEGORIES.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="메모" htmlFor="doc-memo">
            <TextArea
              id="doc-memo"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예) 입국 시 여권과 함께 제시"
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="서류를 삭제할까요?"
        description="삭제한 서류는 복구할 수 없습니다."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
