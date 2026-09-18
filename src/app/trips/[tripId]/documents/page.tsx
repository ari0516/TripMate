import { DocumentView } from "@/components/document/DocumentView";

export default async function DocumentsPage({
  params,
}: PageProps<"/trips/[tripId]/documents">) {
  const { tripId } = await params;
  return <DocumentView tripId={tripId} />;
}
