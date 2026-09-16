export interface NavItem {
  key: string;
  label: string;
  icon: string;
  /** tripId 를 받아 경로를 만든다 */
  href: (tripId: string) => string;
  /** 활성 여부 판단 */
  isActive: (pathname: string, tripId: string) => boolean;
}

export const TRIP_NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "홈",
    icon: "🏠",
    href: (tripId) => `/trips/${tripId}`,
    isActive: (pathname, tripId) => pathname === `/trips/${tripId}`,
  },
  {
    key: "schedule",
    label: "일정",
    icon: "📅",
    href: (tripId) => `/trips/${tripId}/schedule`,
    isActive: (pathname, tripId) =>
      pathname.startsWith(`/trips/${tripId}/schedule`),
  },
  {
    key: "places",
    label: "장소",
    icon: "📍",
    href: (tripId) => `/trips/${tripId}/places`,
    isActive: (pathname, tripId) =>
      pathname.startsWith(`/trips/${tripId}/places`),
  },
];
