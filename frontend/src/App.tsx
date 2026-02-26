import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ProductListCursor, ProductListOffset, ProductListSearch } from "@/features/products";

type Tab = "offset" | "cursor" | "search";

/**
 * アプリケーションルート
 */
export const App = () => {
    const [tab, setTab] = useState<Tab>("search");

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">
            <h1 className="text-2xl font-bold">商品管理（500万件）</h1>

            <div className="flex gap-2">
                <Button variant={tab === "offset" ? "default" : "outline"} onClick={() => setTab("offset")}>
                    LIMIT OFFSET
                </Button>
                <Button variant={tab === "cursor" ? "default" : "outline"} onClick={() => setTab("cursor")}>
                    カーソル
                </Button>
                <Button variant={tab === "search" ? "default" : "outline"} onClick={() => setTab("search")}>
                    Elasticsearch検索
                </Button>
            </div>

            {tab === "offset" && <ProductListOffset />}
            {tab === "cursor" && <ProductListCursor />}
            {tab === "search" && <ProductListSearch />}
        </div>
    );
};
