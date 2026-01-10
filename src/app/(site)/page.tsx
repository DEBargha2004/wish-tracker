import { client } from "@/lib/orpc/orpc";
import type { SearchParams } from "nuqs/server";
import { loadParams } from "./_components/query-props";
import Renderer from "./_components/renderer";
import { YearEventsProvider } from "@/provider/year-events-provider";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await loadParams(searchParams);
  const res = await client.events.userEventsByMonths({ query: params.query });

  return (
    <YearEventsProvider defaultValues={{ eventsByMonth: res }}>
      <Renderer />
    </YearEventsProvider>
  );
}
