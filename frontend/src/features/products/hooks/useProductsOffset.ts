import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchProductsWithOffset } from "@/features/products/api/fetchProducts";

/**
 * LIMIT OFFSETページングで商品一覧を取得するフック
 */
export const useProductsOffset = (size: number = 20) => {
    const [page, setPage] = useState(0);

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", "offset", page, size],
        queryFn: () => fetchProductsWithOffset(page, size),
        placeholderData: keepPreviousData,
    });

    return {
        data: data ?? null,
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
        page,
        setPage,
    };
};
