import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, pageCount, onPageChange }) {
  const visibleCount = 5;
  const windowStart =
    Math.floor((currentPage - 1) / visibleCount) * visibleCount + 1;
  const windowEnd = Math.min(windowStart + visibleCount - 1, pageCount);
  const pages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, index) => windowStart + index,
  );

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="page-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={15} />
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`page-number ${page === currentPage ? "active" : ""}`}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="page-button"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
