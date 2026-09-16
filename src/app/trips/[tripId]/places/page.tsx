import { PlaceListView } from "@/components/place/PlaceListView";

export default async function PlacesPage({
  params,
}: PageProps<"/trips/[tripId]/places">) {
  const { tripId } = await params;
  return <PlaceListView tripId={tripId} />;
}
