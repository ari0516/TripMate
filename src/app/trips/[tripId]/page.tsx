import { TripDashboard } from "@/components/trip/TripDashboard";

export default async function TripDashboardPage({
  params,
}: PageProps<"/trips/[tripId]">) {
  const { tripId } = await params;
  return <TripDashboard tripId={tripId} />;
}
