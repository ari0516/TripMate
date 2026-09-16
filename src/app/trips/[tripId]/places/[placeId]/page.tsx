import { PlaceDetailView } from "@/components/place/PlaceDetailView";

export default async function PlaceDetailPage({
  params,
}: PageProps<"/trips/[tripId]/places/[placeId]">) {
  const { tripId, placeId } = await params;
  return <PlaceDetailView tripId={tripId} placeId={placeId} />;
}
