import { Suspense } from "react";
import { SearchProvider } from "@/contexts/search-context";
import SearchFilters from "@/components/search/search-filters";
import SearchSort from "@/components/search/search-sort";
import ActiveFilters from "@/components/search/active-filters";
import SearchResults from "@/components/search/search-results";
import SearchPagination from "@/components/search/search-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <SearchProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Recherche de produits</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <SearchFilters />
          </div>

          <div className="md:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <Suspense fallback={<Skeleton className="h-10 w-48" />}>
                <SearchSort />
              </Suspense>
            </div>

            <Suspense fallback={<Skeleton className="h-8 w-full mb-4" />}>
              <ActiveFilters />
            </Suspense>

            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-80 w-full" />
                  ))}
                </div>
              }
            >
              <SearchResults searchParams={searchParams} />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-10 w-full mt-6" />}>
              <SearchPagination />
            </Suspense>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
