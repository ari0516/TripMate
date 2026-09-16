"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDotDate, getDayCount } from "@/lib/date";
import { useTripStore } from "@/store/useTripStore";
import { TRIP_NAV_ITEMS } from "./navigation";

interface TripShellProps {
  tripId: string;
  children: ReactNode;
}

/**
 * 여행 내부 화면의 공통 셸.
 * Desktop: 좌측 Sidebar / Mobile: 하단 Navigation (02-wireframe.md §3)
 */
export function TripShell({ tripId, children }: TripShellProps) {
  const pathname = usePathname();
  const trip = useTripStore((state) =>
    state.trips.find((t) => t.id === tripId),
  );

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col gap-1 border-r border-white/50 bg-white/40 px-4 py-6 backdrop-blur-[20px] lg:flex">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 px-2 text-[17px] font-bold text-[#292533]"
        >
          <span aria-hidden>✈️</span> TripMate
        </Link>

        <Link
          href="/"
          className="mb-2 flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-sm font-medium text-[#625d6d] transition hover:bg-white/70"
        >
          <span aria-hidden>🧳</span> 내 여행
        </Link>

        <div className="my-2 h-px bg-white/60" />

        {TRIP_NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname, tripId);
          return (
            <Link
              key={item.key}
              href={item.href(tripId)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(167,139,250,0.10))] text-[#6d3fd4]"
                  : "text-[#625d6d] hover:bg-white/70",
              )}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {trip ? (
          <div className="mt-auto rounded-[16px] border border-white/60 bg-white/50 px-3.5 py-3">
            <p className="truncate text-[13px] font-semibold text-[#292533]">
              {trip.emoji ? `${trip.emoji} ` : ""}
              {trip.name}
            </p>
            <p className="mt-1 text-[11px] text-[#918b9c]">
              {formatDotDate(trip.startDate)} ~ {formatDotDate(trip.endDate)}
            </p>
            <p className="text-[11px] text-[#918b9c]">
              {getDayCount(trip.startDate, trip.endDate)}일
            </p>
          </div>
        ) : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/50 bg-white/55 px-4 py-3.5 backdrop-blur-[20px] lg:hidden">
          <Link
            href="/"
            aria-label="내 여행 목록으로"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/70 bg-white/70 text-[#625d6d]"
          >
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-[#292533]">
              {trip ? `${trip.emoji ?? "✈️"} ${trip.name}` : "TripMate"}
            </p>
            {trip ? (
              <p className="truncate text-[11px] text-[#918b9c]">
                {formatDotDate(trip.startDate)} ~ {formatDotDate(trip.endDate)}
              </p>
            ) : null}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[880px] flex-1 px-4 pt-5 pb-28 sm:px-6 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="glass-strong fixed inset-x-0 bottom-0 z-30 flex items-stretch gap-1 rounded-t-[20px] border-x-0 border-b-0 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
        {TRIP_NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname, tripId);
          return (
            <Link
              key={item.key}
              href={item.href(tripId)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-[14px] py-2 text-[11px] font-medium transition",
                active ? "text-[#6d3fd4]" : "text-[#918b9c]",
              )}
            >
              <span className="text-[18px]" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
