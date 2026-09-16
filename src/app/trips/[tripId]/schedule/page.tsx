import { ScheduleView } from "@/components/schedule/ScheduleView";

export default async function SchedulePage({
  params,
}: PageProps<"/trips/[tripId]/schedule">) {
  const { tripId } = await params;
  return <ScheduleView tripId={tripId} />;
}
