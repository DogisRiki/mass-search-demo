import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { searchProducts } from "@/features/products/api/fetchProducts";

/**
 * Elasticsearch検索で商品一覧を取得するフック
 */
export const useProductsSearch = (size: number = 20) => {
    const [currentQuery, setCurrentQuery] = useState("");

    const { data, isLoading, error, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["products", "search", currentQuery, size],
        queryFn: ({ pageParam }) => searchProducts(currentQuery, size, pageParam ?? null),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
        enabled: currentQuery.trim().length > 0,
    });

    const search = useCallback((query: string) => {
        if (!query.trim()) return;
        setCurrentQuery(query);
    }, []);

    const allProducts = data?.pages.flatMap((page) => page.content) ?? [];

    return {
        data: data?.pages[data.pages.length - 1] ?? null,
        allProducts,
        isLoading: isLoading || isFetchingNextPage,
        error: error ? (error instanceof Error ? error.message : "検索エラー") : null,
        search,
        loadMore: fetchNextPage,
    };
};
