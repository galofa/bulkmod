import React from "react";
import { Button } from "../ui";

interface PaginationProps {
  hasResults: boolean;
  currentPage: number;
  totalResults: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  hasResults, 
  currentPage, 
  totalResults, 
  itemsPerPage, 
  onPageChange 
}: PaginationProps) {
  if (!hasResults || totalResults === 0) {
    return null;
  }

  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const maxVisiblePages = 5;
  
  // Calculate which pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex justify-center items-center gap-2 text-sm text-slate-400">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1"
      >
        ←
      </Button>

      {/* First page */}
      {startPage > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="w-8 h-8 rounded-full"
          >
            1
          </Button>
          {startPage > 2 && <span className="text-slate-600">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className="w-8 h-8 rounded-full"
        >
          {page}
        </Button>
      ))}

      {/* Last page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-slate-600">...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 rounded-full"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1"
      >
        →
      </Button>
    </div>
  );
} 