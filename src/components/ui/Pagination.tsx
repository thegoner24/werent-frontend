import React from "react";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav className="flex justify-center mt-8">
      <ul className="inline-flex items-center space-x-1">
        <li>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-l-full border border-gray-300 bg-white transition font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6b98] disabled:opacity-50 disabled:cursor-not-allowed ${currentPage !== 1 ? 'hover:bg-[#ffeaf0] hover:text-[#ff6b98]' : ''}`}
          >
            Prev
          </button>
        </li>
        {getPageNumbers().map((pageNum, idx) => (
          <li key={idx}>
            {pageNum === '...' ? (
              <span className="px-3 py-1 text-gray-400 select-none">...</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(pageNum))}
                className={`px-3 py-1 rounded-full border border-gray-300 transition font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6b98]
                  ${currentPage === pageNum
                    ? 'bg-[#ff6b98] text-white font-bold border-[#ff6b98] cursor-default'
                    : 'bg-white text-gray-700 hover:bg-[#ffeaf0] hover:text-[#ff6b98]'}
                `}
                disabled={currentPage === pageNum}
                style={{ minWidth: 36 }}
              >
                {pageNum}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-r-full border border-gray-300 bg-white transition font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6b98] disabled:opacity-50 disabled:cursor-not-allowed ${currentPage !== totalPages ? 'hover:bg-[#ffeaf0] hover:text-[#ff6b98]' : ''}`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
  