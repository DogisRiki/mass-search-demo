import { useState } from "react";

import { Button } from "@/components/ui/button";

type SearchBarProps = {
    onSearch: (query: string) => void;
    isLoading: boolean;
};

/**
 * 検索バー
 */
export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
    const [query, setQuery] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="商品名を検索..."
                className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
            />
            <Button onClick={() => query.trim() && onSearch(query.trim())} disabled={isLoading || !query.trim()}>
                {isLoading ? "検索中..." : "検索"}
            </Button>
        </div>
    );
};
