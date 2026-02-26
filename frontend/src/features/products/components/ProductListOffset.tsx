import { Pagination } from "@/features/products/components/Pagination";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductTableSkeleton } from "@/features/products/components/ProductTableSkeleton";
import { useProductsOffset } from "@/features/products/hooks/useProductsOffset";

/**
 * 商品一覧コンテナ（LIMIT OFFSETページング）
 */
export const ProductListOffset = () => {
    const { data, isLoading, error, setPage } = useProductsOffset(20);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">商品一覧（LIMIT OFFSET）</h2>

            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

            {isLoading ? <ProductTableSkeleton /> : data ? <ProductTable products={data.content} /> : null}

            {data && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        全 {data.page.totalElements.toLocaleString()} 件中{" "}
                        {(data.page.number * data.page.size + 1).toLocaleString()} -{" "}
                        {Math.min((data.page.number + 1) * data.page.size, data.page.totalElements).toLocaleString()} 件
                        （ページ {data.page.number + 1} / {data.page.totalPages.toLocaleString()}）
                    </p>
                    <Pagination
                        currentPage={data.page.number}
                        totalPages={data.page.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
};
