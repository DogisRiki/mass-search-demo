import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { fetchProductsWithCursor } from "@/features/products/api/fetchProducts";

/**
 * カーソルページングで商品一覧を取得するフック
 */
export const useProductsCursor = (size: number = 20) => {
    const [currentCursor, setCurrentCursor] = useState("0");
    const [cursorHistory, setCursorHistory] = useState<string[]>([]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", "cursor", currentCursor, size],
        queryFn: () => fetchProductsWithCursor(currentCursor, size),
    });

    const goNext = useCallback(() => {
        if (data?.nextCursor != null) {
            setCursorHistory((prev) => [...prev, currentCursor]);
            setCurrentCursor(data.nextCursor);
        }
    }, [data, currentCursor]);

    const goPrev = useCallback(() => {
        if (cursorHistory.length > 0) {
            const prev = [...cursorHistory];
            const prevCursor = prev.pop()!;
            setCursorHistory(prev);
            setCurrentCursor(prevCursor);
        }
    }, [cursorHistory]);

    return {
        data: data ?? null,
        isLoading,
        error: error ? (error instanceof Error ? error.message : "Unknown error") : null,
        goNext,
        goPrev,
        hasPrev: cursorHistory.length > 0,
    };
};
