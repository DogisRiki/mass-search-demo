import { Button } from "@/components/ui/button";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

/**
 * ページ番号ナビゲーション
 */
export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const showCount = 5;
        let start = Math.max(0, currentPage - Math.floor(showCount / 2));
        const end = Math.min(totalPages - 1, start + showCount - 1);
        start = Math.max(0, end - showCount + 1);

        if (start > 0) {
            pages.push(0);
            if (start > 1) pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            if (end < totalPages - 2) pages.push("...");
            pages.push(totalPages - 1);
        }

        return pages;
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                前へ
            </Button>

            {getPageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                        ...
                    </span>
                ) : (
                    <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum + 1}
                    </Button>
                ),
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
            >
                次へ
            </Button>
        </div>
    );
};
