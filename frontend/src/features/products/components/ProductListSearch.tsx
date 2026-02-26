import { Button } from "@/components/ui/button";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductTableSkeleton } from "@/features/products/components/ProductTableSkeleton";
import { SearchBar } from "@/features/products/components/SearchBar";
import { useProductsSearch } from "@/features/products/hooks/useProductsSearch";

/**
 * 商品一覧コンテナ（Elasticsearch検索）
 */
export const ProductListSearch = () => {
    const { data, allProducts, isLoading, error, search, loadMore } = useProductsSearch(20);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">商品検索（Elasticsearch）</h2>

            <SearchBar onSearch={search} isLoading={isLoading} />

            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

            {isLoading && allProducts.length === 0 && <ProductTableSkeleton />}

            {allProducts.length > 0 && (
                <>
                    <p className="text-sm text-muted-foreground">
                        {allProducts.length}件表示
                        {data?.hasNext && "（さらに結果があります）"}
                    </p>
                    <ProductTable products={allProducts} />
                    {data?.hasNext && (
                        <div className="flex justify-center">
                            <Button variant="outline" onClick={() => loadMore()} disabled={isLoading}>
                                {isLoading ? "読み込み中..." : "もっと見る"}
                            </Button>
                        </div>
                    )}
                </>
            )}

            {allProducts.length === 0 && !isLoading && !error && (
                <p className="text-sm text-muted-foreground">キーワードを入力して検索してください</p>
            )}
        </div>
    );
};
