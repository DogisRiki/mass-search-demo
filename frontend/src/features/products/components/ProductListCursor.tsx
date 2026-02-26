import { Button } from "@/components/ui/button";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductTableSkeleton } from "@/features/products/components/ProductTableSkeleton";
import { useProductsCursor } from "@/features/products/hooks/useProductsCursor";

/**
 * 商品一覧コンテナ（カーソルページング）
 */
export const ProductListCursor = () => {
    const { data, isLoading, error, goNext, goPrev, hasPrev } = useProductsCursor(20);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">商品一覧（カーソルページング）</h2>

            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

            {isLoading ? <ProductTableSkeleton /> : data ? <ProductTable products={data.content} /> : null}

            {data && (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={goPrev} disabled={!hasPrev}>
                        前へ
                    </Button>
                    <Button variant="outline" size="sm" onClick={goNext} disabled={!data.hasNext}>
                        次へ
                    </Button>
                </div>
            )}
        </div>
    );
};
