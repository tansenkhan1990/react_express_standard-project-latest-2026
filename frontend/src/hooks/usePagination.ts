import { useMemo, useState } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  page: number;
  totalPages: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
  next: () => void;
  prev: () => void;
  goTo: (p: number) => void;
  pages: number[]; // visible page numbers for a paginator
}

/**
 * Pagination logic hook.  Returns computed values and navigation helpers.
 *
 * @example
 * const { page, totalPages, next, prev, startIndex, endIndex } = usePagination({
 *   totalItems: 100,
 *   pageSize: 10,
 * });
 */
export function usePagination({
  totalItems,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const hasNext = safePage < totalPages;
  const hasPrev = safePage > 1;

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  /** Build a compact page-number array for the pagination UI. */
  const pages = useMemo(() => {
    const delta = 2;
    const range: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - delta && i <= safePage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== -1) {
        range.push(-1); // ellipsis sentinel
      }
    }

    return range;
  }, [totalPages, safePage]);

  return {
    page: safePage,
    totalPages,
    pageSize,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
    next,
    prev,
    goTo,
    pages,
  };
}
