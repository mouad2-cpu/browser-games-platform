import type { Metadata } from "next";
import { searchGames } from "@/lib/games";
import { SearchPageView } from "@/components/pages/search-page-view";
import { buildPageMetadata } from "@/lib/seo-metadata";

type Props = {
  searchParams: Promise<{ s?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { s } = await searchParams;
  const query = s?.trim() ?? "";

  if (!query) {
    return buildPageMetadata({
      path: "/search",
      title: "Search Games",
      description:
        "Search free online games and unblocked HTML5 browser games on ZenFun Games. Find action, puzzle, racing, sports, and more.",
      index: true,
    });
  }

  return buildPageMetadata({
    path: "/search",
    title: `Search: ${query}`,
    description: `Search results for “${query}” on ZenFun Games — free online and unblocked browser games.`,
    index: false,
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const { s, page: pageParam } = await searchParams;
  const query = s?.trim() ?? "";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  if (!query) {
    return <SearchPageView games={[]} query="" />;
  }

  const { games } = await searchGames(query, page);

  return <SearchPageView games={games} query={query} />;
}
