import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from "@/features/products/types";

type ProductTableProps = {
    products: Product[];
};

/**
 * 商品一覧テーブル
 */
export const ProductTable = ({ products }: ProductTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>商品名</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead className="text-right">価格</TableHead>
                    <TableHead className="text-right">在庫</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>作成日</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-mono">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.categoryName}</TableCell>
                        <TableCell className="text-right">¥{product.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{product.stockQuantity.toLocaleString()}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                    product.status === "ACTIVE"
                                        ? "bg-green-100 text-green-800"
                                        : product.status === "INACTIVE"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                }`}
                            >
                                {product.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {new Date(product.createdAt).toLocaleDateString("ja-JP")}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
