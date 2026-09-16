import { TripShell } from "@/components/layout/TripShell";

export default async function TripLayout({
  children,
  params,
}: LayoutProps<"/trips/[tripId]">) {
  const { tripId } = await params;
  return <TripShell tripId={tripId}>{children}</TripShell>;
}
