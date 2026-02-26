import { env } from "@/config/env";
import type { CursorPageResponse, PageResponse, Product } from "@/features/products/types";

/**
 * LIMIT OFFSETページングで商品一覧を取得する
 */
export const fetchProductsWithOffset = async (page: number, size: number): Promise<PageResponse<Product>> => {
    const response = await fetch(`${env.API_URL}/api/products?page=${page}&size=${size}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return response.json();
};

/**
 * カーソルページングで商品一覧を取得する
 */
export const fetchProductsWithCursor = async (lastId: string, size: number): Promise<CursorPageResponse<Product>> => {
    const response = await fetch(`${env.API_URL}/api/products/cursor?lastId=${lastId}&size=${size}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return response.json();
};

/**
 * Elasticsearchで商品を検索する
 */
export const searchProducts = async (
    query: string,
    size: number = 20,
    searchAfter?: string | null,
): Promise<CursorPageResponse<Product>> => {
    const params = new URLSearchParams({
        q: query,
        size: size.toString(),
    });
    if (searchAfter != null) {
        params.set("searchAfter", searchAfter);
    }

    const response = await fetch(`${env.API_URL}/api/products/search?${params}`);
    if (!response.ok) {
        throw new Error(`検索に失敗しました: ${response.status}`);
    }
    return response.json();
};
