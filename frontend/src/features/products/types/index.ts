/**
 * 商品レスポンス
 */
export type Product = {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    price: number;
    stockQuantity: number;
    status: string;
    createdAt: string;
};

/**
 * Pageレスポンス
 */
export type PageResponse<T> = {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
};

/**
 * カーソルページングレスポンス
 */
export type CursorPageResponse<T> = {
    content: T[];
    nextCursor: string | null;
    hasNext: boolean;
};
