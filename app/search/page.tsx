import { Suspense } from "react";

import Products from "@/components/content/products/Products";

import { API_CONFIG } from "@/lib/config";

interface SearchPageProps {
    searchParams: Promise<{ q?: string; page?: string }>;
}

async function fetchSearchResults(q: string = "", page: number = 1) {
    try {
        const params = new URLSearchParams();
        if (q) {
            params.append("q", q);
        }
        params.append("page", page.toString());
        params.append("limit", "10");

        const response = await fetch(
            `${API_CONFIG.ENDPOINTS.products.base}/search?${params.toString()}`,
            {
                next: { revalidate: 10 },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_CONFIG.SECRET}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch search results: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            products: data.data || [],
            pagination: data.pagination || {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0,
            },
            query: data.query || q,
        };
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("Error fetching search results:", error);
        }
        return {
            products: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                pages: 0,
            },
            query: q,
        };
    }
}

async function SearchContent({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const q = params.q || "";
    const page = parseInt(params.page || "1", 10);

    const { products, pagination, query } = await fetchSearchResults(q, page);

    return (
        <div className="container space-y-6 py-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">
                    {query ? `Search Results for "${query}"` : "Search Products"}
                </h1>
                {query && (
                    <p className="text-muted-foreground">
                        Found {pagination.total} result{pagination.total !== 1 ? "s" : ""}
                    </p>
                )}
            </div>

            {products.length > 0 ? (
                <>
                    <Products products={products} />
                    {pagination.pages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <a
                                href={`/search?q=${encodeURIComponent(query)}&page=${Math.max(
                                    1,
                                    page - 1
                                )}`}
                                className={`px-4 py-2 rounded-md border ${page === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-accent"
                                    }`}
                                aria-disabled={page === 1}
                            >
                                Previous
                            </a>
                            <span className="px-4 py-2">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <a
                                href={`/search?q=${encodeURIComponent(query)}&page=${Math.min(
                                    pagination.pages,
                                    page + 1
                                )}`}
                                className={`px-4 py-2 rounded-md border ${page === pagination.pages
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-accent"
                                    }`}
                                aria-disabled={page === pagination.pages}
                            >
                                Next
                            </a>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        {query
                            ? `No products found for "${query}"`
                            : "Enter a search query to find products"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    return (
        <Suspense fallback={<div className="container py-8">Loading...</div>}>
            <SearchContent searchParams={searchParams} />
        </Suspense>
    );
}

