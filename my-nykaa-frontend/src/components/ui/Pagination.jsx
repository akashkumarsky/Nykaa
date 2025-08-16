import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 0) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
    };

    if (totalPages <= 1) return null; // No pagination needed

    return (
        <div className="flex items-center justify-center space-x-4 mt-8">
            {/* Previous Button */}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="flex items-center justify-center p-2 rounded-md border border-pink-500 bg-pink-100 text-pink-600 hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Page Info */}
            <span className="text-sm font-medium text-black-600">
                Page {currentPage + 1} of {totalPages}
            </span>

            {/* Next Button */}
            <button
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center justify-center p-2 rounded-md border border-pink-500 bg-pink-100 text-pink-600 hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
