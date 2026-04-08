'use client';

import { Button } from '@shared/ui';
import { usePagination } from './model';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
}

export function Pagination({ currentPage, lastPage }: PaginationProps) {
    const { changePage } = usePagination();

    if (lastPage <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <Button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2"
            >
                Предыдущая
            </Button>

            <span className="text-gray-100">
                Страница {currentPage} из {lastPage}
            </span>

            <Button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= lastPage}
                className="px-4 py-2"
            >
                Следующая
            </Button>
        </div>
    );
}