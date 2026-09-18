"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/common/Button";
import { Chip } from "@/components/common/Field";
import { EmptyState } from "@/components/common/EmptyState";
import { DocumentCard } from "@/components/document/DocumentCard";
import { DocumentFormModal } from "@/components/document/DocumentFormModal";
import { DocumentViewer } from "@/components/document/DocumentViewer";
import { TripNotFound } from "@/components/trip/TripNotFound";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import type { DocumentCategory, TravelDocument } from "@/lib/types";
import { useHydrated, useTripStore } from "@/store/useTripStore";

type Filter = DocumentCategory | "전체";

export function DocumentView({ tripId }: { tripId: string }) {
  const hydrated = useHydrated();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === tripId));
  const documents = useTripStore((state) => state.documents);

  const [filter, setFilter] = useState<Filter>("전체");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TravelDocument | null>(null);
  const [viewing, setViewing] = useState<TravelDocument | null>(null);

  const tripDocuments = useMemo(
    () => documents.filter((d) => d.tripId === tripId),
    [documents, tripId],
  );

  const filtered = useMemo(
    () =>
      filter === "전체"
        ? tripDocuments
        : tripDocuments.filter((d) => d.category === filter),
    [tripDocuments, filter],
  );

  if (!hydrated) return <DocumentSkeleton />;
  if (!trip) return <TripNotFound />;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold tracking-tight text-[#292533]">
            🎫 서류함
          </h1>
          <p className="mt-1 text-[13px] text-[#625d6d]">
            티켓·쿠폰·입국심사 서류를 저장해두고 바로 꺼내 보여주세요.
          </p>
        </div>
        <Button
          className="shrink-0"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          ＋ 서류 추가
        </Button>
      </div>

      {tripDocuments.length > 0 ? (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {(["전체", ...DOCUMENT_CATEGORIES] as Filter[]).map((c) => (
            <Chip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              className="shrink-0"
            >
              {c}
            </Chip>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎫"
          title={
            tripDocuments.length === 0
              ? "저장한 서류가 없어요"
              : "조건에 맞는 서류가 없어요"
          }
          description={
            tripDocuments.length === 0
              ? "발급받은 티켓, 할인쿠폰, 입국심사 서류를 사진으로 저장해두세요."
              : "카테고리를 바꿔보세요."
          }
          action={
            tripDocuments.length === 0 ? (
              <Button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                ＋ 서류 추가
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onClick={() => setViewing(doc)}
            />
          ))}
        </div>
      )}

      {formOpen ? (
        <DocumentFormModal
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          tripId={tripId}
          editing={editing}
        />
      ) : null}

      {viewing ? (
        <DocumentViewer
          doc={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
            setFormOpen(true);
          }}
        />
      ) : null}
    </div>
  );
}

function DocumentSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <div className="glass-soft h-[74px] animate-pulse rounded-[20px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass-soft aspect-[4/3] animate-pulse rounded-[18px]"
          />
        ))}
      </div>
    </div>
  );
}
