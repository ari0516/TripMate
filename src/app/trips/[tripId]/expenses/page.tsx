import { ExpenseView } from "@/components/expense/ExpenseView";

export default async function ExpensesPage({
  params,
}: PageProps<"/trips/[tripId]/expenses">) {
  const { tripId } = await params;
  return <ExpenseView tripId={tripId} />;
}
